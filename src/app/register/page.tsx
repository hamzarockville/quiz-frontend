'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaGoogle, FaGithub } from 'react-icons/fa'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { apiRequest } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

interface RegisterData {
  name: string
  email: string
  password: string
  // role: string
}

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('participant')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
    const {toast} = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data: RegisterData = { name, email, password }
      await apiRequest('/auth/register', {
        method: 'POST',
        body: data,
      })

     
      toast({
        title: "Success",
        description: "Registration successful. Please log in.",
      })
      router.push('/login')
    } catch (error) {
      console.error('Registration error:', error)
    
      alert("")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Registration Failed.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-xl transform rotate-45" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-blue-400/20 rounded-full blur-xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      
      <Card className="w-full max-w-md mx-4 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-4 items-center">
          <div className="w-12 h-12 relative">
            <Image
              src="/placeholder.svg"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-2xl font-semibold text-center">Create an Account</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="participant">Participant</option>
                <option value="creator">Test Creator</option>
              </select>
            </div> */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Sign Up'}
            </Button>
{/* 
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div> */}

            {/* <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                <FaGoogle className="mr-2" />
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <FaGithub className="mr-2" />
                GitHub
              </Button>
            </div> */}

            {/* <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign in
              </Link>
            </p> */}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

