import { ImageUpload } from '@/components/image-upload';
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
import AppLayout from '@/layouts/app-layout';
import {
    type BreadcrumbItem,
    type SocialMedia,
    type SocialMediaFormData,
} from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';

interface EditSocialMediaProps {
    socialMedia: SocialMedia;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Social Media',
        href: '/social-media',
    },
    {
        title: 'Edit Social Media',
        href: '#',
    },
];

interface SocialMediaFormDataWithMethod extends SocialMediaFormData {
    _method?: string;
}

export default function EditSocialMedia({ socialMedia }: EditSocialMediaProps) {
    const { data, setData, post, processing, errors } =
        useForm<SocialMediaFormDataWithMethod>({
            name: socialMedia.name,
            url: socialMedia.url,
            icon: null,
            is_active: socialMedia.is_active,
            _method: 'PUT',
        });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(`/social-media/${socialMedia.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Social Media: ${socialMedia.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="mb-4">
                    <Button variant="ghost" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Social Media
                    </Button>
                </div>

                <Card className="mx-auto w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>Edit Social Media</CardTitle>
                        <CardDescription>
                            Update social media information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Platform Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="e.g., Instagram, Facebook, LinkedIn"
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
                                <Label htmlFor="url">URL</Label>
                                <Input
                                    id="url"
                                    type="url"
                                    placeholder="https://www.instagram.com/..."
                                    value={data.url}
                                    onChange={(e) => setData('url', e.target.value)}
                                    required
                                />
                                {errors.url && (
                                    <p className="text-sm text-destructive">{errors.url}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="icon">Icon (Optional)</Label>
                                <ImageUpload
                                    value={data.icon}
                                    onChange={(file) => setData('icon', file)}
                                    currentImageUrl={socialMedia.icon_url || undefined}
                                    error={errors.icon}
                                    accept="image/*,.svg"
                                />
                                <p className="text-sm text-muted-foreground">
                                    Upload a custom icon for this social media platform. SVG,
                                    PNG, or JPG (max 2MB)
                                </p>
                                {errors.icon && (
                                    <p className="text-sm text-destructive">{errors.icon}</p>
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
                                        : 'Update Social Media'}
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
