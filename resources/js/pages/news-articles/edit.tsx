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
import { type BreadcrumbItem, type NewsArticle, type NewsArticleFormData } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';

interface EditNewsArticleProps {
    article: NewsArticle;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'News & Articles',
        href: '/news-articles',
    },
    {
        title: 'Edit Article',
        href: '#',
    },
];

interface NewsArticleFormDataWithMethod extends NewsArticleFormData {
    _method?: string;
}

export default function EditNewsArticle({ article }: EditNewsArticleProps) {
    const { data, setData, post, processing, errors } = useForm<NewsArticleFormDataWithMethod>({
        title: article.title,
        source: article.source ?? '',
        link: article.link,
        image: null,
        is_active: article.is_active,
        _method: 'PUT',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(`/news-articles/${article.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit News Article" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="mb-4">
                    <Button variant="ghost" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 size-4" />
                        Back to News & Articles
                    </Button>
                </div>

                <Card className="mx-auto w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>Edit News Article</CardTitle>
                        <CardDescription>Update news article information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Article headline"
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">{errors.title}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="source">Source (optional)</Label>
                                <Input
                                    id="source"
                                    type="text"
                                    value={data.source}
                                    onChange={(e) => setData('source', e.target.value)}
                                    placeholder="e.g. Liputan6, Suara.com"
                                />
                                {errors.source && (
                                    <p className="text-sm text-destructive">{errors.source}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="link">Link</Label>
                                <Input
                                    id="link"
                                    type="url"
                                    value={data.link}
                                    onChange={(e) => setData('link', e.target.value)}
                                    placeholder="https://example.com/article"
                                />
                                {errors.link && (
                                    <p className="text-sm text-destructive">{errors.link}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Image</Label>
                                <ImageUpload
                                    value={data.image}
                                    onChange={(file) => setData('image', file)}
                                    currentImageUrl={
                                        article.image_url || `/storage/${article.image_path}`
                                    }
                                    error={errors.image}
                                />
                                {errors.image && (
                                    <p className="text-sm text-destructive">{errors.image}</p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked)}
                                />
                                <Label htmlFor="is_active">Active</Label>
                            </div>

                            <div className="flex gap-3">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Article'}
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
