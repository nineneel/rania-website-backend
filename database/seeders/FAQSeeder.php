<?php

namespace Database\Seeders;

use App\Models\FAQ;
use Illuminate\Database\Seeder;

class FAQSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faqs = [
            [
                'question' => "What is RANIA's role in the visa application process?",
                'answer' => "RANIA provides comprehensive services for Umrah & Haji visa processing. Our professional team will handle the entire administrative process, from document verification and submission to the relevant authorities, to providing assistance in fulfilling any requirements. This allows pilgrims to prepare for their worship with peace of mind, unburdened by visa concerns.",
                'is_active' => true,
                'order' => 0,
            ],
            [
                'question' => "Does RANIA have special access for Hajj or Umrah visa processing?",
                'answer' => "RANIA's key advantage is its status as a travel agency that also serves as an official visa provider exclusively for its pilgrims. This provides priority in the visa application process, freeing our clients from the long queues with thousands of other applicants and eliminating concerns about potential delays.",
                'is_active' => true,
                'order' => 1,
            ],
            [
                'question' => "What is the refund policy if the visa application is not approved?",
                'answer' => "In the event of a visa rejection, the refund process will refer to the terms and conditions applicable at RANIA. Pilgrims/travelers will receive a partial refund after deduction of administrative fees and other costs already incurred. We will provide an official explanation regarding the details of the rejection and the refund. It is important to understand that the decision to reject a visa is the absolute authority of the Embassy or the Government of the Kingdom of Saudi Arabia.",
                'is_active' => true,
                'order' => 2,
            ],
            [
                'question' => "What is the minimum passport validity required for departure?",
                'answer' => "Your passport must have a minimum of 8 months of validity remaining before the date of departure. Renew it immediately if the validity is less than that limit. Additionally, ensure the passport is in good condition (undamaged), the name on the passport must exactly match what is listed on your ID card (KTP) and Family Card (KK), and it must consist of at least 2 words/names, for example: Muhammad Yaser.",
                'is_active' => true,
                'order' => 3,
            ],
            [
                'question' => "What is the estimated time required for the visa process from start to finish?",
                'answer' => "The processing time for an Umrah visa requires 7 to 15 working days after all documents are received complete. Meanwhile, a Special Hajj visa takes longer, which is several weeks up to 1 month, as it depends on the policy of the Ministry of Religious Affairs (Kemenag), the Government of Saudi Arabia, and the completeness of the pilgrims' files.",
                'is_active' => true,
                'order' => 4,
            ],
            [
                'question' => "What are the administrative requirements that must be fulfilled to register for the Umrah or Hajj program?",
                'answer' => "Prospective pilgrims who wish to register for Umrah or Hajj through RANIA need to prepare several important documents, namely: a passport (with a minimum validity of 8 months), National Identity Card (KTP), Family Card (KK), birth certificate or marriage certificate, four 4x6 photographs, the yellow book (if required), a registration form, and a BPJS card (if mandatory).",
                'is_active' => true,
                'order' => 5,
            ],
        ];

        foreach ($faqs as $faq) {
            FAQ::create($faq);
        }
    }
}
