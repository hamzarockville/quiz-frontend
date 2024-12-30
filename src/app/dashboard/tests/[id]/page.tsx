// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { useParams } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { apiRequest } from '@/lib/api'

// interface Question {
//   id: string
//   _id:string
//   text: string
//   options: string[]
// }

// export default function TestPage() {
//   const { id } = useParams()
//   const router = useRouter()

//   const [test, setTest] = useState<{ title: string; questions: Question[] } | null>(null)
//   const [answers, setAnswers] = useState<{ [key: string]: string }>({})
//   const [loading, setLoading] = useState(true)
//   const [submitted, setSubmitted] = useState(false)
//   const [score, setScore] = useState<number | null>(null)

//   // Fetch test data
//   useEffect(() => {
//     const fetchTest = async () => {
//       try {
//         const response: any = await apiRequest(`/quiz/${id}`, { method: 'GET' })
//         console.log("Fetched Test Data:", response); 
//         setTest(response)
//       } catch (error) {
//         console.error('Error fetching test:', error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchTest()
//   }, [id])

//   // Handle answer change
//   const handleAnswerChange = (questionId: string, answer: number) => {
//     setAnswers((prev) => ({
//       ...prev,
//       [questionId]: answer.toString(), // Map questionId to the selected answer text
//     }));
//   };
//   // Submit quiz
//   const handleSubmit = async () => {
//     try {
//       const response: any = await apiRequest('/quiz/submit', {
//         method: 'POST',
//         body: {
//           quizId: id,
//           answers: Object.entries(answers).map(([questionId, answer]) => ({
//             questionId,
//             answer,
//           })),
//         },
//       })
//       setScore(response.score)
//       setSubmitted(true)
//     } catch (error) {
//       console.error('Error submitting test:', error)
//       alert('Failed to submit test. Please try again.')
//     }
//   }

//   if (loading) {
//     return <div className="text-center py-10">Loading...</div>
//   }

//   if (!test) {
//     return <div className="text-center py-10">Test not found</div>
//   }

//   if (submitted) {
//     return (
//       <div className="container mx-auto py-10 text-center">
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-2xl">Test Completed</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p>Your score: {score} / {test.questions.length}</p>
//             <Button className="mt-4" onClick={() => router.push('/dashboard')}>
//               Back to Dashboard
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto py-10">
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-2xl">{test.title}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {test.questions.map((question) => (
//             <div key={question.id} className="mb-6">
//               <h3 className="text-lg font-medium">{question.text}</h3>
//               <div className="mt-2 space-y-2">
//                 {question.options.map((option, index) => (
//                   <label key={index} className="flex items-center space-x-2">
//                     <input
//                       type="radio"
//                       name={question.id}
//                       value={option}
//                       onChange={() => handleAnswerChange(question._id, index)}
//                       className="radio"
//                     />
//                     <span>{option}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           ))}
//           <Button className="mt-4 w-full" onClick={handleSubmit}>
//             Submit Test
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useParams } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { apiRequest } from '@/lib/api';

// interface Question {
//   id: string;
//   _id: string;
//   text: string;
//   type: 'mcq' | 'q&a';
//   options?: string[]; // Only available for MCQ type
// }

// export default function TestPage() {
//   const { id } = useParams();
//   const router = useRouter();

//   const [test, setTest] = useState<{ title: string; questions: Question[] } | null>(null);
//   const [answers, setAnswers] = useState<{ [key: string]: string }>({});
//   const [loading, setLoading] = useState(true);
//   const [submitted, setSubmitted] = useState(false);
//   const [score, setScore] = useState<number | null>(null);

//   // Fetch test data
//   useEffect(() => {
//     const fetchTest = async () => {
//       try {
//         const response: any = await apiRequest(`/quiz/${id}`, { method: 'GET' });
//         console.log('Fetched Test Data:', response);
//         setTest(response);
//       } catch (error) {
//         console.error('Error fetching test:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTest();
//   }, [id]);

//   // Handle answer change
//   const handleAnswerChange = (questionId: string, answer: string) => {
//     setAnswers((prev) => ({
//       ...prev,
//       [questionId]: answer, // Store answer as string for both MCQ and Q&A
//     }));
//   };

