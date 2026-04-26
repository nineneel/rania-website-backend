import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Plus, Search } from 'lucide-react';
import { ReactNode, useMemo, useState } from 'react';

interface ItemPickerDialogProps<T extends { id: number }> {
    triggerLabel: string;
    title: string;
    description?: string;
    items: T[];
    selectedIds: number[];
    onSelect: (id: number) => void;
    renderItem: (item: T) => ReactNode;
    getSearchText?: (item: T) => string;
    emptyAvailableMessage?: string;
    emptyAllMessage?: string;
    triggerClassName?: string;
}

export function ItemPickerDialog<T extends { id: number }>({
    triggerLabel,
    title,
    description,
    items,
    selectedIds,
    onSelect,
    renderItem,
    getSearchText,
    emptyAvailableMessage = 'All items have been added.',
    emptyAllMessage = 'No items available.',
    triggerClassName,
}: ItemPickerDialogProps<T>) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');

    const availableItems = useMemo(
        () => items.filter((item) => !selectedIds.includes(item.id)),
        [items, selectedIds],
    );

    const filteredItems = useMemo(() => {
        if (!getSearchText || query.trim() === '') {
            return availableItems;
        }
        const q = query.trim().toLowerCase();
        return availableItems.filter((item) => getSearchText(item).toLowerCase().includes(q));
    }, [availableItems, getSearchText, query]);

    const handleSelect = (id: number) => {
        onSelect(id);
        setQuery('');
    };

    if (items.length === 0) {
        return (
            <p className="rounded-lg border p-4 text-sm text-muted-foreground">
                {emptyAllMessage}
            </p>
        );
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                setOpen(next);
                if (!next) {
                    setQuery('');
                }
            }}
        >
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className={cn('w-full justify-center border-dashed', triggerClassName)}
                >
                    <Plus className="mr-1.5 size-4" />
                    {triggerLabel}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>

                {getSearchText && (
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search..."
                            className="pl-9"
                            autoFocus
                        />
                    </div>
                )}

                <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
                    {filteredItems.length === 0 ? (
                        <p className="rounded-lg border p-4 text-center text-sm text-muted-foreground">
                            {availableItems.length === 0 ? emptyAvailableMessage : 'No matches found.'}
                        </p>
                    ) : (
                        filteredItems.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => handleSelect(item.id)}
                                className="flex w-full items-center rounded-lg border p-3 text-left transition-colors hover:border-primary hover:bg-primary/5"
                            >
                                {renderItem(item)}
                            </button>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
