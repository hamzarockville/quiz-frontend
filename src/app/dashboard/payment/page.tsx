'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export default function Payment() {
  const [plan, setPlan] = useState('monthly')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement Stripe payment processing
    console.log('Processing payment for', { plan, cardNumber, expiryDate, cvv })
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Choose a Plan</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <RadioGroup value={plan} onValueChange={setPlan}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly">Monthly Plan - $49.99/month</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="annual" id="annual" />
                <Label htmlFor="annual">Annual Plan - $499.99/year (Save 17%)</Label>
              </div>
            </RadioGroup>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Subscribe Now
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

