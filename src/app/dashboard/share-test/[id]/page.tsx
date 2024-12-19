'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'

export default function ShareTest({ params }: { params: { id: string } }) {
  const [testLink, setTestLink] = useState(`https://quizgpt.com/take-test/${params.id}`)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(testLink)
    toast({
      title: "Link Copied",
      description: "The test link has been copied to your clipboard.",
    })
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Share Your Test</h1>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="testLink">Test Link</Label>
            <div className="flex space-x-2">
              <Input
                id="testLink"
                value={testLink}
                readOnly
              />
              <Button onClick={copyToClipboard}>Copy</Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Share via</Label>
            <div className="flex space-x-2">
              <Button variant="outline">Email</Button>
              <Button variant="outline">WhatsApp</Button>
              <Button variant="outline">LinkedIn</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

