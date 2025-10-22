import { cn } from '@/lib/utils';
import { Upload, X } from 'lucide-react';
import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import { Button } from './ui/button';

interface ImageUploadProps {
    value: File | null;
    onChange: (file: File | null) => void;
    currentImageUrl?: string;
    error?: string;
    className?: string;
    accept?: string;
}

export function ImageUpload({
    value: _value,
    onChange,
    currentImageUrl,
    error,
    className,
    accept = 'image/png,image/jpeg,image/jpg,image/webp',
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (file: File | null) => {
        if (file && (file.type.startsWith('image/') || file.type === 'image/svg+xml')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            onChange(file);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleFileChange(file);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileChange(file);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleRemove = () => {
        setPreview(null);
        onChange(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const displayImage = preview || currentImageUrl;

    return (
        <div className={cn('space-y-2', className)}>
            <div
                onClick={() => inputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={cn(
                    'relative cursor-pointer rounded-lg border-2 border-dashed transition-colors',
                    isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-300 hover:border-primary',
                    error ? 'border-red-500' : '',
                    displayImage ? 'p-0' : 'p-8',
                )}
            >
                {displayImage ? (
                    <div className="group relative aspect-video overflow-hidden rounded-lg">
                        <img
                            src={displayImage}
                            alt="Preview"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove();
                                }}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Remove
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-2 text-center">
                        <div className="rounded-full bg-primary/10 p-4">
                            <Upload className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">
                                Drop your image here, or{' '}
                                <span className="text-primary">browse</span>
                            </p>
                            <p className="text-xs text-gray-500">
                                PNG, JPG, WEBP up to 2MB
                            </p>
                        </div>
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    onChange={handleInputChange}
                    className="hidden"
                />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