//   // Submit quiz
//   const handleSubmit = async () => {
//     debugger;
//     try {
//       const body = {
//         quizId: id,
//         answers: Object.entries(answers).map(([questionId, answer]) => ({
//           questionId,
//           answer,
//         })),
//       };
//       console.log('Submitting test with body:', body);
//       const response: any = await apiRequest('/quiz/submit', {
//         method: 'POST',
//         body,
//       });
//       setScore(response.score);
//       setSubmitted(true);
//     } catch (error) {
//       console.error('Error submitting test:', error);
//       alert('Failed to submit test. Please try again.');
//     }
//   };

//   if (loading) {
//     return <div className="text-center py-10">Loading...</div>;
//   }

//   if (!test) {
//     return <div className="text-center py-10">Test not found</div>;
//   }

//   if (submitted) {
//     return (
//       <div className="container mx-auto py-10 text-center">
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-2xl">Test Completed</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p>
//               Your score: {score} / {test.questions.length}
//             </p>
//             <Button className="mt-4" onClick={() => router.push('/dashboard')}>
//               Back to Dashboard
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-10">
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-2xl">{test.title}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {test.questions.map((question) => (
//             <div key={question.id} className="mb-6">
//               <h3 className="text-lg font-medium">{question.text}</h3>
//               <div className="mt-2 space-y-2">
//                 {question.type === 'mcq' && question.options ? (
//                   question.options.map((option, index) => (
//                     <label key={index} className="flex items-center space-x-2">
//                       <input
//                         type="radio"
//                         name={question._id}
//                         value={option}
//                         onChange={() => handleAnswerChange(question._id, option)}
//                         className="radio"
//                       />
//                       <span>{option}</span>
//                     </label>
//                   ))
//                 ) : (
//                   <textarea
//                     className="w-full p-2 border rounded"
//                     placeholder="Your answer here..."
//                     onChange={(e) => handleAnswerChange(question._id, e.target.value)}
//                   ></textarea>
//                 )}
//               </div>
//             </div>
//           ))}
//           <Button className="mt-4 w-full" onClick={handleSubmit}>
//             Submit Test
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiRequest } from '@/lib/api';
import { useToast } from '@/hooks/use-toast'

interface Question {
  id: string;
  _id: string;
  text: string;
  type: 'mcq' | 'q&a';
  options?: string[]; // Only available for MCQ type
}

export default function TestPage() {
  const { id } = useParams();
  const router = useRouter();

  const [test, setTest] = useState<{ title: string; questions: Question[] } | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false); // Prevent multiple submissions
    const toast = useToast()

  // Fetch test data
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response: any = await apiRequest(`/quiz/${id}`, { method: 'GET' });
        console.log('Fetched Test Data:', response);
        setTest(response);
      } catch (error) {
        console.error('Error fetching test:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  // Handle answer change
  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer, // Store answer as string for both MCQ and Q&A
    }));
  };

  // Submit quiz
// Submit quiz
const handleSubmit = async () => {
  if (submitting) return; // Prevent multiple submissions

  setSubmitting(true);
  try {
    const body = {
      quizId: id,
      answers: Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      })),
    };

    console.log('Submitting test with body:', JSON.stringify(body, null, 2)); // Log the payload

    const response: any = await apiRequest('/quiz/submit', {
      method: 'POST',
      body,
    });

    console.log('Submission Response:', JSON.stringify(response, null, 2)); // Log backend response

    setScore(response.score);
    setSubmitted(true);
  } catch (error) {
    console.error('Error submitting test:', error);
    alert('Failed to submit test. Please try again.');
  } finally {
    setSubmitting(false);
  }
};

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!test) {
    return <div className="text-center py-10">Test not found</div>;
  }

  if (submitted) {
    return (
      <div className="container mx-auto py-10 text-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Test Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Your score: {score} / {test.questions.length}
            </p>
            <Button className="mt-4" onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{test.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {test.questions.map((question) => (
            <div key={question.id} className="mb-6">
              <h3 className="text-lg font-medium">{question.text}</h3>
              <div className="mt-2 space-y-2">
                {question.type === 'mcq' && question.options ? (
                  question.options.map((option, index) => (
                    <label key={index} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={question._id}
                        value={option}
                        onChange={() => handleAnswerChange(question._id, option)}
                        className="radio"
                      />
                      <span>{option}</span>
                    </label>
                  ))
                ) : (
                  <textarea
                    className="w-full p-2 border rounded"
                    placeholder="Your answer here..."
                    onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                  ></textarea>
                )}
              </div>
            </div>
          ))}
          <Button
            className="mt-4 w-full"
            onClick={handleSubmit}
            disabled={submitting} // Disable button while submitting
          >
            {submitting ? 'Submitting...' : 'Submit Test'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
