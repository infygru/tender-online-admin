"use client";
import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const ImageUpload: React.FC = () => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post(
        "https://api.tenderonline.in/api/ads/upload",
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
        router.back();
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
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

  return (
    <div className="container mx-auto my-8">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Upload Ad Image</h1>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-4"
        />
      </div>
      <Button onClick={handleUpload} disabled={isLoading} className="mt-4">
        {isLoading ? "Uploading..." : "Upload Image"}
      </Button>
    </div>
  );
};

export default ImageUpload;
