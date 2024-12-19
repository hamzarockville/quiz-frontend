'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface TeamMember {
  name: string;
  email: string;
}

export default function AddTeamMember() {
  const [teamMember, setTeamMember] = useState<TeamMember>({ name: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamMember({ ...teamMember, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      toast({
        title: 'Error',
        description: 'You must be logged in as a team admin to add members.',
        variant: 'destructive',
      });
      return;
    }

    const user = JSON.parse(storedUser);
    const teamAdminId = user.userId;

    setIsLoading(true);

    try {
      await apiRequest(`/user/${teamAdminId}/team-members`, {
        method: 'POST',
        body: teamMember,
      });

      toast({
        title: 'Success',
        description: `Team member ${teamMember.name} has been added successfully.`,
      });

      setTeamMember({ name: '', email: '' }); // Reset the form
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to add team member.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Add Team Member</h1>

      <Card>
        <CardHeader>
          <CardTitle>Team Member Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={teamMember.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={teamMember.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Team Member...
                </>
              ) : (
                'Add Team Member'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
