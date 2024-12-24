"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
interface FormData {
  email: string;
  subject: string;
  html_template: string;
}

interface FormErrors {
  email?: string;
  subject?: string;
  html_template?: string;
}

const SendEmail = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    subject: "",
    html_template: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | "">();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.email || formData.email.length < 2) {
      newErrors.email = "Email must be at least 2 characters";
    }
    if (!formData.subject || formData.subject.length < 2) {
      newErrors.subject = "Subject must be at least 2 characters";
    }
    if (!formData.html_template || formData.html_template.length < 2) {
      newErrors.html_template = "Message must be at least 2 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENPOINT}/api/email/sendEmail`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      const data = await response.json();
      if (response.ok) {
        toast({ title: "Email sent Successfully" });
        setStatus("success");
        setFormData({
          email: "",
          subject: "",
          html_template: "",
        });
      } else {
        toast({ title: "Error sending mail" });
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Card className="my-auto h-screen w-full max-w-2xl">
      <CardContent className="p-6">
        {status === "success" && (
          <Alert className="mb-4 bg-green-50">
            <AlertDescription>Email sent successfully!</AlertDescription>
          </Alert>
        )}
        {status === "error" && (
          <Alert className="mb-4 bg-red-50">
            <AlertDescription>
              Something went wrong. Please try again.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              name="email"
              placeholder="Enter User Email ID"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <Input
              name="subject"
              placeholder="Enter a Subject"
              value={formData.subject}
              onChange={handleInputChange}
              className={errors.subject ? "border-red-500" : ""}
            />
            {errors.subject && (
              <p className="text-sm text-red-500">{errors.subject}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <textarea
              name="html_template"
              rows={8}
              placeholder="Enter a Message"
              value={formData.html_template}
              onChange={handleInputChange}
              className={`w-full rounded-md border p-3 ${errors.html_template ? "border-red-500" : "border-gray-200"}`}
            />
            {errors.html_template && (
              <p className="text-sm text-red-500">{errors.html_template}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SendEmail;
