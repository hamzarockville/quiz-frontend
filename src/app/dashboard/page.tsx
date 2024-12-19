'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, FileText, CheckCircle, PlusCircle, CalendarCheck, ShieldCheck } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function Dashboard() {
  const [role, setRole] = useState<string | null>(null);
  const [totalTests, setTotalTests] = useState<number | null>(null);
  const [totalCandidates, setTotalCandidates] = useState<number | null>(null);
  const [averageScore, setAverageScore] = useState<number | null>(null);
  const [recentTests, setRecentTests] = useState<any[]>([]);
  const [recentResults, setRecentResults] = useState<any[]>([]);
  const [completionData, setCompletionData] = useState<any[]>([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState<boolean>(false);
  const [subscriptionExpiry, setSubscriptionExpiry] = useState<string | null>(null);
const [totalResults, setTotalResults] = useState<number | null>(null);
const [totalUsers, setTotalUsers] = useState<number | null>(null);
  // Fetch role on component mount
  useEffect(() => {
    const fetchRole = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        console.log('User Role:', user.role);
        setRole(user.role); // Set the role to either 'admin' or 'user'
      }
    };

    fetchRole();
  }, []);

  // Fetch data based on role
  useEffect(() => {
    if (!role) return;

    const fetchData = async () => {
      try {
        if (role === 'admin') {
          const adminStats: any = await apiRequest('/dashboard/admin/stats');
          console.log('adminStats', adminStats);
          setTotalTests(adminStats.totalQuizzes);
          setTotalCandidates(adminStats.totalUsers);
          setAverageScore(adminStats.averageScore);
          setTotalResults(adminStats.totalResults);
         setTotalUsers(adminStats.totalUsers);
          const adminRecent: any = await apiRequest('/dashboard/admin/recent');
          setRecentTests(adminRecent.recentQuizzes);
          setRecentResults(adminRecent.recentResults);
          setCompletionData([
            { name: 'Week 1', completed: 12, incomplete: 3 },
            { name: 'Week 2', completed: 19, incomplete: 2 },
            { name: 'Week 3', completed: 15, incomplete: 5 },
            { name: 'Week 4', completed: 22, incomplete: 1 },
          ]);
        } else if (role === 'user') {
          const userStats: any = await apiRequest('/dashboard/user/stats');
          setTotalTests(userStats.totalQuizzesTaken);
          setAverageScore(userStats.averageScore);
          setSubscriptionStatus(userStats.subscriptionStatus?.isSubscribed);
          setSubscriptionExpiry(userStats.subscriptionStatus?.subscriptionExpiresAt);

          const userRecent: any = await apiRequest('/dashboard/user/recent');
          console.log('userRecent', userRecent);
          setRecentResults(userRecent.recentResults);
          setRecentTests(userRecent.recentQuizzes);

        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, [role]);

  if (!role) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Welcome to Quiz Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {role === 'user' ? (
          <Card>
          <CardHeader>
            <CardTitle>Total Tests Taken</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests ?? 'Loading...'}</div>
          </CardContent>
        </Card>

      ): (
        <Card>
        <CardHeader>
          <CardTitle>Total Tests </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTests ?? 'Loading...'}</div>
        </CardContent>
      </Card>

      )}
       {role === 'user' ? (
         <Card>
         <CardHeader>
           <CardTitle>Average Score</CardTitle>
           <CheckCircle className="h-4 w-4 text-muted-foreground" />
         </CardHeader>
         <CardContent>
           <div className="text-2xl font-bold">{averageScore ?? 'Loading...'}%</div>
         </CardContent>
       </Card>
        ):(
          <Card>
          <CardHeader>
            <CardTitle>Total Results</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResults ?? 'Loading...'}</div>
          </CardContent>
        </Card>
        )}
{role === 'user' ? (

<Card>
<CardHeader>
  <CardTitle>Subscription Status</CardTitle>
  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
</CardHeader>
<CardContent>
  <div className="text-2xl font-bold">
    {subscriptionStatus ? 'Active' : 'Inactive'}
  </div>
</CardContent>
</Card>

):(
  
  <Card>
  <CardHeader>
    <CardTitle>Total Users</CardTitle>
    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">
      {totalUsers}
    </div>
  </CardContent>
</Card>
)}

      {role === 'user' ? (
        <Card>
        <CardHeader>
          <CardTitle>Subscription Expiry</CardTitle>
          <CalendarCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {subscriptionExpiry ? new Date(subscriptionExpiry).toLocaleString() : 'Loading...'}
          </div>
        </CardContent>
      </Card>
      ):(
      <></>
      )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Tests Created</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recentTests.map((test) => (
                <li key={test._id} className="flex justify-between items-center">
                  <span>{test.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(test.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recentResults.map((result) => (
                <li key={result._id} className="flex justify-between items-center">
                  <span>{result.quizId.title}</span>
                  <span className="font-semibold">{result.score}%</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
