import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface SelectionCardProps {
    selected: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    className?: string;
}

export function SelectionCard({ selected, onToggle, children, className }: SelectionCardProps) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className={cn(
                'relative flex cursor-pointer rounded-lg border-2 p-2 text-left transition-all',
                selected
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-border hover:border-muted-foreground/30',
                className,
            )}
        >
            {children}
            {selected && (
                <div className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3" />
                </div>
            )}
        </button>
    );
}
