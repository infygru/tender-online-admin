"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Editor } from "novel";
import CustomEditor from "@/components/CustomEditor";
interface BlogPost {
  id: string;
  title: string;
  description: string;
  featuredImage?: string;
  tags?: string;
  author?: string;
}

export default function BlogPostDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<BlogPost>>({});
  const [featuredImageFile, setfeaturedImageFile] = useState<File | null>(null);
  const [featuredImagePreview, setfeaturedImagePreview] = useState<
    string | null
  >(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_API_ENPOINT + "api/blog/" + params.slug,
        );

        if (response.data) {
          setPost(response.data);
          setFormData(response.data);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        toast({
          title: "Error",
          description: "Failed to fetch blog post",
          variant: "destructive",
        });
        router.push("/dashboard/blog");
      }
    };

    fetchPost();
  }, [params.slug, router]);

  const handleImageUpload = async (
    file: File | null,
    fieldName: "featuredImage",
  ) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append(fieldName, file);

        const response = await axios.post(
          process.env.NEXT_PUBLIC_API_ENPOINT + "/api/upload-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (response.data.url) {
          setFormData((prev) => ({
            ...prev,
            [fieldName]: response.data.url,
          }));

          toast({
            title: "Success",
            description: `${fieldName} uploaded successfully`,
          });
        }
      } catch (error) {
        console.error(`Error uploading ${fieldName}:`, error);
        toast({
          title: "Upload Error",
          description: `Failed to upload ${fieldName}`,
          variant: "destructive",
        });
      }
    }
  };

  const handleImagePreview = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "featuredImage",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate image
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

      // Set file and create preview
      if (type === "featuredImage") {
        setfeaturedImageFile(file);
        handleImageUpload(file, "featuredImage");
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "featuredImage") {
          setfeaturedImagePreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const submitFormData = new FormData();

      // Carefully append fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          // Handle description differently
          if (key === "description") {
            submitFormData.append(
              key,
              typeof value === "string" ? value : JSON.stringify(value),
            );
          } else {
            submitFormData.append(key, value.toString());
          }
        }
      });

      // If there are new image files, append them
      if (featuredImageFile) {
        submitFormData.append("featuredImage", featuredImageFile);
      }

      const response = await axios.put(
        process.env.NEXT_PUBLIC_API_ENPOINT + "/api/blog/" + params.slug,
        submitFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Blog post updated successfully",
        });
        setIsEditing(false);
        // Refetch the post to ensure we have the latest data
        const updatedPost = await axios.get(
          process.env.NEXT_PUBLIC_API_ENPOINT + "/api/blog/" + params.slug,
        );
        setPost(updatedPost.data);
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "Update Error",
        description: "Failed to update blog post",
        variant: "destructive",
      });
    }
  };

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex h-screen flex-col overflow-auto px-4 pb-12">
      <Card className="mx-auto my-8  flex w-full max-w-4xl flex-grow flex-col overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {isEditing ? "Edit Blog Post" : "Blog Post Details"}
          </CardTitle>
        </CardHeader>
        <CardContent className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex-grow overflow-auto">
          {isEditing ? (
            <form
              onSubmit={handleSubmit}
              className="flex h-full flex-col space-y-6 overflow-auto"
            >
              <div className="grid flex-shrink-0 grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Enter blog post title"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="featuredImage">Feature Image 1</Label>
                    <Input
                      type="file"
                      id="featuredImage"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={(e) => handleImagePreview(e, "featuredImage")}
                    />
                    {(featuredImagePreview || post.featuredImage) && (
                      <div className="mt-2">
                        <img
                          src={featuredImagePreview || post.featuredImage}
                          alt="Feature Image 1"
                          className="h-48 max-w-full rounded-md object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      type="text"
                      id="tags"
                      name="tags"
                      value={formData.tags || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          tags: e.target.value,
                        }))
                      }
                      placeholder="Enter tags (comma-separated)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          author: e.target.value,
                        }))
                      }
                      placeholder="Enter author name"
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
                    initialContent={post.description}
                  />
                </div>
              </div>
              <div className="flex flex-shrink-0 space-x-4">
                <Button
                  type="submit"
                  className="flex-grow border-2"
                  variant={"default"}
                >
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-grow"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="h-full space-y-6 overflow-auto">
              <div>
                <h2 className="mb-2 text-2xl font-bold">{post.title}</h2>
                {post.author && (
                  <p className="text-muted-foreground">By {post.author}</p>
                )}
              </div>

              {post.featuredImage && (
                <div className="mb-4">
                  <img
                    src={post.featuredImage}
                    alt="Feature Image 1"
                    className="h-96 w-full rounded-lg object-cover"
                  />
                </div>
              )}

              <div className="prose max-w-none overflow-auto">
                {post.description && (
                  <p dangerouslySetInnerHTML={{ __html: post.description }} />
                )}
              </div>

              {post.tags && (
                <div className="mt-4">
                  <strong>Tags:</strong> {post.tags}
                </div>
              )}

              <div className="mt-6 flex space-x-4">
                <Button
                  onClick={() => setIsEditing(true)}
                  className="flex-grow"
                >
                  Edit Post
                </Button>
                <Button
                  variant="destructive"
                  className="flex-grow"
                  onClick={async () => {
                    try {
                      await fetch(
                        process.env.NEXT_PUBLIC_API_ENPOINT +
                          `/api/blog/` +
                          params.slug,
                        {
                          method: "DELETE",
                        },
                      );
                      toast({
                        title: "Success",
                        description: "Blog post deleted successfully",
                      });
                      router.push("/dashboard/blog");
                    } catch (error) {
                      console.error("Error deleting post:", error);
                      toast({
                        title: "Delete Error",
                        description: "Failed to delete blog post",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  Delete Post
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
