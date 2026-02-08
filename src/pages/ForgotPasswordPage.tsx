import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { RootState, AppDispatch } from "@/lib/store";
import {
  forgotPassword,
  resetActionStatus,
} from "@/lib/features/users/userSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const dispatch: AppDispatch = useDispatch();
  const { actionStatus, error } = useSelector((state: RootState) => state.user);
  const isLoading = actionStatus === "loading";
  useEffect(() => {
    dispatch(resetActionStatus());
  }, [dispatch]);
  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success(
        "If an account with that email exists, a password reset link has been sent."
      );
      dispatch(resetActionStatus());
      setEmail("");
    }
    if (actionStatus === "failed") {
      toast.error(error);
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    dispatch(forgotPassword({ email }));
  };
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">
              Forgot Password
            </CardTitle>
            <CardDescription>
              Enter your email to receive a password reset link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          </CardContent>
          <div className="p-6 pt-0 text-center">
            <Link to="/login" className="text-sm text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPasswordPage;
