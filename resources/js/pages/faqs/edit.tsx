import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type FAQ, type FAQFormData } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';

interface EditFAQProps {
    faq: FAQ;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'FAQs',
        href: '/faqs',
    },
    {
        title: 'Edit FAQ',
        href: '#',
    },
];

export default function EditFAQ({ faq }: EditFAQProps) {
    const { data, setData, put, processing, errors } = useForm<FAQFormData>({
        question: faq.question,
        answer: faq.answer,
        is_active: faq.is_active,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/faqs/${faq.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit FAQ" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="mb-4">
                    <Button variant="ghost" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 size-4" />
                        Back to FAQs
                    </Button>
                </div>

                <Card className="mx-auto w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>Edit FAQ</CardTitle>
                        <CardDescription>
                            Update the FAQ information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="question">Question</Label>
                                <Input
                                    id="question"
                                    type="text"
                                    placeholder="e.g., What is RANIA's role in the visa application process?"
                                    value={data.question}
                                    onChange={(e) => setData('question', e.target.value)}
                                    required
                                />
                                {errors.question && (
                                    <p className="text-sm text-destructive">
                                        {errors.question}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="answer">Answer</Label>
                                <Textarea
                                    id="answer"
                                    placeholder="Enter the answer to this question..."
                                    value={data.answer}
                                    onChange={(e) => setData('answer', e.target.value)}
                                    rows={8}
                                    required
                                />
                                {errors.answer && (
                                    <p className="text-sm text-destructive">
                                        {errors.answer}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) =>
                                        setData('is_active', checked)
                                    }
                                />
                                <Label htmlFor="is_active">Active</Label>
                            </div>

                            <div className="flex gap-3">
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? 'Updating...'
                                        : 'Update FAQ'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
