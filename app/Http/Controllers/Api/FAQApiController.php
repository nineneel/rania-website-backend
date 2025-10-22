<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FAQ;
use Illuminate\Http\Request;

class FAQApiController extends Controller
{
    /**
     * Get all active FAQs.
     */
    public function index()
    {
        $faqs = FAQ::active()
            ->ordered()
            ->get()
            ->map(function ($faq) {
                return [
                    'id' => $faq->id,
                    'question' => $faq->question,
                    'answer' => $faq->answer,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $faqs,
        ]);
    }
}
