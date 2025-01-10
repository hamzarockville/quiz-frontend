'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { apiRequest } from '@/lib/api'
import { toast } from '@/hooks/use-toast'
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react'

interface Vertical {
  id: string
  _id: string
  name: string
  description: string
}

export default function ManageVerticals() {
  const [verticals, setVerticals] = useState<Vertical[]>([])
  const [newVertical, setNewVertical] = useState({ name: '', description: '' })
  const [editingVertical, setEditingVertical] = useState<Vertical | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    fetchVerticals()
  }, [verticals])

  const fetchVerticals = async () => {
    try {
      const data = await apiRequest<Vertical[]>('/vertical')
      setVerticals(data)
    } catch (error) {
      console.error('Error fetching verticals:', error)
      toast({
        title: "Error",
        description: "Failed to fetch verticals. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddVertical = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const addedVertical = await apiRequest<Vertical>('/vertical', {
        method: 'POST',
        body: newVertical,
      })
      setVerticals([...verticals, addedVertical])
      setNewVertical({ name: '', description: '' })
      setIsAddDialogOpen(false)
      toast({
        title: "Success",
        description: "New vertical has been added.",
      })
    } catch (error) {
      console.error('Error adding vertical:', error)
      toast({
        title: "Error",
        description: "Failed to add new vertical. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditVertical = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingVertical) return
    setIsLoading(true)
    try {
      const updatedVertical = await apiRequest<Vertical>(`/vertical/${editingVertical._id}`, {
        method: 'PUT',
        body: editingVertical,
      })
      setVerticals(verticals.map(v => v.id === updatedVertical.id ? updatedVertical : v))
      setIsEditDialogOpen(false)
      toast({
        title: "Success",
        description: "Vertical has been updated.",
      })
    } catch (error) {
      console.error('Error updating vertical:', error)
      toast({
        title: "Error",
        description: "Failed to update vertical. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteVertical = async (id: string) => {
    setIsLoading(true)
    try {
      await apiRequest(`/vertical/${id}`, {
        method: 'DELETE',
      })
      setVerticals(verticals.filter(v => v.id !== id))
      setIsDeleteDialogOpen(false)
      toast({
        title: "Success",
        description: "Vertical has been deleted.",
      })
    } catch (error) {
      console.error('Error deleting vertical:', error)
      toast({
        title: "Error",
        description: "Failed to delete vertical. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && verticals.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Manage Verticals</h1>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Verticals</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Vertical
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Vertical</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddVertical} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newVertical.name}
                    onChange={(e) => setNewVertical({ ...newVertical, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newVertical.description}
                    onChange={(e) => setNewVertical({ ...newVertical, description: e.target.value })}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Add Vertical
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {verticals.map((vertical) => (
                <TableRow key={vertical.id}>
                  <TableCell>{vertical.name}</TableCell>
                  <TableCell>{vertical.description}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setEditingVertical(vertical)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Vertical</DialogTitle>
                          </DialogHeader>
                          {editingVertical && (
                            <form onSubmit={handleEditVertical} className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">Name</Label>
                                <Input
                                  id="edit-name"
                                  value={editingVertical.name}
                                  onChange={(e) => setEditingVertical({ ...editingVertical, name: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Input
                                  id="edit-description"
                                  value={editingVertical.description}
                                  onChange={(e) => setEditingVertical({ ...editingVertical, description: e.target.value })}
                                  required
                                />
                              </div>
                              <DialogFooter>
                                <Button type="submit" disabled={isLoading}>
                                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                  Update Vertical
                                </Button>
                              </DialogFooter>
                            </form>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="destructive" size="sm" onClick={() => setEditingVertical(vertical)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                          </DialogHeader>
                          <p>Are you sure you want to delete the vertical "{editingVertical?.name}"? This action cannot be undone.</p>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={() => editingVertical && handleDeleteVertical(editingVertical._id)} disabled={isLoading}>
                              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

