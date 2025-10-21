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
import { LayoutGrid, Users } from 'lucide-react';
import AppLogo from './app-logo';

const getMainNavItems = (userRole: string): NavItem[] => {
    const items: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    // Only show User Management for super-admin and admin
    if (userRole === 'super-admin' || userRole === 'admin') {
        items.push({
            title: 'User Management',
            href: usersRoute.index(),
            icon: Users,
        });
    }

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
