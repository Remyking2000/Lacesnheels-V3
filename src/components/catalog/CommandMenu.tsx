import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { products } from "../../data/catalog";

type CommandMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const navigate = useNavigate();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30" />
        <Dialog.Content className="fixed left-1/2 top-24 z-50 w-[min(640px,92vw)] -translate-x-1/2 overflow-hidden rounded-lg border border-[#6f5545]/20 bg-white shadow-soft">
          <Command>
            <div className="flex items-center gap-3 border-b border-[#6f5545]/15 px-4">
              <Search className="h-5 w-5 text-[#8c7768]" />
              <Command.Input className="h-14 flex-1 outline-none" placeholder="Search products..." />
            </div>
            <Command.List className="max-h-80 overflow-y-auto p-2">
              <Command.Empty className="p-4 text-sm text-[#8c7768]">No products found.</Command.Empty>
              {products.map((product) => (
                <Command.Item
                  key={product.slug}
                  value={`${product.name} ${product.category}`}
                  className="cursor-pointer rounded-md px-3 py-3 data-[selected=true]:bg-cream"
                  onSelect={() => {
                    navigate(`/shop/${product.slug}`);
                    onOpenChange(false);
                  }}
                >
                  <div className="font-bold">{product.name}</div>
                  <div className="text-sm text-[#8c7768]">{product.price}</div>
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
