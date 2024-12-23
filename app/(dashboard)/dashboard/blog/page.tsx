"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const Page = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_ENPOINT + "/api/blog",
        );
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_ENPOINT + `/api/blog/${id}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) toast({ title: "Blog Deleted Successfully" });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      window.location.reload();
      const data = await response.json();
      console.log(data);
    } catch (error: any) {
      console.error("Error deleting blog:", error.message);
    }
  };

  return (
    <div className="px-8 py-4">
      <div className="flex w-full items-center justify-between">
        <div className="">
          <div className="text-2xl font-bold">Blog</div>
          <div className="text-gray-500">Add, Edit and Delete Blogs</div>
        </div>
        <div className="">
          <Link href={"/dashboard/blog/create"}>
            {" "}
            <Button variant={"default"}>Add Blog</Button>
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-bloc mb-4 font-bold text-black">List of Blogs</h2>
        <ScrollArea className="h-[480px]">
          <ul>
            {blogs.map((blog: any) => (
              <li key={blog.id}>
                <Link
                  href={`/dashboard/blog/${blog?._id}`}
                  className="mt-5 flex w-full items-center justify-between rounded-2xl bg-accent px-4 py-2 text-lg font-semibold"
                >
                  <div className="">{blog?.title}</div>
                  <button
                    onClick={() => handleDelete(blog?._id)}
                    className="relative z-50"
                  >
                    <Trash2 />
                  </button>
                </Link>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Page;
