'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2 } from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface TeamMember {
  id: string;
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function ViewTeam() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTeamMembers = async () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      toast({
        title: 'Error',
        description: 'You must be logged in to view your team.',
        variant: 'destructive',
      });
      return;
    }

    const user = JSON.parse(storedUser);
    const teamAdminId = user.userId;

    try {
      const response : any = await apiRequest<TeamMember[]>(`/user/${teamAdminId}/team`);
      setTeamMembers(response.team);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to fetch team members.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      toast({
        title: 'Error',
        description: 'You must be logged in to delete a team member.',
        variant: 'destructive',
      });
      return;
    }

    const user = JSON.parse(storedUser);
    const teamAdminId = user.userId;

    try {
      await apiRequest(`/user/${teamAdminId}/team-members/${memberId}`, {
        method: 'DELETE',
      });

      toast({
        title: 'Success',
        description: 'Team member removed successfully.',
      });

      // Update the team members list after deletion
      setTeamMembers((prevMembers) => prevMembers.filter((member) => member.id !== memberId));
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to delete team member.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Team Members</h1>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          {teamMembers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteMember(member._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No team members found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
