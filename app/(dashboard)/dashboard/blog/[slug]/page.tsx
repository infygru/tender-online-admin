"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Page({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<any>(null);
  const [featureImg1, setFeatureImg1] = useState<any | null>(null);
  const [featureImg2, setFeatureImg2] = useState<any | null>(null);
  console.log(featureImg1, "featureImg1");

  const handleImageUpload = async (file: any | null, fieldName: string) => {
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

        console.log(`Image uploaded successfully for ${fieldName}`);
        // You can handle the response accordingly, e.g., store the image URL in state or perform other actions
      } catch (error) {
        console.error(`Error uploading image for ${fieldName}:`, error);
      }
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_API_ENPOINT + `/api/blog/${params.slug}`,
        );
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [params.slug]);

  const handleSubmit = async () => {
    const formData: any = new FormData();
    formData.append("img", featureImg1); // Rename the file field to 'img'

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_ENPOINT + `/api/blog/${params.slug}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent: any) => {
            const percentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            // setLoading(true);
            // const input = window.prompt(`Upload Progress: ${percentage}% `);
            // console.log(`User's Name: ${input}`);
            // Update your state with the percentage, or use it as needed
          },
        },
      );

      if (response?.status === 200 && response?.data.status === 201) {
        // setLoading(false);
        // toast.success("Images has been added successfully");
        // refetchData();
      } else {
        // setLoading(false);
        // refetchData();/
        // toast.error(
        //   "Room has not been created. Please try again now or later.",
        // );
      }
    } catch (error: any) {
      //   setLoading(false);
      //   refetchData();
      //   toast.error("Room has not been created. Please try again now or later.");
      //   console.error("Error adding room:", error.response.data);
    }
  };

  return (
    <div className="px-8 py-4">
      {post ? (
        <div>
          <h1 className="mb-6 text-3xl font-semibold">Blog</h1>
          <h1 className="text-2xl font-bold">Title: {post.title}</h1>
          <div className="">
            <label>
              Feature Image 1 URL:
              <input
                type="file"
                name="featureImg1"
                onChange={(e: any) => {
                  setFeatureImg1(e.target.files[0]);
                  setTimeout(() => {
                    handleSubmit();
                  }, 1000);
                }}
              />
            </label>
            <br />
            <label>
              Feature Image 2 URL:
              <input
                type="file"
                name="featureImg2"
                onChange={(e: any) => {
                  setFeatureImg2(e.target.files[0]);
                }}
              />
            </label>
            <br />
            <button>Submit</button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
