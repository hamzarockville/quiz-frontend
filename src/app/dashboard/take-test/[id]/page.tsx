'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

// Mock questions (replace with actual API call)
const mockQuestions = [
    {
      id: 1,
      question: "What is the primary function of a firewall in network security?",
      options: [
        "To increase internet speed",
        "To filter network traffic",
        "To store data securely",
        "To encrypt emails"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Which protocol is used to securely transfer files over the internet?",
      options: [
        "HTTP",
        "FTP",
        "HTTPS",
        "SFTP"
      ],
      correctAnswer: 3
    },
    {
      id: 3,
      question: "What does SEO stand for in digital marketing?",
      options: [
        "Search Engine Optimization",
        "Social Engagement Output",
        "Secure Email Operations",
        "Sales Efficiency Optimization"
      ],
      correctAnswer: 0
    },
    {
      id: 4,
      question: "Which of the following is a non-relational database?",
      options: [
        "MySQL",
        "MongoDB",
        "PostgreSQL",
        "Oracle"
      ],
      correctAnswer: 1
    },
    {
      id: 5,
      question: "What is the purpose of the GDPR regulation?",
      options: [
        "To standardize coding practices",
        "To protect user data and privacy",
        "To enhance AI model accuracy",
        "To enforce copyright laws"
      ],
      correctAnswer: 1
    },
    {
      id: 6,
      question: "Which HTTP method is typically used to update existing data?",
      options: [
        "GET",
        "POST",
        "PUT",
        "DELETE"
      ],
      correctAnswer: 2
    },
    {
      id: 7,
      question: "Which programming language is commonly used for web development?",
      options: [
        "C++",
        "Python",
        "JavaScript",
        "R"
      ],
      correctAnswer: 2
    },
    {
      id: 8,
      question: "What is the primary goal of content marketing?",
      options: [
        "Increase direct sales",
        "Improve user experience",
        "Build brand awareness and engagement",
        "Reduce website bounce rate"
      ],
      correctAnswer: 2
    },
    {
      id: 9,
      question: "What does the acronym IP stand for in 'IP address'?",
      options: [
        "Internet Protocol",
        "Internet Provider",
        "Internal Process",
        "Information Packet"
      ],
      correctAnswer: 0
    },
    {
      id: 10,
      question: "Which of the following is a JavaScript framework?",
      options: [
        "React",
        "Django",
        "Laravel",
        "Spring"
      ],
      correctAnswer: 0
    }
  ];
  

export default function TakeTest({ params }: { params: { id: string } }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{[key: number]: number}>({})
  const [testStarted, setTestStarted] = useState(false)

  const handleStartTest = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement API call to validate user and start test
    setTestStarted(true)
  }

  const handleAnswer = (answer: number) => {
    setAnswers({...answers, [currentQuestion]: answer})
  }

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    // TODO: Implement API call to submit test
    console.log('Test submitted', answers)
  }

  if (!testStarted) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold">Start Test</h1>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStartTest} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit">Start Test</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Question {currentQuestion + 1}</h1>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{mockQuestions[currentQuestion].question}</p>
          <RadioGroup
            value={answers[currentQuestion]?.toString()}
            onValueChange={(value) => handleAnswer(parseInt(value))}
          >
            {mockQuestions[currentQuestion].options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handlePrevious} disabled={currentQuestion === 0}>Previous</Button>
          {currentQuestion === mockQuestions.length - 1 ? (
            <Button onClick={handleSubmit}>Submit</Button>
          ) : (
            <Button onClick={handleNext}>Next</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

