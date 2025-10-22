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
import { type NavItem, type SharedData } from '@/types';
import { usePage, Link } from '@inertiajs/react';
import { Home, LayoutGrid, Users, Plane, MessageSquare } from 'lucide-react';
import AppLogo from './app-logo';

const getMainNavItems = (userRole: string): NavItem[] => {
    const items: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    // Only show User Management, Home Content, and Umrah Content for super-admin and admin
    if (userRole === 'super-admin' || userRole === 'admin') {
        items.push({
            title: 'Home Content',
            href: { url: '/home-content', method: 'get' },
            icon: Home,
        });
        items.push({
            title: 'Umrah Content',
            href: { url: '/umrah-content', method: 'get' },
            icon: Plane,
        });
        items.push({
            title: 'User Management',
            href: usersRoute.index(),
            icon: Users,
        });
    }

    // Contact Messages - accessible to all authenticated users
    items.push({
        title: 'Contact Messages',
        href: { url: '/contact-messages', method: 'get' },
        icon: MessageSquare,
    });

    return items;
};

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const mainNavItems = getMainNavItems(auth.user.role);

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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
