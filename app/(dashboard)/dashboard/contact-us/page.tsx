"use client";
import BreadCrumb from "@/components/breadcrumb";
import Documents from "@/components/tables/documents";
import UserList from "@/components/tables/user-list";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
    fetch(`https://tender-online.vercel.app/api/tender/contact`).then((res) =>
      res.json(),
    ),
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;
  const totalUsers = tender?.contacts?.length;

  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />

        <ScrollArea className="h-[80vh]">
          <Separator />
          <div className="">
            <UserList data={tender} />
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
