"use client";

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { apiRequest } from "@/lib/api";

const stripePromise = loadStripe('pk_test_P15Lr9fB7b1opbweuUK8uKl6');

export function CheckoutForm({ amount, userId, planId, teamSize }: { amount: number; userId: string; planId: string; teamSize?: number }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
  
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      setLoading(true);
  
      try {
        const amountInCents = Math.round(amount * 100);
        const { clientSecret } = await apiRequest<{ clientSecret: string }>("/payment/create-payment-intent", {
          method: "POST",
          body: { amount : amountInCents },
        });
  
        const result = await stripe?.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements!.getElement(CardElement)!,
            billing_details: { name: "Test User" },
          },
        });
  
        if (result?.error) {
          alert(result.error.message);
        } else if (result?.paymentIntent?.status === "succeeded") {
          // Subscribe the user upon successful payment
          await apiRequest(`/user/${userId}/subscribe`, {
            method: "POST",
            body: {
              subscriptionPlanId: planId,
              ...(teamSize ? { teamSize } : {}),
            },
          });
          alert("Subscription successful!");
          window.location.reload();
        }
      } catch (error) {
        console.error("Error during payment:", error);
        alert("Failed to process payment.");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <CardElement className="p-4 border rounded"  />
        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full p-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Processing..." : "Pay"}
        </button>
      </form>
    );
  }