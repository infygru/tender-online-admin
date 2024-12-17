"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const SubscriptionCancel = ({ subscriptionId }) => {
  const { toast } = useToast();

  const handleCancelSubscription = async (subscriptionId) => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_ENPOINT +
          "/api/webhook/cancel-subscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ subscriptionId }),
        },
      );
      if (response.ok)
        toast({
          title: "Subscription Cancellation Initiated",
          description: `It could takes few minutes to update - ${subscriptionId}`,
        });
    } catch (error) {}
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} size="sm">
          cancel
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently cancel user
            subscription and stop further recurrings.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="secondary">Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant={"destructive"}
            onClick={() => handleCancelSubscription(subscriptionId)}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SubscriptionCancel;
