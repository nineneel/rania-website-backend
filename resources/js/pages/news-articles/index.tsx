import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type NewsArticle, type PaginatedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, ExternalLink, Plus, Trash2 } from 'lucide-react';

interface NewsArticlesIndexProps {
    articles: PaginatedData<NewsArticle>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'News & Articles',
        href: '/news-articles',
    },
];

export default function NewsArticlesIndex({ articles }: NewsArticlesIndexProps) {
    const handleDelete = (articleId: number) => {
        if (confirm('Are you sure you want to delete this news article?')) {
            router.delete(`/news-articles/${articleId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="News & Articles" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>News & Articles</CardTitle>
                                <CardDescription>
                                    Manage news & articles displayed on the website. Clicking an
                                    article on the public site redirects to the provided link.
                                </CardDescription>
                            </div>
                            <Link href="/news-articles/create">
                                <Button>
                                    <Plus className="mr-2 size-4" />
                                    Add Article
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {articles.data.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                No news & articles yet. Add your first one!
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {articles.data.map((article) => (
                                        <div
                                            key={article.id}
                                            className="group relative overflow-hidden rounded-lg border bg-card"
                                        >
                                            <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                                                <img
                                                    src={
                                                        article.image_url ||
                                                        `/storage/${article.image_path}`
                                                    }
                                                    alt={article.title}
                                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2 p-3">
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium">
                                                        {article.title}
                                                    </p>
                                                    {article.source && (
                                                        <p className="truncate text-xs text-muted-foreground">
                                                            {article.source}
                                                        </p>
                                                    )}
                                                    <a
                                                        href={article.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-1 inline-flex items-center gap-1 truncate text-xs text-primary hover:underline"
                                                    >
                                                        <ExternalLink className="size-3 shrink-0" />
                                                        <span className="truncate">
                                                            {article.link}
                                                        </span>
                                                    </a>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <Badge
                                                        variant={
                                                            article.is_active
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {article.is_active
                                                            ? 'Active'
                                                            : 'Inactive'}
                                                    </Badge>
                                                    <div className="flex shrink-0 gap-1">
                                                        <Link
                                                            href={`/news-articles/${article.id}/edit`}
                                                        >
                                                            <Button variant="ghost" size="sm">
                                                                <Edit className="size-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDelete(article.id)
                                                            }
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {articles.last_page > 1 && (
                                    <div className="mt-4 flex items-center justify-between border-t pt-4">
                                        <div className="text-sm text-muted-foreground">
                                            Showing {articles.from} to {articles.to} of{' '}
                                            {articles.total} articles
                                        </div>
                                        <div className="flex gap-1">
                                            {articles.links.map((link, index) => {
                                                if (!link.url) {
                                                    return (
                                                        <Button
                                                            key={index}
                                                            variant="ghost"
                                                            size="sm"
                                                            disabled
                                                            dangerouslySetInnerHTML={{
                                                                __html: link.label,
                                                            }}
                                                        />
                                                    );
                                                }

                                                return (
                                                    <Link key={index} href={link.url}>
                                                        <Button
                                                            variant={
                                                                link.active ? 'default' : 'ghost'
                                                            }
                                                            size="sm"
                                                            dangerouslySetInnerHTML={{
                                                                __html: link.label,
                                                            }}
                                                        />
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
