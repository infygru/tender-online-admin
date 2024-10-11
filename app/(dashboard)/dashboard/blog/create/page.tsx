"use client";

import { BlogPostContent } from "@/components/forms/blog-post";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Post: React.FC = () => {
  const [postContent, setPostContent] = useState<any>([]);
  const [featureImg1, setFeatureImg1] = useState<any>();
  const [featureImg2, setFeatureImg2] = useState<any>();

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
      formData.append("postContent", postContentString);
      formData.append("files", featureImg1);
      formData.append("files", featureImg2);
      formData.append("title", formDataD.title);
      formData.append("description", formDataD.description);
      formData.append("tags", formDataD.tags);
      formData.append("author", formDataD.author);
      formData.append("introduction", formDataD.introduction);
      formData.append("conclusion", formDataD.conclusion);

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
    <div className="h-screen overflow-y-scroll bg-gray-100 pb-24">
      <h1 className="px-4 py-4 text-3xl font-semibold text-gray-800">
        Post Blog
      </h1>
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl rounded-lg bg-white px-8 py-6 shadow-md"
      >
        <label className="mb-4 block">
          <span className="text-gray-700">Title:</span>
          <input
            placeholder="Title"
            type="text"
            name="title"
            value={formDataD.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring focus:ring-indigo-500"
          />
        </label>

        <label className="mb-4 block">
          <span className="text-gray-700">Description:</span>
          <textarea
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring focus:ring-indigo-500"
            cols={30}
            rows={4}
            placeholder="Description"
            name="description"
            value={formDataD.description}
            onChange={handleChange}
            required
          />
        </label>

        <label className="mb-4 block">
          <span className="text-gray-700">Tags:</span>
          <input
            placeholder="Tags"
            type="text"
            name="tags"
            value={formDataD.tags}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring focus:ring-indigo-500"
          />
        </label>

        <label className="mb-4 block">
          <span className="text-gray-700">Author:</span>
          <input
            placeholder="Author"
            type="text"
            name="author"
            value={formDataD.author}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring focus:ring-indigo-500"
          />
        </label>

        <label className="mb-4 block">
          <span className="text-gray-700">Introduction:</span>
          <input
            placeholder="Introduction"
            type="text"
            name="introduction"
            value={formDataD.introduction}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring focus:ring-indigo-500"
          />
        </label>

        <label className="mb-4 block">
          <span className="text-gray-700">Conclusion:</span>
          <input
            placeholder="Conclusion"
            type="text"
            name="conclusion"
            value={formDataD.conclusion}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring focus:ring-indigo-500"
          />
        </label>

        <div className="mb-6">
          <label className="mb-2 block text-gray-700">Feature Images:</label>
          <input
            type="file"
            name="featureImg1"
            onChange={(e: any) => setFeatureImg1(e.target.files[0])}
            className="mb-4 block w-full rounded-md border border-gray-300 p-2 text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-white hover:file:bg-indigo-700"
          />
          <input
            type="file"
            name="featureImg2"
            onChange={(e: any) => setFeatureImg2(e.target.files[0])}
            className="block w-full rounded-md border border-gray-300 p-2 text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-white hover:file:bg-indigo-700"
          />
        </div>

        <BlogPostContent setPostContent={setPostContent} />
        {postContent.map((content: any, index: number) => (
          <div key={index} className="mt-5 rounded-2xl bg-gray-700 px-6 py-3">
            <h3 className="font-semibold text-white">{content.title}</h3>
            <p className="text-gray-300">{content.description}</p>
          </div>
        ))}

        <Button
          type="submit"
          className="mt-4 w-full rounded-md bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-700"
        >
          Post Blog
        </Button>
      </form>
    </div>
  );
};

export default Post;
