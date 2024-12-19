"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Edit2 } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { CheckoutForm } from "@/app/components/StripePayment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface SubscriptionPlan {
  id: string;
  _id: string;
  name: string;
  description: string;
  price: number;
  type: "individual" | "team";
  pricePerMember?: number;
}
const stripePromise = loadStripe('pk_test_P15Lr9fB7b1opbweuUK8uKl6');

export default function TakeTest() {
  const [step, setStep] = useState(1);
  const [jobDescription, setJobDescription] = useState("");
  const [questionCount, setQuestionCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState("");
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [teamSize, setTeamSize] = useState(1); // For team subscriptions
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.userId);
    } else {
      alert("User not logged in!");
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchSubscriptionData = async () => {
      try {
        const subscriptionStatus = await apiRequest<{ isSubscribed: boolean }>(
          `/user/subscription-details/${userId}`
        );
        setIsSubscribed(subscriptionStatus.isSubscribed);

        if (!subscriptionStatus.isSubscribed) {
          const plans = await apiRequest<SubscriptionPlan[]>("/admin/subscription-plans");
          setSubscriptionPlans(plans);
        }
      } catch (error) {
        console.error("Error fetching subscription data:", error);
      }
    };

    fetchSubscriptionData();
  }, [userId]);

  const handleSubscribe = async (planId: string, type: "individual" | "team") => {
    console.log( 'teamSize', teamSize)
    try {
      if (!userId) {
        alert("User ID is missing");
        return;
      }
  
      // Prepare the request body based on the subscription type
      const body =
        type === "team"
          ? { subscriptionPlanId: planId, teamSize }
          : { subscriptionPlanId: planId };
  
      // Send the subscription request to the backend
      await apiRequest(`/user/${userId}/subscribe`, {
        method: "POST",
        body,
      });
  
      setIsSubscribed(true);
      alert("Subscription successful!");
    } catch (error) {
      console.error("Error subscribing:", error);
      alert("Failed to subscribe. Please try again.");
    }
  };
  
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response: any = await apiRequest("/quiz/generate", {
        method: "POST",
        body: {
          jobDescription,
          numQuestions: questionCount,
        },
      });
  
      console.log("Response from API:", response);
  
      // Adjust correctAnswer to be 0-based
      const adjustedQuestions = response.questions.map((question: Question) => ({
        ...question,
        correctAnswer: question.correctAnswer - 1, // Convert to 0-based index
      }));
  
      setTitle("Generated Test for Job Role");
      setGeneratedQuestions(adjustedQuestions);
      setStep(2);
    } catch (error) {
      console.error("Error generating test:", error);
      alert("Failed to generate test. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveTest = async () => {
    try {
      await apiRequest("/quiz/save", {
        method: "POST",
        body: {
          title,
          jobArea: "Job Role",
          questions: generatedQuestions,
        },
      });
      alert("Test saved successfully!");
      setStep(1);
      setGeneratedQuestions([]);
      setJobDescription("");
      setTitle("");
    } catch (error) {
      console.error("Error saving test:", error);
      alert("Failed to save test. Please try again.");
    }
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion({ ...question });
  };

  const handleSaveQuestion = () => {
    if (editingQuestion) {
      setGeneratedQuestions((questions) =>
        questions.map((q) =>
          q.id === editingQuestion.id ? editingQuestion : q
        )
      );
      setEditingQuestion(null);
    }
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: generatedQuestions.length + 1,
      text: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    };
    setEditingQuestion(newQuestion);
  };

  const handleSaveNewQuestion = () => {
    if (editingQuestion) {
      setGeneratedQuestions((questions) => [...questions, editingQuestion]);
      setEditingQuestion(null);
    }
  };

  if (isSubscribed === null) {
    return <div>Loading...</div>;
  }

  if (!isSubscribed) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Choose a Subscription Plan</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subscriptionPlans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{plan.description}</p>
                <p>Price: ${plan.price}</p>
                {plan.type === "team" && (
                  <>
                    <p>Price Per Member: ${plan.pricePerMember}</p>
                    <Label htmlFor="teamSize">Team Size</Label>
                    <Input
                      id="teamSize"
                      type="number"
                      value={teamSize}
                      onChange={(e) => setTeamSize(parseInt(e.target.value))}
                      className="mt-2"
                    />
                  </>
                )}
                {/* <Button
                  className="mt-4"
                  onClick={() => handleSubscribe(plan._id, plan.type)}
                >
                  Subscribe
                </Button> */}
                 <Elements stripe={stripePromise}>
                  <CheckoutForm
                    amount={
                      plan.type === "team"
                        ? plan.price + plan.pricePerMember! * teamSize
                        : plan.price
                    }
                    userId={userId!}
                    planId={plan._id}
                    teamSize={plan.type === "team" ? teamSize : undefined}
                  />
                </Elements>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-10">
      {step === 1 ? (
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-center">
              What&apos;s the job description?
            </h1>
            <Textarea
              placeholder="Enter or paste job description here..."
              className="min-h-[200px]"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              How many questions do you want to generate?
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Number of questions</span>
                <span>{questionCount}</span>
              </div>
              <Slider
                min={5}
                max={30}
                step={1}
                value={[questionCount]}
                onValueChange={(value) => setQuestionCount(value[0])}
                className="w-full"
              />
            </div>
          </div>

          <Button
            className="w-full h-12 text-lg"
            onClick={handleGenerate}
            disabled={!jobDescription || isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Test"}
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            <p className="text-gray-600">
              This test is generated based on the job description and can be
              edited. You can add, remove or edit questions, reorder them, and
              change the answer options. Once you are happy with the test, you
              can publish it and share the link with candidates.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Multiple-choice questions</h2>
            <div className="space-y-4">
              {generatedQuestions.map((q) => (
                <Card key={q.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <h3 className="font-medium">Q{q.id}: {q.text}</h3>
                      <Button variant="ghost" size="sm" onClick={() => handleEditQuestion(q)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                    <RadioGroup value={q.correctAnswer.toString()}>
                      {q.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={index.toString()} id={`q${q.id}-option${index}`} />
                          <Label htmlFor={`q${q.id}-option${index}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button variant="outline" className="w-full" onClick={handleAddQuestion}>
              <Plus className="h-4 w-4 mr-2" />
              Add question
            </Button>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setStep(1)}>
              Discard
            </Button>
            <Button onClick={handleSaveTest}>
              Save changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
