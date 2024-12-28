import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

const AccountSettingsPage = () => {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <p className="text-sm text-gray-600">Manage your account details and preferences.</p>
  
        {/* Account Details Section */}
        <Card>
          <h2 className="text-xl font-semibold">Account Details</h2>
          <form>
            <Label>Name</Label>
            <Input type="text" placeholder="John Doe" />
  
            <Label>Email</Label>
            <Input type="email" value="john.doe@example.com" readOnly />
  
            <Button >Save Changes</Button>
          </form>
        </Card>
  
        {/* Password Management Section */}
        <Card>
          <h2 className="text-xl font-semibold">Password Management</h2>
          <Button>Change Password</Button>
        </Card>
  
        {/* Subscription Management Section */}
       
      </div>
    );
  };
  
  export default AccountSettingsPage;
  