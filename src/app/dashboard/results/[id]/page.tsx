'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react'; // Icons for tick and cross
import { apiRequest } from '@/lib/api';

export default function TestResults({ params }: { params: { id: string } }) {
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await apiRequest<any>(`/quiz/results/result/${params.id}`);
        console.log('Fetched results:', data);
        setResults(data);
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    fetchResults();
  }, [params.id]);

  if (!results) {
    return <div className="container mx-auto py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <Card className="mb-8">
        <CardHeader>
          <h1 className="text-2xl font-bold">{results.quizTitle} - Detailed Results</h1>
        </CardHeader>
        <CardContent>
          {results.detailedResults.map((result: any, index: number) => {
            return (
              <div
                key={index}
                className="mb-6 p-4 border rounded-lg shadow-md bg-white"
              >
                {/* Question */}
                <h2 className="text-lg font-semibold mb-4">{`Q${index + 1}: ${result.question}`}</h2>

                {/* Options */}
                <ul className="space-y-2">
                  {result.options.map((option: string, i: number) => {
                    const isSelected = result.selectedAnswer === option;
                    const isCorrect = result.correctAnswer === option;

                    let className =
                      'p-2 rounded-md flex items-center justify-between border';
                    if (isCorrect) className += ' bg-green-100 text-green-800 border-green-300';
                    if (isSelected && !isCorrect)
                      className += ' bg-red-100 text-red-800 border-red-300';

                    return (
                      <li key={i} className={className}>
                        <span>{option}</span>
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : isSelected ? (
                          <XCircle className="w-5 h-5 text-red-600" />
                        ) : null}
                      </li>
                    );
                  })}
                </ul>

                {/* Selected Answer and Correct Answer */}
                <div className="mt-4">
                  <p className="text-sm">
                    <span className="font-bold">Your Answer:</span>{' '}
                    {result.selectedAnswer || 'Not answered'}
                  </p>
                  {!result.isCorrect && (
                    <p className="text-sm text-gray-600">
                      <span className="font-bold">Correct Answer:</span>{' '}
                      {result.correctAnswer}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Summary</h2>
        </CardHeader>
        <CardContent>
          <p className="text-lg">Total Score: {results.totalScore}</p>
        </CardContent>
      </Card>
    </div>
  );
}
