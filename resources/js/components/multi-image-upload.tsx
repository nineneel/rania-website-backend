import { cn } from '@/lib/utils';
import { Upload, X } from 'lucide-react';
import { DragEvent, useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';

interface MultiImageUploadProps {
    value: File[];
    onChange: (files: File[]) => void;
    error?: string;
    className?: string;
    accept?: string;
    minCount?: number;
    compact?: boolean;
}

const isImageFile = (file: File): boolean => {
    return file.type.startsWith('image/') || file.type === 'image/svg+xml';
};

const toUniqueFiles = (files: File[]): File[] => {
    const seen = new Set<string>();

    return files.filter((file) => {
        const key = `${file.name}-${file.size}-${file.lastModified}`;

        if (seen.has(key)) {
            return false;
        }

        seen.add(key);

        return true;
    });
};

export function MultiImageUpload({
    value,
    onChange,
    error,
    className,
    accept = 'image/png,image/jpeg,image/jpg,image/webp',
    minCount,
    compact = false,
}: MultiImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const urls = value.map((file) => URL.createObjectURL(file));
        setPreviewUrls(urls);

        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [value]);

    const mergeFiles = (files: File[]) => {
        const imageFiles = files.filter((file) => isImageFile(file));
        onChange(toUniqueFiles([...value, ...imageFiles]));
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);

        const droppedFiles = Array.from(event.dataTransfer.files ?? []);
        mergeFiles(droppedFiles);
    };

    const handleRemove = (index: number) => {
        onChange(value.filter((_, fileIndex) => fileIndex !== index));
    };

    return (
        <div className={cn('space-y-3', className)}>
            {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {previewUrls.map((previewUrl, index) => (
                        <div
                            key={`${value[index]?.name}-${value[index]?.size}-${value[index]?.lastModified}`}
                            className="relative overflow-hidden rounded-lg border"
                        >
                            <img
                                src={previewUrl}
                                alt={`Selected gallery ${index + 1}`}
                                className="h-24 w-full object-cover"
                            />
                            <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="absolute right-2 top-2"
                                onClick={() => handleRemove(index)}
                            >
                                <X className="size-3" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <div
                onClick={() => inputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                className={cn(
                    'cursor-pointer rounded-lg border-2 border-dashed transition-colors',
                    compact ? 'px-4 py-3' : 'p-8',
                    isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-300 hover:border-primary',
                    error ? 'border-red-500' : '',
                )}
            >
                {compact ? (
                    <div className="flex items-center gap-3">
                        <Upload className="size-5 shrink-0 text-primary" />
                        <p className="text-sm">
                            Drop images here, or <span className="font-medium text-primary">browse</span>
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-2 text-center">
                        <div className="rounded-full bg-primary/10 p-4">
                            <Upload className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">
                                Drop your images here, or <span className="text-primary">browse</span>
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 2MB each</p>
                        </div>
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept={accept}
                    onChange={(event) => {
                        const selectedFiles = Array.from(event.target.files ?? []);
                        mergeFiles(selectedFiles);
                        event.currentTarget.value = '';
                    }}
                    className="hidden"
                />
            </div>

            <p className="text-xs text-muted-foreground">
                {minCount
                    ? `Selected ${value.length} image(s). Minimum ${minCount} images required.`
                    : `Selected ${value.length} image(s).`}
            </p>

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
