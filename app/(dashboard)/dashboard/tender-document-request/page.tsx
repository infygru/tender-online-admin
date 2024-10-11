"use client";
import BreadCrumb from "@/components/breadcrumb";
import Documents from "@/components/tables/documents";
import { columns } from "@/components/tables/employee-tables/columns";
import { EmployeeTable } from "@/components/tables/employee-tables/employee-table";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Employee } from "@/constants/data";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useQuery } from "react-query";

const breadcrumbItems = [
  {
    title: "Tender Documents Request",
    link: "/dashboard/tender-document-request",
  },
];

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
    fetch(`http://localhost:8080/api/tender/tender-mapping`).then((res) =>
      res.json(),
    ),
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;
  const totalUsers = tender?.mappings?.length;

  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />

        <ScrollArea className="h-[80vh]">
          <div className="flex items-start justify-between space-x-4">
            <Heading
              title={`Tender Documents Request (${totalUsers})`}
              description="List of all tender documents request"
            />
          </div>
          <Separator />
          <div className="">
            <Documents data={tender?.mappings} />
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
