"use client";

import { useRouter } from "next/router";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// Your format functions (unchanged)
export const formatDate = (isoDateString: string): string => {
  const date = new Date(isoDateString);
  const year = date.getFullYear().toString().slice(-2);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const day = date.getDate().toString().padStart(2, "0");
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${day}/${month}/${year} ${hours
    .toString()
    .padStart(2, "0")}:${minutes} ${ampm}`;
};

export function formatIndianRupeePrice(amount: any): string {
  if (
    amount === undefined ||
    amount === null ||
    amount === 0 ||
    Number.isNaN(amount)
  ) {
    return "Refer the document";
  }

  const numAmount = Number(String(amount).replace(/,/g, ""));
  if (Number.isNaN(numAmount)) {
    return "Refer the document";
  }

  const formatWithUnits = (value: number): string => {
    if (value >= 1e7) {
      const crore = value / 1e7;
      return `${crore.toFixed(2).replace(/\.00$/, "")} Crore`;
    } else if (value >= 1e5) {
      const lakh = value / 1e5;
      return `${lakh.toFixed(2).replace(/\.00$/, "")} Lakh`;
    }
    return value.toLocaleString("en-IN");
  };

  return `₹${formatWithUnits(numAmount)}`;
}

export default function TenderColumns() {
  // const router = useRouter();
  // const isForYou = router.query.foryou === "true"; // Check if the query parameter is present

  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="rounded"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          title="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="rounded"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          title="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorFn: (row) =>
        `${row.department} - ${row.tenderName} - ${row.classification}`,
      header: "Tender Information",
      cell: ({ row }) => {
        const department = row.original.department;
        const tenderName = row.original.tenderName;
        const classification = row.original.classification;

        return (
          <div className="flex items-center justify-between min-w-60 gap-3">
            <div className="flex flex-col">
              <span className="font-bold text-gray-900" title="Department">
                {/* {department} */}
              </span>
              <span
                className="text-xs line-clamp-2 whitespace-break-spaces font-bold text-gray-900"
                title="Tender Title"
              >
                {tenderName}
              </span>
            </div>

            <span
              className="bg-[#ECFDF3] text-[#027A48] gap-1 border rounded-full flex items-center w-max px-2 text-[9px] font-bold whitespace-nowrap"
              title="Classification"
            >
              <div className="bg-green-500 rounded-full w-1 h-1" />
              {classification}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "epublishedDate",
      header: ({ column }) => (
        <Button
          className="text-xs text-gray-500"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          title="Sort by Published Date"
        >
          Published Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-xs text-center w-32" title="Published Date">
          {formatDate(row.getValue("epublishedDate"))}
        </div>
      ),
    },
    {
      accessorKey: "bidSubmissionDate",
      header: ({ column }) => (
        <Button
          className="text-xs text-gray-500"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          title="Sort by Bid Submission Date"
        >
          Bid Submission Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-xs text-center w-32" title="Bid Submission Date">
          {formatDate(row.getValue("bidSubmissionDate"))}
        </div>
      ),
    },
    {
      accessorKey: "bidOpeningDate",
      header: ({ column }) => (
        <Button
          className="text-xs text-gray-500"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          title="Sort by Bid Opening Date"
        >
          Bid Opening Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-xs text-center w-32" title="Bid Opening Date">
          {formatDate(row.getValue("bidOpeningDate"))}
        </div>
      ),
    },
    {
      accessorKey: "refNo",
      header: ({ column }) => (
        <div className="text-xs text-gray-500 ml-3" title="Reference No">
          Reference No
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-xs line-clamp-2 text-center" title="Reference No">
          {row.getValue("refNo")}
        </div>
      ),
    },
    {
      accessorKey: "tenderValue",
      header: ({ column }) => (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-xs text-center text-gray-500"
          variant="ghost"
          title="Tender Value (₹)"
        >
          Tender Value (₹)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div title="Tender Value (₹)">
          {formatIndianRupeePrice(row.getValue("tenderValue"))}
        </div>
      ),
      sortingFn: (rowA, rowB, columnId) => {
        const valueA = Number(
          String(rowA.getValue(columnId)).replace(/,/g, "")
        );
        const valueB = Number(
          String(rowB.getValue(columnId)).replace(/,/g, "")
        );

        return valueA - valueB;
      },
    },
  ];

  return columns;
}
