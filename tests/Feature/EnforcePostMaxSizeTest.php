<?php

use App\Http\Middleware\EnforcePostMaxSize;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

it('lets normal POST requests through', function () {
    $middleware = new EnforcePostMaxSize;

    $request = Request::create('/test', 'POST', ['name' => 'value']);

    $response = $middleware->handle($request, fn () => new Response('ok'));

    expect($response->getContent())->toBe('ok');
});

it('lets non-POST requests through', function () {
    $middleware = new EnforcePostMaxSize;

    $request = Request::create('/test', 'GET');

    $response = $middleware->handle($request, fn () => new Response('ok'));

    expect($response->getContent())->toBe('ok');
});

it('rejects POST requests when content length exceeds post_max_size and body is empty', function () {
    $postMaxBytes = (int) preg_replace('/[^0-9]/', '', (string) ini_get('post_max_size'));
    $postMaxBytes = $postMaxBytes * 1024 * 1024; // assume "M" suffix locally

    $middleware = new EnforcePostMaxSize;

    $request = Request::create('/test', 'POST');
    $request->server->set('CONTENT_LENGTH', $postMaxBytes + 1);
    $_POST = [];
    $_FILES = [];

    $response = $middleware->handle($request, fn () => new Response('ok'));

    expect($response->getStatusCode())->toBe(302); // redirect back with errors
});
