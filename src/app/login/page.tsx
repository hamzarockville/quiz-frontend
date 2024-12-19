'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaGoogle, FaGithub } from 'react-icons/fa'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { apiRequest } from '@/lib/api'

interface LoginData {
  email: string
  password: string
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data: LoginData = { email, password }
      const response : any = await apiRequest('/auth/login', {
        method: 'POST',
        body: data,
      })

      // Save the token or user data to localStorage or context if needed
      localStorage.setItem('authToken', response.access_token)
      localStorage.setItem('user', JSON.stringify(response.user)) 
      alert('Login successful.')
      router.push('/dashboard') // Redirect to dashboard or home page
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed. Please check your credentials.')
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
            {/* Uncomment or replace with your logo */}
            {/* <Image
              src="/placeholder.svg"
              alt="Logo"
              fill
              className="object-contain"
            /> */}
          </div>
          <h2 className="text-2xl font-semibold text-center">Login</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            {/* <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Forgot Password?
              </Link>
            </div> */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Register here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
