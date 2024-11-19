"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { toast } from "sonner";
import { set } from "date-fns";
const formSchema = z.object({
  email: z.string().min(2, {
    message: "email must be at least 2 characters.",
  }),
  html_template: z.string().min(2, {
    message: "html_template must be at least 2 characters.",
  }),
  subject: z.string().min(2, {
    message: "subject must be at least 2 characters.",
  }),
});

const SendEmail = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      html_template: "",
      subject: "",
    },
  });
  const [loading, setLoading] = useState<boolean>(false);
  // 2. Define a submit handler.

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      // Make an HTTP request to the specified endpoint.
      const response = await axios.post(
        "https://tender-online.vercel.app/api/email/all",
        values,
      );
      if (response.data.status === "success") {
        toast.success("Email sent successfully");
        setLoading(false);
      } else {
        toast.error("Something went wrong");
        setLoading(false);
      }

      // Handle the response as needed.
      console.log("API Response:", response.data);
    } catch (error) {
      // Handle errors.
      console.error("API Error:", error);
    }
  }

  if (loading) {
    return <div className="px-6 py-6 text-2xl font-semibold">Loading ...</div>;
  }
  return (
    <div className="px-6 py-3">
      <div className="">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter User Email ID" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a Subject" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="html_template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={8}
                      placeholder="Enter a Message"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="text-white" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SendEmail;
