import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import usersRoute from '@/routes/users';
import { type NavGroup, type SharedData } from '@/types';
import { usePage, Link } from '@inertiajs/react';
import { Home, LayoutGrid, Users, Plane, MessageSquare, Share2, MessageCircle } from 'lucide-react';
import AppLogo from './app-logo';

const getMainNavGroups = (userRole: string): NavGroup[] => {
    const groups: NavGroup[] = [
        {
            title: 'General',
            items: [
                {
                    title: 'Dashboard',
                    href: dashboard(),
                    icon: LayoutGrid,
                },
            ],
        },
    ];

    // Content Management and Administration sections for super-admin and admin
    if (userRole === 'super-admin' || userRole === 'admin') {
        groups.push({
            title: 'Content Management',
            items: [
                {
                    title: 'Home Content',
                    href: { url: '/home-content', method: 'get' },
                    icon: Home,
                },
                {
                    title: 'Umrah Content',
                    href: { url: '/umrah-content', method: 'get' },
                    icon: Plane,
                },
                {
                    title: 'Testimonials',
                    href: { url: '/testimonials', method: 'get' },
                    icon: MessageCircle,
                },
            ],
        });

        groups.push({
            title: 'Communication',
            items: [
                {
                    title: 'Social Media',
                    href: { url: '/social-media', method: 'get' },
                    icon: Share2,
                },
                {
                    title: 'Contact Messages',
                    href: { url: '/contact-messages', method: 'get' },
                    icon: MessageSquare,
                },
            ],
        });

        groups.push({
            title: 'Administration',
            items: [
                {
                    title: 'User Management',
                    href: usersRoute.index(),
                    icon: Users,
                },
            ],
        });
    } else {
        // For non-admin users, show only Contact Messages in Communication
        groups.push({
            title: 'Communication',
            items: [
                {
                    title: 'Contact Messages',
                    href: { url: '/contact-messages', method: 'get' },
                    icon: MessageSquare,
                },
            ],
        });
    }

    return groups;
};

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const mainNavGroups = getMainNavGroups(auth.user.role);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain groups={mainNavGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
