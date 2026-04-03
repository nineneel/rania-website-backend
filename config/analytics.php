<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Google Analytics Property ID
    |--------------------------------------------------------------------------
    |
    | Your GA4 property ID (numeric). Find it in Google Analytics under
    | Admin > Property Settings.
    |
    */

    'property_id' => env('ANALYTICS_PROPERTY_ID', ''),

    /*
    |--------------------------------------------------------------------------
    | Service Account Credentials
    |--------------------------------------------------------------------------
    |
    | Path to your Google Cloud service account JSON credentials file.
    | Download from Google Cloud Console > IAM > Service Accounts.
    |
    */

    'credentials_path' => env('ANALYTICS_CREDENTIALS_PATH', storage_path('app/analytics/service-account-credentials.json')),

    /*
    |--------------------------------------------------------------------------
    | Cache Duration
    |--------------------------------------------------------------------------
    |
    | How long (in minutes) to cache analytics data. Set to 0 to disable.
    |
    */

    'cache_minutes' => env('ANALYTICS_CACHE_MINUTES', 30),

];
