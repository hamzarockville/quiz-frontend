
'use client'

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';
import { apiRequest } from "@/lib/api";

const BillingPage = () => {
  const [billingDetails, setBillingDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([]);
  const [subscriptionPlanId, setSubscriptionPlanId] = useState<string | null>(null);
  const router = useRouter();

  // Fetch billing details and subscription plans
  useEffect(() => {
    async function fetchBillingDetails() {
      try {
        setLoading(true);
        const data: any = await apiRequest("/billing/details");
        console.log('data:', data);
        setIsSubscribed(data.isSubscribed);
        setSubscriptionPlanId(data.subscriptionPlanId)
        setBillingDetails(data);
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
        console.log('sub plans', subscriptionPlans)
      } catch (error) {
        console.error("Error fetching subscription plans:", error);
      }
    }

    fetchBillingDetails();
    fetchSubscriptionPlans();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }
  async function handleCancelSubscription() {
    try {
      setLoading(true);
      await apiRequest("/billing/cancel-subscription", { method: "POST" });
    router.push(`/dashboard`);
      
      alert("Subscription canceled successfully.");
      // Optionally, refetch billing details
    } catch (error) {
      console.error("Error canceling subscription:", error);
      alert("Failed to cancel subscription.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Billing & Subscription</h1>
      <p className="text-sm text-gray-600">Manage your subscription and payment details.</p>

      {/* Subscription Details Section */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold">Subscription Details</h2>
        {billingDetails && isSubscribed ? (
          <>
            <p>Plan: {billingDetails.subscriptionDetail.currentPlan}</p>
            <p>Price: ${billingDetails.subscriptionDetail.price}/month</p>
            <p>Renewal Date: {new Date(billingDetails.subscriptionDetail.expiresAt).toLocaleDateString()}</p>
            <Button className="mt-4" onClick={handleCancelSubscription}>Cancel Subscription</Button>
          </>
        ) : (
          <p>Not Subscribed</p>
        )}
      </Card>

      <Card className="p-4">
        <h2 className="text-xl font-semibold">Subscription Management</h2>
        <p>Current Plan: {billingDetails?.subscriptionDetail?.currentPlan}</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Change Plan</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Plan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {subscriptionPlans.map(plan => (
                <div
                  key={plan._id}
                  className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="text-sm text-gray-500">{plan.description}</p>
                  <p className="mt-2">
                    <span className="font-medium">Price:</span> ${plan.price}
                  </p>
                  {plan.type === "team" && (
                    <p>
                      <span className="font-medium">Price Per Member:</span> ${plan.pricePerMember}
                    </p>
                  )}
                  <Button
                    className={`mt-4 ${subscriptionPlanId === plan._id ? "bg-green-500 text-white" : ""}`}
                    disabled={subscriptionPlanId === plan._id}
                    onClick={() => alert(`Selected Plan: ${plan.name}`)}
                  >
                    {subscriptionPlanId === plan._id ? "Current Plan" : "Update Plan"}
                  </Button>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
        <Button variant="secondary" className="ml-4">Modify Team Plan</Button>
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
                <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                <TableCell>${invoice.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default BillingPage;
