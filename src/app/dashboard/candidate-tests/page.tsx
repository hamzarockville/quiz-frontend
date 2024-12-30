'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { useToast } from '@/hooks/use-toast'

interface CandidateTest {
  id: string;
  testName: string;
  candidateName: string;
  email: string;
  score: number;
  completedAt: string;
}

export default function CandidateTestsPage() {
  const router = useRouter();
  const [candidateTests, setCandidateTests] = useState<CandidateTest[]>([]);
  const [loading, setLoading] = useState(true);
    const {toast} = useToast()

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "User not logged in!",
          })
          return;
        }
  
        const user = JSON.parse(storedUser);
        const userId = user.userId;
  
        // Use the apiRequest utility
        const data = await apiRequest<any[]>(`/quiz/results/user/${userId}`);
  
        const formattedResults = data.map((result: any) => ({
          id: result._id,
          testName: result.quizId.title,
          candidateName: user.name || 'Unknown', // Use user name from local storage or default
          email: user.email || 'Unknown', // Use user email from local storage or default
          score: result.score,
          completedAt: result.createdAt,
        }));
  
        setCandidateTests(formattedResults);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchResults();
  }, []);
  

  const handleViewResults = (id: string) => {
    router.push(`results/${id}`);
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Candidate Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Name</TableHead>
                <TableHead>Candidate Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Score</TableHead>
                {/* <TableHead>Completed At</TableHead> */}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidateTests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.testName}</TableCell>
                  <TableCell>{test.candidateName}</TableCell>
                  <TableCell>{test.email}</TableCell>
                  <TableCell>{test.score}</TableCell>
                  {/* <TableCell>{new Date(test.completedAt).toLocaleString()}</TableCell> */}
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleViewResults(test.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Results
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
