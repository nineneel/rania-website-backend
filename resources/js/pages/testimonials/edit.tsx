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
import { type BreadcrumbItem, type Testimonial, type TestimonialFormData } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';

interface EditTestimonialProps {
    testimonial: Testimonial;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Testimonials',
        href: '/testimonials',
    },
    {
        title: 'Edit Testimonial',
        href: '#',
    },
];

export default function EditTestimonial({ testimonial }: EditTestimonialProps) {
    const { data, setData, put, processing, errors } = useForm<TestimonialFormData>({
        name: testimonial.name,
        subtitle: testimonial.subtitle || '',
        text: testimonial.text,
        is_active: testimonial.is_active,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/testimonials/${testimonial.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Testimonial" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="mb-4">
                    <Button variant="ghost" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Testimonials
                    </Button>
                </div>

                <Card className="mx-auto w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>Edit Testimonial</CardTitle>
                        <CardDescription>
                            Update the testimonial information
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
                                        ? 'Updating...'
                                        : 'Update Testimonial'}
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
