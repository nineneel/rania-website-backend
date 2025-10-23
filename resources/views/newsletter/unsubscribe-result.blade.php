<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Newsletter Unsubscribe - {{ config('app.name') }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 100%;
            padding: 48px;
            text-align: center;
        }
        .icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
        }
        .icon.success {
            background: #d4edda;
            color: #155724;
        }
        .icon.error {
            background: #f8d7da;
            color: #721c24;
        }
        h1 {
            font-size: 28px;
            margin-bottom: 16px;
            color: #333;
        }
        .success h1 {
            color: #155724;
        }
        .error h1 {
            color: #721c24;
        }
        p {
            font-size: 16px;
            line-height: 1.6;
            color: #666;
            margin-bottom: 32px;
        }
        .btn {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon {{ $success ? 'success' : 'error' }}">
            @if($success)
                ✓
            @else
                ✕
            @endif
        </div>
        <h1>{{ $success ? 'Successfully Unsubscribed' : 'Unsubscribe Failed' }}</h1>
        <p>{{ $message }}</p>
        @if($success)
            <p style="font-size: 14px; color: #999;">We're sorry to see you go. You can always resubscribe from our website.</p>
        @endif
        <a href="{{ config('app.url') }}" class="btn">Return to Homepage</a>
    </div>
</body>
</html>
