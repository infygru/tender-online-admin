"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Editor } from "novel";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomEditor from "@/components/CustomEditor";
interface BlogPostFormData {
  title: string;
  description: string;
  featuredImage: File | null;
  tags: string;
  author: string;
  introduction: string;
  conclusion: string;
}

const CreateBlogPost: React.FC = () => {
  const router = useRouter();
  const editorRef = useRef<any>(null);
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: "",
    description: "",
    featuredImage: null,
    tags: "",
    author: "",
    introduction: "",
    conclusion: "",
  });

  const [featuredImagePreview, setFeaturedImagePreview] = useState<
    string | null
  >(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      featuredImage: null,
      tags: "",
      author: "",
      introduction: "",
      conclusion: "",
    });
    setFeaturedImagePreview(null);

    // Reset the editor content
    if (editorRef.current) {
      editorRef.current.commands.clearContent();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate image type and size
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a valid image (JPEG, PNG, GIF, WebP)",
          variant: "destructive",
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setFormData((prev) => ({ ...prev, featuredImage: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form fields
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const formDataToSubmit = new FormData();

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          if (key === "featuredImage" && value instanceof File) {
            formDataToSubmit.append(key, value);
          } else if (typeof value === "string") {
            formDataToSubmit.append(key, value);
          }
        }
      });

      const response = await fetch(
        process.env.NEXT_PUBLIC_API_ENPOINT + "/api/blog",
        {
          method: "POST",
          body: formDataToSubmit,
        },
      );
      const data = await response.json();

      if (response.ok && data.code === 201) {
        toast({
          title: "Success",
          description: "Blog post submitted successfully",
        });
        resetForm();
        // Reset form or redirect
        router.push("/dashboard/blog");
      } else {
        toast({
          title: "Error",
          description:
            data.message || "Error submitting form. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: "Network Error",
        description:
          "Unable to submit blog post. Please check your connection.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <div className="container mx-auto flex-grow overflow-y-auto px-4 py-8">
        <Card className="mx-auto w-full max-w-4xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Create Blog Post
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[calc(100vh-200px)] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter blog post title"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="featuredImage">Featured Image</Label>
                    <Input
                      type="file"
                      id="featuredImage"
                      name="featuredImage"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleImageUpload}
                    />
                    {featuredImagePreview && (
                      <div className="mt-2">
                        <img
                          src={featuredImagePreview}
                          alt="Featured"
                          className="h-48 max-w-full rounded-md object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      type="text"
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="Enter tags (comma-separated)"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      placeholder="Enter author name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="introduction">Introduction</Label>
                    <Input
                      type="text"
                      id="introduction"
                      name="introduction"
                      value={formData.introduction}
                      onChange={handleInputChange}
                      placeholder="Brief introduction"
                    />
                  </div>

                  <div>
                    <Label htmlFor="conclusion">Conclusion</Label>
                    <Input
                      type="text"
                      id="conclusion"
                      name="conclusion"
                      value={formData.conclusion}
                      onChange={handleInputChange}
                      placeholder="Concluding remarks"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Blog Content</Label>
                <div className="max-h-[400px] overflow-y-auto">
                  <CustomEditor
                    onChange={(html) => {
                      setFormData((prev) => ({
                        ...prev,
                        description: html,
                      }));
                    }}
                  />
                </div>
              </div>

              <Button type="submit" variant={"default"} className="mt-4 w-full">
                Save Blog Post
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateBlogPost;
