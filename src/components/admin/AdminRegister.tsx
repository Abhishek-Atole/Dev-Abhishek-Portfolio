import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import bcrypt from "bcryptjs";

interface AdminRegisterProps {
  onBackToLogin: () => void;
}

const AdminRegister = ({ onBackToLogin }: AdminRegisterProps) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const { toast } = useToast();

  const registerMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Hash the password before storing
      const hashedPassword = bcrypt.hashSync(data.password, 10);
      const { data: newUser, error: userError } = await supabase
        .from("admin_users")
        .insert({
          username: data.username,
          email: data.email,
          password_hash: hashedPassword
        })
        .select()
        .single();

      if (userError) throw userError;

      return newUser;
    },
    onSuccess: () => {
      toast({
        title: "Registration successful",
        description: "Your admin account has been created. You can now log in.",
      });
      onBackToLogin();
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    registerMutation.mutate(formData);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBackToLogin}>
            <ArrowLeft size={16} />
          </Button>
          <CardTitle>Register Admin Account</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <Input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              placeholder="Enter username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="Enter email"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="Enter password"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              placeholder="Confirm password"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? "Creating Account..." : "Register"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminRegister;
