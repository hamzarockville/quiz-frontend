'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { apiRequest } from '@/lib/api'
import { toast } from "@/hooks/use-toast";
import { Loader2, Trash2, UserCog } from 'lucide-react'

interface User {
  id: string
  _id: string
  name: string
  email: string
  role: string
  subscriptionType: 'individual' | 'team'
  isSubscribed: boolean
  teamName?: string
  createdAt: string
  lastLogin: string
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [isDeleteDialogOpen])

  const fetchUsers = async () => {
    try {
      const usersData = await apiRequest<User[]>('/user')
      console.log('usersData', usersData)
      setUsers(usersData)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await apiRequest(`/user/${userId}`, { method: 'DELETE' })
      setUsers(users.filter(user => user.id !== userId))
      setIsDeleteDialogOpen(false)
      toast({
        title: "Success",
        description: "User has been deleted.",
      })
    } catch (error) {
      console.error('Error deleting user:', error)
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Subscription</TableHead>
                {/* <TableHead>Team</TableHead> */}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.isSubscribed ? 'Subscribed' : 'Not Subscribed'}</TableCell>
                  {/* <TableCell>{user.teamName || 'N/A'}</TableCell> */}
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                            <UserCog className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>User Details</DialogTitle>
                          </DialogHeader>
                          {selectedUser && (
                            <div className="space-y-4">
                              <p><strong>Name:</strong> {selectedUser.name}</p>
                              <p><strong>Email:</strong> {selectedUser.email}</p>
                              <p><strong>Role:</strong> {selectedUser.role}</p>
                              {/* <p><strong>Subscription Type:</strong> {selectedUser.subscriptionType}</p> */}
                              {/* <p><strong>Team Name:</strong> {selectedUser.teamName || 'N/A'}</p> */}
                              <p><strong>Created At:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
                              {/* <p><strong>Last Login:</strong> {new Date(selectedUser.lastLogin).toLocaleString()}</p> */}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => selectedUser && handleDeleteUser(selectedUser._id)}>Delete User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

