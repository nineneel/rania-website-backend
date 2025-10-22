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
import { type BreadcrumbItem, type FAQFormData } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'FAQs',
        href: '/faqs',
    },
    {
        title: 'Create FAQ',
        href: '/faqs/create',
    },
];

export default function CreateFAQ() {
    const { data, setData, post, processing, errors } = useForm<FAQFormData>({
        question: '',
        answer: '',
        is_active: true,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/faqs');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create FAQ" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="mb-4">
                    <Button variant="ghost" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 size-4" />
                        Back to FAQs
                    </Button>
                </div>

                <Card className="mx-auto w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>Create New FAQ</CardTitle>
                        <CardDescription>
                            Add a new frequently asked question to display on the Support & Help page
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
                                        ? 'Creating...'
                                        : 'Create FAQ'}
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
