import type { Request, Response } from "express";
import { OrderModel } from "../models/order.model.js";
import type { OrderStatus } from "../models/order.model.js";

const VALID_STATUSES: OrderStatus[] = [
  "Pending", "Processing", "Shipped", "Delivered", "Cancelled",
];

export const OrderController = {
  // GET /api/orders
  async getAll(req: Request, res: Response) {
    try {
      const { status } = req.query;
      const orders = status && VALID_STATUSES.includes(status as OrderStatus)
        ? await OrderModel.getByStatus(status as OrderStatus)
        : await OrderModel.getAll();
      res.json({ success: true, data: orders });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // GET /api/orders/stats
  async getStats(_req: Request, res: Response) {
    try {
      const stats = await OrderModel.getStats();
      res.json({ success: true, data: stats });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // GET /api/orders/:id
  async getById(req: Request, res: Response) {
    try {
      const order = await OrderModel.getById(req.params.id);
      if (!order) return res.status(404).json({ success: false, message: "Order not found" });
      res.json({ success: true, data: order });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // POST /api/orders
  async create(req: Request, res: Response) {
    try {
      const { customer, customerPhone, items, total, notes } = req.body;
      if (!items?.length) {
        return res.status(400).json({ success: false, message: "Order must contain at least one item" });
      }
      if (total === undefined || total < 0) {
        return res.status(400).json({ success: false, message: "Valid total is required" });
      }
      const order = await OrderModel.create({ customer, customerPhone, items, total, notes });
      res.status(201).json({ success: true, data: order });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // PATCH /api/orders/:id/status
  async updateStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
        });
      }
      const order = await OrderModel.updateStatus(req.params.id, status);
      if (!order) return res.status(404).json({ success: false, message: "Order not found" });
      res.json({ success: true, data: order });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // DELETE /api/orders/:id
  async remove(req: Request, res: Response) {
    try {
      const deleted = await OrderModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: "Order not found" });
      res.json({ success: true, message: "Order deleted" });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },
};
