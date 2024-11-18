"use client";

import { BlogPostContent } from "@/components/forms/blog-post";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { Editor } from "novel";

const Post: React.FC = () => {
  const [postContent, setPostContent] = useState<any>([]);
  const [featureImg1, setFeatureImg1] = useState<any>();
  const [featureImg2, setFeatureImg2] = useState<any>();
  const [descriptionValue, setDescriptionValue] = useState<any>();
  console.log(descriptionValue, "descriptionValue");

  const [formDataD, setFormData] = useState<any>({
    title: "",
    featureImg1: "",
    featureImg2: "",
    description: "",
    tags: "",
    author: "",
    introduction: "",
    conclusion: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({ ...prevData, [name]: value }));
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      const postContentString = JSON.stringify(postContent);
      formData.append("title", formDataD.title);
      formData.append("description", descriptionValue);

      const response = await fetch("http://localhost:8080/api/blog", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        toast({
          title: "Error",
          description: "Error submitting form. Please try again.",
        });
      }

      const data = await response.json();
      if (data.code === 201) {
        toast({
          title: "Success",
          description: "Blog post submitted successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Error submitting form. Please try again.",
        });
      }
    } catch (error: any) {
      console.error("Error submitting form:", error.message);
    }
  };

  return (
    <div className="h-screen overflow-y-scroll bg-gray-100 px-6 pb-24">
      <h1 className="px-4 py-4 text-3xl font-semibold text-gray-800">
        Post Blog
      </h1>

      <Editor
        onDebouncedUpdate={(editor?: any) => {
          setDescriptionValue(editor?.getHTML());
        }}
        defaultValue={{
          type: "doc",
          content: [],
        }}
        className="w-full rounded-2xl bg-white text-black"
      />
      <button className="rounded-xl px-6 py-3" onClick={handleSubmit}>
        Save Blog
      </button>
    </div>
  );
};

export default Post;
