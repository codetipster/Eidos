import Header from '@/components/ui/header'
import Navbar from '@/components/navigation/navbar'
import { SessionProvider } from 'next-auth/react'
import FormGenerator from '../form-generator'
import { SidebarNavItem } from '@/types/nav-types'

export default function AdminLayout({children}: {
    children: React.ReactNode
}) {
    const dashboardConfig: {
        sidebarNav: SidebarNavItem[];
    } = {
        sidebarNav : [
            {
                title: 'My Forms',
                icon: 'library',
                href: '/view-forms'
            },
            {
                title: 'Results',
                icon: 'list',
                href: '/results'
            },
            {
                title: 'Analytics',
                icon: 'lineChart',
                href: '/analytics'
            },
            {
                title: 'Charts',
                icon: 'pieChart',
                href: '/charts'
            },
            {
                title: 'Settings',
                icon: 'settings',
                href: '/settings' 
            }
        ]
    }
    return (
        <div className='flex min-h-screen flex-col space-y-6'>
            <Header />
            <div className='container grid gap-12 md:grid-cols-[200px_1fr] flex-1'>
                <aside className='hidden w-[200px] flex-col  md:flex pr-2 border-r justify-between '>
                    <Navbar items={dashboardConfig.sidebarNav}/>
                </aside>
                <main className='flex w-full flex-1 flex-col overflow-hidden'>
                    <header className='flex items-center'>
                        <h1 className='text-2xl m-5 p-4 font-semibold'>Admin Dashboard</h1>
                        <SessionProvider>
                            <FormGenerator />
                        </SessionProvider>
                    </header>
                    <hr className='my-2'/>
                    {children}
                </main>
            </div>
        </div>
    )
}