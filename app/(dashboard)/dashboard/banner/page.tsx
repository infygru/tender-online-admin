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
  const [banner, setBanner] = useState<any>("");
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
    fetch(process.env.NEXT_PUBLIC_API_ENPOINT + `/api/auth/banner`).then(
      (res) => res.json(),
    ),
  );
  const [bannerImage, setBannerImage] = useState<any>("");
  const [bannerUrl, setBannerUrl] = useState<any>("");
  useEffect(() => {
    if (tender) {
      setBanner(tender.banner.banner);
      setIsActive(tender.banner.isActive);
      setIsSignup(tender.banner.isSignup);
    }
  }, [tender]);

  const updateMutation = useMutation(
    (data: { banner: string; isActive: boolean; isSignup: boolean }) =>
      fetch(process.env.NEXT_PUBLIC_API_ENPOINT + "/api/auth/banner", {
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

  // Check if there are no banners
  const hasBanners = tender && tender.banner && tender.banner.banner;

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
              {/* Check if there are no banners */}
              {!hasBanners ? (
                <div className="text-center text-gray-500">
                  No banners available.
                </div>
              ) : (
                <>
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
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={isSignup}
                      onCheckedChange={setIsSignup}
                      id="isSignup"
                      className="border-gray-300"
                    />
                    <label
                      htmlFor="isSignup"
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
                      {updateMutation.isLoading
                        ? "Updating..."
                        : "Update Banner"}
                    </Button>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 space-y-4 rounded-3xl border px-8 py-3">
              <ImageUpload />
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}

import axios from "axios";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

const ImageUpload: React.FC = () => {
  const router = useRouter();
  const { data, refetch, error } = useQuery("images", () =>
    fetch(process.env.NEXT_PUBLIC_API_ENPOINT + "/api/ads/banner/images").then(
      (res) => res.json(),
    ),
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState<string | any>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        variant: "destructive",
        description: "Please select a file to upload.",
      });
      return;
    }

    if (!url) {
      toast({
        title: "No URL Entered",
        variant: "destructive",
        description: "Please enter a URL for the image.",
      });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("url", url);

    try {
      if (data && data.length > 0) {
        // If there is an existing banner, update it
        const response = await axios.put(
          process.env.NEXT_PUBLIC_API_ENPOINT +
            "/api/ads/banner/upload/" +
            data[0]._id, // Use the ID of the existing banner
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (response.status === 200) {
          toast({
            title: "Upload Successful",
            variant: "default",
            description: "Image updated successfully.",
          });
        }
      } else {
        // If no existing banner, create a new one
        const response = await axios.post(
          process.env.NEXT_PUBLIC_API_ENPOINT + "/api/ads/banner/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (response.status === 201) {
          toast({
            title: "Upload Successful",
            variant: "default",
            description: "Image uploaded successfully.",
          });
        }
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload Error",
        variant: "destructive",
        description:
          error.response?.data?.message ||
          "Failed to upload image. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedFile(data[0].imageUrl);
      setUrl(data[0].url);
    }
  }, [data]);
  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container mx-auto my-8">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Upload Ad Image</h1>
          <div className="flex items-center space-x-2">
            <Switch
              checked={data[0]?.active}
              onCheckedChange={async () => {
                const response = await axios.put(
                  process.env.NEXT_PUBLIC_API_ENPOINT +
                    "/api/ads/banner/upload/" +
                    data[0]._id,
                  {
                    active: !data[0].active,
                  },
                );
                refetch();
                console.log(response, "response");
                toast({
                  title: "Success",
                  description: "Image updated successfully.",
                });
              }}
              id="airplane-mode"
            />
            <Label htmlFor="airplane-mode">Is Image show</Label>
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-4"
        />
        {/*  show selected image  */}
        {selectedFile && (
          <img
            src={
              selectedFile instanceof File
                ? URL.createObjectURL(selectedFile)
                : selectedFile
            }
            alt="Selected Image"
            className="mt-4"
          />
        )}
        <br />
        <Input
          value={url}
          type="text"
          placeholder="Enter URL"
          onChange={(e) => setUrl(e.target.value)}
          className="mt-4 "
        />
      </div>
      <Button onClick={handleUpload} disabled={isLoading} className="mt-4">
        {isLoading ? "Uploading..." : "Upload Image"}
      </Button>
    </div>
  );
};
