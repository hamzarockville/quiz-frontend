'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState({
    name: 'a',
    email: 'd',
    avatarUrl: 'https://github.com/shadcn.png',
  })

  // Fetch user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user')

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser({
        name: parsedUser.name || 'User',
        email: parsedUser.email || '',
        avatarUrl: parsedUser.avatarUrl || '', // Adjust if you have avatar URLs
      })
    }
  }, [])

  const getPageTitle = (path: string) => {
    const routes: { [key: string]: string } = {
      '/dashboard': 'Dashboard',
      '/dashboard/create-test': 'Create Test',
      '/dashboard/candidate-tests': 'Candidate Tests',
      '/dashboard/tests': 'All Tests',
      '/dashboard/settings': 'Settings',
    }
    return routes[path] || 'Quiz'
  }

  const handleLogout = () => {
    // Clear localStorage and redirect
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-primary">
              Quiz
            </Link>
            <span className="ml-4 text-lg font-medium text-muted-foreground">
              {getPageTitle(pathname)}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {/* <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl || '/default-avatar.png'} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="flex flex-col items-start">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem> */}
                {/* <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
