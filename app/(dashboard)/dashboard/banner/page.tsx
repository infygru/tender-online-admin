"use client";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import BreadCrumb from "@/components/breadcrumb";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const breadcrumbItems = [
  {
    title: "Banner Template",
    link: "/dashboard/banner",
  },
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default function Page({ searchParams }: paramsProps) {
  const [banner, setBanner] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isSignup, setIsSignup] = useState<boolean>(false);

  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const offset = (page - 1) * pageLimit;

  const {
    data: tender,
    isLoading,
    error,
    refetch,
  } = useQuery(["tender", { page, limit: pageLimit }], () =>
    fetch(`https://tender-online-h4lh.vercel.app/api/auth/banner`).then((res) =>
      res.json(),
    ),
  );

  useEffect(() => {
    if (tender) {
      setBanner(tender.banner.banner);
      setIsActive(tender.banner.isActive);
      setIsSignup(tender.banner.isSignup);
    }
  }, [tender]);

  const updateMutation = useMutation(
    (data: { banner: string; isActive: boolean; isSignup: boolean }) =>
      fetch("https://tender-online-h4lh.vercel.app/api/auth/banner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((res) => res.json()),
    {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Banner updated successfully.",
        });
        refetch();
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to update the banner." });
      },
    },
  );

  const handleUpdate = () => {
    if (isActive && !isSignup && !banner.trim()) {
      toast({
        title: "Validation Error",
        description: "Banner text is required.",
      });
      return;
    }

    if (!banner.trim()) {
      toast({
        title: "Validation Error",
        description: "Banner text is required.",
      });
      return;
    }

    updateMutation.mutate({ banner, isActive, isSignup });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />

        <ScrollArea className="h-[80vh]">
          <div className="flex items-start justify-between space-x-4">
            <Heading
              title={`Banner Template  (${tender?.contacts?.length || 0})`}
              description="Manage the banner template for the tender document request page."
            />
          </div>
          <Separator />

          <div className="mt-4">
            <div className="space-y-4 rounded-3xl border px-8 py-3">
              {/* Banner Input */}
              <div>
                <label
                  htmlFor="bannerText"
                  className="block text-sm font-medium text-gray-700"
                >
                  Banner Text
                </label>
                <Input
                  id="bannerText"
                  value={banner}
                  onChange={(e) => setBanner(e.target.value)}
                  placeholder="Enter banner text"
                  className="mt-1 block w-full border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* isActive Switch */}
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  id="isActive"
                  className="border-gray-300"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700"
                >
                  Is Active Banner Enabled
                </label>
              </div>

              {/* isSignup Button */}
              {/* <div className="flex items-center space-x-2">
                <Button onClick={() => setIsSignup(!isSignup)}>
                  {isSignup ? "Signup Enabled" : "Signup Disabled"}
                </Button>
              </div> */}
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isSignup}
                  onCheckedChange={setIsSignup}
                  id="isActive"
                  className="border-gray-300"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700"
                >
                  Is Signup Button Enabled
                </label>
              </div>

              {/* Update Button */}
              <div className="flex items-center justify-center">
                <Button
                  onClick={handleUpdate}
                  disabled={updateMutation.isLoading}
                >
                  {updateMutation.isLoading ? "Updating..." : "Update Banner"}
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
