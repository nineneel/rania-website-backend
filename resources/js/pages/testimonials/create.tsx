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
import { type BreadcrumbItem, type TestimonialFormData } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Testimonials',
        href: '/testimonials',
    },
    {
        title: 'Create Testimonial',
        href: '/testimonials/create',
    },
];

export default function CreateTestimonial() {
    const { data, setData, post, processing, errors } = useForm<TestimonialFormData>({
        name: '',
        subtitle: '',
        text: '',
        is_active: true,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/testimonials');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Testimonial" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="mb-4">
                    <Button variant="ghost" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Testimonials
                    </Button>
                </div>

                <Card className="mx-auto w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>Create New Testimonial</CardTitle>
                        <CardDescription>
                            Add a new customer testimonial to display on the website
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="e.g., John Doe"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subtitle">Subtitle (Optional)</Label>
                                <Input
                                    id="subtitle"
                                    type="text"
                                    placeholder="e.g., CEO at ABC Company, Satisfied Customer"
                                    value={data.subtitle}
                                    onChange={(e) => setData('subtitle', e.target.value)}
                                />
                                {errors.subtitle && (
                                    <p className="text-sm text-destructive">
                                        {errors.subtitle}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="text">Testimonial</Label>
                                <Textarea
                                    id="text"
                                    placeholder="Enter the testimonial text..."
                                    value={data.text}
                                    onChange={(e) => setData('text', e.target.value)}
                                    rows={6}
                                    required
                                />
                                {errors.text && (
                                    <p className="text-sm text-destructive">
                                        {errors.text}
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
                                        : 'Create Testimonial'}
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
