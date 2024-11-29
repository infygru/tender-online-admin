"use client";
import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/employee-tables/columns";
import EmployeeTable from "@/components/tables/employee-tables/employee-table";

import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useQuery } from "react-query";
import { useState } from "react";

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
    refetch,
  } = useQuery(["tender", { page, limit: pageLimit, country }], () =>
    fetch("http://localhost:8080/api/tender/all").then((res) => res.json()),
  );

  const [isDataDeleted, setIsDataDeleted] = useState(false);

  const handletodelete = async () => {
    if (tender?.result.length === 0)
      return toast({
        title: "No Data to Delete",
      });
    try {
      const response = await fetch("http://localhost:8080/api/tender/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        refetch();
        setIsDataDeleted(true);
        toast({
          title: "Data Deleted",
          description: "All data has been deleted",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  const totalUsers = tender?.result?.length || 0;

  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Total Tender (${totalUsers})`} description="" />

          <Link
            href={"/dashboard/tender/new"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>

          <button
            onClick={handletodelete}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Delete all data
          </button>
        </div>
        <Separator />

        {!isDataDeleted && totalUsers > 0 ? (
          <ScrollArea className="h-[68vh]">
            <EmployeeTable
              searchKey="country"
              pageNo={page}
              columns={columns}
              totalUsers={totalUsers}
              data={tender?.result}
              pageCount={totalUsers / pageLimit}
            />
          </ScrollArea>
        ) : (
          <div className="mt-8 text-center text-gray-500">
            No tenders available. Add a new tender or restore data.
          </div>
        )}
      </div>
    </>
  );
}
