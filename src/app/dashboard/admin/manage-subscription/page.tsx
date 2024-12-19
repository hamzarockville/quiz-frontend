"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";

interface SubscriptionPlan {
  id: string; // Mapped from _id
  _id: string;
  name: string;
  description: string;
  type: "individual" | "team";
  price: number;
  pricePerMember?: number; // Optional for team plans
}

export default function ManageSubscriptions() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [newPlan, setNewPlan] = useState<Partial<SubscriptionPlan>>({
    name: "",
    description: "",
    price: 0,
    type: "individual",
    pricePerMember: 0,
  });
  const [editPlan, setEditPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch plans on component mount
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const plansData = await apiRequest<SubscriptionPlan[]>("/admin/subscription-plans");

      // Map _id to id for compatibility
      const mappedPlans = plansData.map((plan) => ({
        ...plan,
        id: plan._id, // Map _id from API response to id
      }));
      setPlans(mappedPlans);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast({
        title: "Error",
        description: "Failed to fetch plans. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdPlan = await apiRequest<SubscriptionPlan>("/admin/subscription-plans", {
        method: "POST",
        body: newPlan,
      });

      const mappedPlan = { ...createdPlan, id: createdPlan._id }; // Map _id to id
      setPlans([...plans, mappedPlan]);
      setNewPlan({ name: "", description: "", price: 0, type: "individual", pricePerMember: 0 });
      toast({
        title: "Success",
        description: "New subscription plan created.",
      });
    } catch (error) {
      console.error("Error creating plan:", error);
      toast({
        title: "Error",
        description: "Failed to create subscription plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPlan) return;

    try {
      const updatedPlan = await apiRequest<SubscriptionPlan>(`/admin/subscription-plans/${editPlan.id}`, {
        method: "PUT",
        body: {
          name: editPlan.name,
          description: editPlan.description,
          price: editPlan.price,
          pricePerMember: editPlan.pricePerMember,
        },
      });

      const mappedPlan = { ...updatedPlan, id: updatedPlan._id }; // Map _id to id
      setPlans(plans.map((p) => (p.id === mappedPlan.id ? mappedPlan : p)));
      setEditPlan(null);
      toast({
        title: "Success",
        description: "Subscription plan updated.",
      });
    } catch (error) {
      console.error("Error updating plan:", error);
      toast({
        title: "Error",
        description: "Failed to update subscription plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      await apiRequest(`/admin/subscription-plans/${planId}`, {
        method: "DELETE",
      });
      setPlans(plans.filter((plan) => plan.id !== planId));
      toast({
        title: "Success",
        description: "Subscription plan deleted.",
      });
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast({
        title: "Error",
        description: "Failed to delete subscription plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Manage Subscriptions</h1>

      {/* Create or Edit Plan Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editPlan ? "Edit Subscription Plan" : "Create New Subscription Plan"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={editPlan ? handleUpdatePlan : handleCreatePlan} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Plan Name</Label>
                <Input
                  id="name"
                  value={editPlan ? editPlan.name : newPlan.name}
                  onChange={(e) =>
                    editPlan
                      ? setEditPlan({ ...editPlan, name: e.target.value })
                      : setNewPlan({ ...newPlan, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editPlan ? editPlan.description : newPlan.description}
                  onChange={(e) =>
                    editPlan
                      ? setEditPlan({ ...editPlan, description: e.target.value })
                      : setNewPlan({ ...newPlan, description: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Price (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  value={editPlan ? editPlan.price : newPlan.price}
                  onChange={(e) =>
                    editPlan
                      ? setEditPlan({ ...editPlan, price: parseFloat(e.target.value) })
                      : setNewPlan({ ...newPlan, price: parseFloat(e.target.value) })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={editPlan ? editPlan.type : newPlan.type}
                  onChange={(e) =>
                    editPlan
                      ? setEditPlan({ ...editPlan, type: e.target.value as "individual" | "team" })
                      : setNewPlan({ ...newPlan, type: e.target.value as "individual" | "team" })
                  }
                  className="w-full h-10 px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="individual">Individual</option>
                  <option value="team">Team</option>
                </select>
              </div>
              {((editPlan && editPlan.type === "team") || newPlan.type === "team") && (
                <div>
                  <Label htmlFor="pricePerMember">Price Per Member</Label>
                  <Input
                    id="pricePerMember"
                    type="number"
                    value={editPlan ? editPlan.pricePerMember : newPlan.pricePerMember}
                    onChange={(e) =>
                      editPlan
                        ? setEditPlan({ ...editPlan, pricePerMember: parseFloat(e.target.value) })
                        : setNewPlan({ ...newPlan, pricePerMember: parseFloat(e.target.value) })
                    }
                  />
                </div>
              )}
            </div>
            <Button type="submit">{editPlan ? "Update Plan" : "Create Plan"}</Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing Plans */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Existing Subscription Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price (USD)</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price Per Member</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>{plan.name}</TableCell>
                  <TableCell>{plan.description}</TableCell>
                  <TableCell>${plan.price}</TableCell>
                  <TableCell>{plan.type}</TableCell>
                  <TableCell>
                    {plan.type === "team" ? `$${plan.pricePerMember}` : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" onClick={() => setEditPlan(plan)}>
                      Edit
                    </Button>
                    <Button variant="destructive" className="ml-2" onClick={() => handleDeletePlan(plan.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
