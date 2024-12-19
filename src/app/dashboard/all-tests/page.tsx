'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Edit, Share2, Trash2, Play } from 'lucide-react'
import { apiRequest } from '@/lib/api'

interface Test {
  id: string
  name: string
  createdAt: string
  questionCount: number
}

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch quizzes from the API
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response: any = await apiRequest('/quiz', { method: 'GET' })
        const quizzes = response.map((quiz: any) => ({
          id: quiz._id,
          name: quiz.title,
          createdAt: quiz.createdAt,
          questionCount: quiz.questions.length,
        }))
        setTests(quizzes)
      } catch (error) {
        console.error('Error fetching tests:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTests()
  }, [])

  // Delete test
  const handleDelete = async (id: string) => {
    try {
      await apiRequest(`/quiz/${id}`, { method: 'DELETE' })
      setTests(tests.filter(test => test.id !== id))
    } catch (error) {
      console.error('Error deleting test:', error)
      alert('Failed to delete test. Please try again.')
    }
  }

  if (loading) {
    return <div className="text-center py-10">Loading...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Your Tests</CardTitle>
          <Link href="/create-test">
            <Button>Create New Test</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {tests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Created On</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell className="font-medium">{test.name}</TableCell>
                    <TableCell>{new Date(test.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{test.questionCount}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link
                        className='pt-3'
                          href={`tests/${test.id}`}
                        >
                          <Play className="h-4 w-4" />
                        </Link>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(test.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4">No tests found. Create one to get started!</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
