import { exec } from "child_process";
import { promisify } from "util";
import { readdir, unlink, mkdir } from "fs/promises";
import { join } from "path";

const execAsync = promisify(exec);

interface BackupConfig {
  databaseUrl: string;
  backupDir: string;
  retentionDays?: number;
}

/**
 * Create a PostgreSQL database backup
 * Usage: npm run db:backup
 */
export async function createDatabaseBackup(config: BackupConfig): Promise<string> {
  try {
    // Ensure backup directory exists
    await mkdir(config.backupDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `lacesnheels-backup-${timestamp}.sql`;
    const filepath = join(config.backupDir, filename);

    // Parse database URL
    const dbUrl = new URL(config.databaseUrl);
    const host = dbUrl.hostname;
    const port = dbUrl.port || "5432";
    const database = dbUrl.pathname.split("/")[1];
    const username = dbUrl.username;

    // Create backup using pg_dump
    const command = `PGPASSWORD="${dbUrl.password}" pg_dump -h ${host} -p ${port} -U ${username} -d ${database} -F c -f ${filepath}`;

    console.log(`[BACKUP] Creating database backup to ${filepath}...`);
    await execAsync(command);
    console.log(`[BACKUP] Successfully created backup: ${filename}`);

    // Clean up old backups
    if (config.retentionDays) {
      await cleanOldBackups(config.backupDir, config.retentionDays);
    }

    return filepath;
  } catch (error) {
    console.error("[BACKUP] Error creating backup:", error);
    throw error;
  }
}

/**
 * Restore a PostgreSQL database from backup
 * WARNING: This will overwrite the existing database
 */
export async function restoreDatabaseBackup(
  backupFilePath: string,
  config: BackupConfig
): Promise<void> {
  try {
    const dbUrl = new URL(config.databaseUrl);
    const host = dbUrl.hostname;
    const port = dbUrl.port || "5432";
    const database = dbUrl.pathname.split("/")[1];
    const username = dbUrl.username;

    console.log(`[BACKUP] Restoring database from ${backupFilePath}...`);
    const command = `PGPASSWORD="${dbUrl.password}" pg_restore -h ${host} -p ${port} -U ${username} -d ${database} -c -v ${backupFilePath}`;

    await execAsync(command);
    console.log("[BACKUP] Database restore completed successfully");
  } catch (error) {
    console.error("[BACKUP] Error restoring database:", error);
    throw error;
  }
}

/**
 * List all available backups
 */
export async function listBackups(backupDir: string): Promise<string[]> {
  try {
    const files = await readdir(backupDir);
    return files
      .filter((f) => f.startsWith("lacesnheels-backup-") && f.endsWith(".sql"))
      .sort()
      .reverse();
  } catch (error) {
    console.error("[BACKUP] Error listing backups:", error);
    return [];
  }
}

/**
 * Delete backups older than specified days
 */
export async function cleanOldBackups(
  backupDir: string,
  retentionDays: number
): Promise<void> {
  try {
    const files = await readdir(backupDir);
    const now = Date.now();
    const maxAge = retentionDays * 24 * 60 * 60 * 1000;

    for (const file of files) {
      if (!file.startsWith("lacesnheels-backup-")) continue;

      const filepath = join(backupDir, file);
      const stats = await (await import("fs")).promises.stat(filepath);
      const age = now - stats.mtime.getTime();

      if (age > maxAge) {
        await unlink(filepath);
        console.log(`[BACKUP] Deleted old backup: ${file}`);
      }
    }
  } catch (error) {
    console.error("[BACKUP] Error cleaning old backups:", error);
  }
}
