"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import { apiRequest } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const BillingPage = () => {
  const [billingDetails, setBillingDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([]);
  const [teamSizes, setTeamSizes] = useState<{ [key: string]: number }>({});
  const [additionalMembers, setAdditionalMembers] = useState(1);
  const [pricePerMember, setPricePerMember] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  useEffect(() => {
    async function fetchBillingDetails() {
      try {
        setLoading(true);
        const data: any = await apiRequest("/billing/details");
        setBillingDetails(data);
        setPricePerMember(data.pricePerMember);
        console.log("billingDetails", data);
        setIsSubscribed(data.isSubscribed);
      } catch (error) {
        console.error("Error fetching billing details:", error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchSubscriptionPlans() {
      try {
        const plans: any = await apiRequest("/admin/subscription-plans");
        setSubscriptionPlans(plans);
        console.log("plans", plans);
        // Initialize team sizes for team plans
        const initialTeamSizes = plans
          .filter((plan: any) => plan.type === "team")
          .reduce((acc: any, plan: any) => {
            acc[plan.id] = 1; // Default team size
            return acc;
          }, {});
        setTeamSizes(initialTeamSizes);
      } catch (error) {
        console.error("Error fetching subscription plans:", error);
      }
    }

    fetchBillingDetails();
    fetchSubscriptionPlans();
  }, []);

  const handleTeamSizeChange = (planId: string, value: number) => {
    setTeamSizes((prev) => ({ ...prev, [planId]: value }));
  };
  const router = useRouter();
  const { toast } = useToast();

  if (loading) return <p>Loading...</p>;
  async function handleCancelSubscription() {
    try {
      setLoading(true);
      await apiRequest("/billing/cancel-subscription", { method: "POST" });
      router.push(`/dashboard`);

      toast({
        title: "Success",
        description: "Subscription canceled successfully.",
      });
      // Optionally, refetch billing details
    } catch (error) {
      console.error("Error canceling subscription:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel subscription.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      {isSubscribed && (
        <>
          <h1 className="text-2xl font-bold">Billing & Subscription</h1>

          {/* Subscription Details */}
          <Card className="p-4">
            <h2 className="text-xl font-semibold">Subscription Details</h2>
            {billingDetails?.subscriptionDetail ? (
              <>
                <p>Plan: {billingDetails.subscriptionDetail.currentPlan}</p>
                <p>
                  Renewal Date:{" "}
                  {new Date(
                    billingDetails.subscriptionDetail.expiresAt
                  ).toLocaleDateString()}
                </p>
                <Button className="mt-4" onClick={handleCancelSubscription}>
                  Cancel Subscription
                </Button>
              </>
            ) : (
              <p>Not Subscribed</p>
            )}
          </Card>

          {/* Subscription Management */}
          <Card className="p-4">
            <h2 className="text-xl font-semibold">Subscription Management</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Change Plan</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Plan</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {subscriptionPlans.map((plan: any) => (
                    <div key={plan.id} className="p-4 border rounded-lg">
                      <h3>{plan.name}</h3>
                      <p>{plan.description}</p>
                      <p>Price: ${plan.price}</p>
                      {plan.type === "team" && (
                        <>
                          <Input
                            type="number"
                            min={1}
                            value={teamSizes[plan.id] || 1}
                            onChange={(e) =>
                              handleTeamSizeChange(
                                plan.id,
                                Number(e.target.value)
                              )
                            }
                            placeholder="Team Size"
                          />
                        </>
                      )}
                      <Elements stripe={stripePromise}>
                        <SubscriptionCheckoutForm
                          amount={
                            plan.type === "team"
                              ? plan.price +
                                (plan.pricePerMember || 0) *
                                  (teamSizes[plan.id] || 1)
                              : plan.price
                          }
                          planId={plan._id}
                          teamSize={
                            plan.type === "team"
                              ? teamSizes[plan.id]
                              : undefined
                          }
                          apiEndpoint="/user/{userId}/update-plan"
                          onSuccess={() => location.reload()}
                        />
                      </Elements>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            {billingDetails?.currentPlan === "team" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="ml-4">Modify Team Plan</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Modify Team Plan</DialogTitle>
                  </DialogHeader>
                  <Input
                    type="number"
                    min={1}
                    value={additionalMembers}
                    onChange={(e) =>
                      setAdditionalMembers(Number(e.target.value))
                    }
                    placeholder="Additional Members"
                  />
                  <Elements stripe={stripePromise}>
                    <SubscriptionCheckoutForm
                      amount={additionalMembers * pricePerMember}
                      apiEndpoint="/user/{userId}/add-team-members"
                      additionalMembers={additionalMembers}
                      onSuccess={() => location.reload()}
                    />
                  </Elements>
                </DialogContent>
              </Dialog>
            )}
          </Card>
          {/* Invoices Section */}
          <Card className="p-4">
            <h2 className="text-xl font-semibold">Invoices</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Date</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingDetails?.invoices.map((invoice: any) => (
                  <TableRow key={invoice.invoiceId}>
                    <TableCell>
                      {new Date(invoice.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>${invoice.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
      )} 
      {isSubscribed === false && (
        <p className="text-center text-lg font-semibold">Please Subscribe to see the details</p>
        
      )}
    </div>
  );
};

export default BillingPage;

const SubscriptionCheckoutForm = ({
  amount,
  planId,
  teamSize,
  additionalMembers,
  apiEndpoint,
  onSuccess,
}: {
  amount: number;
  planId?: string;
  teamSize?: number;
  additionalMembers?: number;
  apiEndpoint: string;
  onSuccess: () => void;
}) => {
  console.log("new plan id is ", planId);
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "User not logged in!",
        });
        return;
      }

      const user = JSON.parse(storedUser);
      const userId = user.userId;

      const { clientSecret } = await apiRequest<{ clientSecret: string }>(
        "/payment/create-payment-intent",
        {
          method: "POST",
          body: { amount: Math.round(amount * 100) },
        }
      );

      const result = await stripe?.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements!.getElement(CardElement)!,
          billing_details: { name: "Test User" },
        },
      });

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error.message,
        });
      } else if (result?.paymentIntent?.status === "succeeded") {
        const payload = apiEndpoint.includes("update-plan")
          ? { newPlanId: planId, ...(teamSize ? { teamSize } : {}) }
          : { additionalMembers };

        await apiRequest(apiEndpoint.replace("{userId}", userId), {
          method: "POST",
          body: payload,
        });

        toast({
          title: "Success",
          description: "Payment successful!",
        });
        onSuccess();
      }
    } catch (error) {
      console.error("Error during payment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process payment.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-4 border rounded" />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full p-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Processing..." : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
};
