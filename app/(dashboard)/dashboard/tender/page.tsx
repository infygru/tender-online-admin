"use client";
import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/employee-tables/columns";
import { EmployeeTable } from "@/components/tables/employee-tables/employee-table";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Employee } from "@/constants/data";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useQuery } from "react-query";

const breadcrumbItems = [{ title: "Tender", link: "/dashboard/tender" }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default function Page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const country = searchParams.search || null;
  const offset = (page - 1) * pageLimit;

  const {
    data: tender,
    isLoading,
    error,
  } = useQuery(["tender", { page, limit: pageLimit, country }], () =>
    fetch(`https://tender-online-h4lh.vercel.app/api/tender/all`).then((res) =>
      res.json(),
    ),
  );
  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error fetching data</div>;
  const totalUsers = tender?.result?.length;

  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Tender (${totalUsers})`}
            description="Manage tender (Server side table functionalities.)"
          />

          <Link
            href={"/dashboard/tender/new"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />

        {/* <EmployeeTable
          searchKey="country"
          pageNo={page}
          columns={columns}
          totalUsers={totalUsers}
          data={tender?.result}
          pageCount={totalUsers / pageLimit}
        /> */}
      </div>
    </>
  );
}
