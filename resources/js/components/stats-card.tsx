import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatItem {
  label: string;
  value: number;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
}

interface StatsCardProps {
  title: string;
  icon: LucideIcon;
  stats: StatItem[];
  href?: string;
  description?: string;
  iconClassName?: string;
}

export function StatsCard({
  title,
  icon: Icon,
  stats,
  href,
  description,
  iconClassName,
}: StatsCardProps) {
  const CardWrapper = href ? Link : 'div';
  const cardProps = href ? { href } : {};

  return (
    <CardWrapper
      {...cardProps}
      className={cn(
        'block h-full',
        href && 'transition-all hover:shadow-md hover:scale-[1.02]'
      )}
    >
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className={cn('h-4 w-4 text-muted-foreground', iconClassName)} />
        </CardHeader>
        <CardContent>
          {description && (
            <p className="text-xs text-muted-foreground mb-3">{description}</p>
          )}
          <div className="space-y-2">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">{stat.label}</span>
                <Badge variant={stat.variant || 'default'}>
                  {stat.value}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
}
