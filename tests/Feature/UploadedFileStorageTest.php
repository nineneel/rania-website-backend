<?php

use App\Exceptions\FileUploadFailedException;
use App\Services\UploadedFileStorage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UploadedFileStorageHost
{
    use UploadedFileStorage {
        storeUploadedFile as public;
    }
}

it('persists a valid uploaded file and returns the path', function () {
    Storage::fake('public');

    $host = new UploadedFileStorageHost;
    $file = UploadedFile::fake()->image('logo.png');

    $path = $host->storeUploadedFile($file, 'umrah/airlines');

    expect($path)->toStartWith('umrah/airlines/');
    Storage::disk('public')->assertExists($path);
});

it('throws when the uploaded file is invalid', function () {
    Storage::fake('public');

    $host = new UploadedFileStorageHost;
    // UPLOAD_ERR_NO_FILE marks the upload as invalid.
    $file = new UploadedFile(
        path: tempnam(sys_get_temp_dir(), 'phpu'),
        originalName: 'broken.png',
        mimeType: 'image/png',
        error: UPLOAD_ERR_PARTIAL,
        test: true,
    );

    expect(fn () => $host->storeUploadedFile($file, 'umrah/airlines'))
        ->toThrow(FileUploadFailedException::class);
});
