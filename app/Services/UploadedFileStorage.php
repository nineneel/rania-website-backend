<?php

namespace App\Services;

use App\Exceptions\FileUploadFailedException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Throwable;

/**
 * Stores uploaded files and verifies the write actually succeeded.
 *
 * Wraps `UploadedFile::store()` so storage failures (full disk, permissions,
 * partial uploads, etc.) raise an explicit FileUploadFailedException instead
 * of silently returning false and persisting a broken `image_path` on the
 * model.
 */
trait UploadedFileStorage
{
    /**
     * Store an uploaded file on the given disk and return its relative path.
     *
     * @throws FileUploadFailedException When the upload is invalid or the file cannot be persisted.
     */
    protected function storeUploadedFile(UploadedFile $file, string $directory, string $disk = 'public'): string
    {
        if (! $file->isValid()) {
            Log::error('Upload rejected before storage', [
                'directory' => $directory,
                'disk' => $disk,
                'original_name' => $file->getClientOriginalName(),
                'error_code' => $file->getError(),
                'error_message' => $file->getErrorMessage(),
            ]);

            throw new FileUploadFailedException('Uploaded file is invalid: '.$file->getErrorMessage());
        }

        try {
            $path = $file->store($directory, $disk);
        } catch (Throwable $e) {
            Log::error('Storage write threw an exception', [
                'directory' => $directory,
                'disk' => $disk,
                'original_name' => $file->getClientOriginalName(),
                'size_bytes' => $file->getSize(),
                'exception' => $e->getMessage(),
            ]);

            throw new FileUploadFailedException(
                'Failed to save uploaded file to storage.',
                previous: $e,
            );
        }

        if (! is_string($path) || $path === '' || ! Storage::disk($disk)->exists($path)) {
            Log::error('Storage write returned an unusable path', [
                'directory' => $directory,
                'disk' => $disk,
                'original_name' => $file->getClientOriginalName(),
                'size_bytes' => $file->getSize(),
                'returned_path' => $path,
            ]);

            throw new FileUploadFailedException('Failed to save uploaded file to storage.');
        }

        return $path;
    }
}
