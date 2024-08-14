"use client";
import BreadCrumb from "@/components/breadcrumb";
import { UserClient } from "@/components/tables/user-tables/client";
import { useQuery } from "react-query";

const breadcrumbItems = [{ title: "User", link: "/dashboard/user" }];
export default function Page() {
  const { data: users, isLoading } = useQuery("users", async () => {
    const res = await fetch(
      "https://tender-online-h4lh.vercel.app/api/auth/get/account",
    );
    return res.json();
  });
  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <UserClient data={users} />
      </div>
    </>
  );
}
