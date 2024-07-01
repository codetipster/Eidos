"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SidebarNavItem } from '@/types/nav-types'
import { cn } from '@/lib/utils'
import { Icons } from '../icons'

import React from 'react'

interface DashboardNavProps {
    items: SidebarNavItem[]
}

const Navbar = ({ items }: DashboardNavProps) => {
    const path = usePathname();

    if (!items?.length) return null
  return (
    <nav>
        {
        items.map((item, index) => {
            const Icon =  Icons[item?.icon || 'list']
            const isActive = path === item.href
            return item.href && (
                <Link key={index} href={item.disabled ? "/" : item.href}>

                    <span className={cn(
                        'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent  hover:text-accent-foreground',
                        isActive ? 'bg-accent' : 'transparent',
                        item.disabled ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'
                    )}>
                        <Icon className='w-4 h-4 mr-2' />
                        {item.title}
                    </span>
                </Link>
            )
        })
        }
    </nav>
    )
}

export default Navbar