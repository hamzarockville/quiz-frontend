"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/api";
import { useToast } from '@/hooks/use-toast'

const AccountSettingsPage = () => {
  const [storedUser, setStoredUser] = useState<{ name?: string; email?: string; userId?: string }>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setStoredUser(user);
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, []);

  const handleUpdateName = async () => {
    try {
      setLoading(true);
      await apiRequest(`/auth/update-name/${storedUser.userId}`, {
        method: "PATCH",
        body: { name },
      });
      toast({
        title: "Success",
        description: "Name updated successfully",
      })
    } catch (error) {
      console.error("Error updating name:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update name.",
      })
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    try {
      setLoading(true);
      await apiRequest(`/auth/update-email/${storedUser.userId}`, {
        method: "PATCH",
        body: { email },
      });
      toast({
        title: "Success",
        description: "Email updated successfully",
      })
    } catch (error) {
      console.error("Error updating email:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update email.",
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
      <p className="text-gray-600">Manage your account details and preferences.</p>

      {/* Account Details Section */}
      <Card className="p-6 shadow-md space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Account Details</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="font-medium text-gray-700">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2"
            />
          </div>
          <Button onClick={handleUpdateName} disabled={loading} className="w-full">
            {loading ? "Updating..." : "Save Name"}
          </Button>
          <div>
            <Label htmlFor="email" className="font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2"
            />
          </div>
          <Button onClick={handleUpdateEmail} disabled={loading} className="w-full">
            {loading ? "Updating..." : "Save Email"}
          </Button>
        </div>
      </Card>

      {/* Password Management Section */}
      <Card className="p-6 shadow-md">
        <h2 className="text-xl font-semibold text-gray-800">Password Management</h2>
        <p className="text-gray-600 mt-2">
          It’s a good idea to use a strong password that you don’t use elsewhere.
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-4 w-full">Change Password</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
            </DialogHeader>
            <ChangePasswordDialog userId={storedUser.userId as string} />
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
};

const ChangePasswordDialog = ({ userId }: { userId: string }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const {toast} = useToast()

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      await apiRequest(`/auth/update-password/${userId}`, {
        method: "PATCH",
        body: { currentPassword, newPassword },
      });
      toast({
        title: "Success",
        description: "Password updated successfully",
      })
    } catch (error) {
      console.error("Error updating password:", error);
    
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="currentPassword" className="font-medium text-gray-700">
          Current Password
        </Label>
        <Input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="mt-2"
        />
      </div>
      <div>
        <Label htmlFor="newPassword" className="font-medium text-gray-700">
          New Password
        </Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-2"
        />
      </div>
      <Button onClick={handleChangePassword} disabled={loading} className="w-full">
        {loading ? "Updating..." : "Save Password"}
      </Button>
    </div>
  );
};

export default AccountSettingsPage;
