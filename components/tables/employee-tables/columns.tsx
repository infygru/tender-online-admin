"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Employee } from "@/constants/data";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<Employee>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  // {
  //   accessorKey: "epublishedDate",
  //   header: "e-Published Date",
  // },
  {
    accessorKey: "openingDate",
    header: "Opening Date",
  },
  {
    accessorKey: "closeingDate",
    header: "Closing Date",
  },
  {
    accessorKey: "refNo",
    header: "Ref.No",
  },
  {
    accessorKey: "TenderId",
    header: "Tender ID",
  },
  // {
  //   accessorKey: "organizationChain",
  //   header: " Organisation Chain",
  // },
  // {
  //   accessorKey: "AraeSpecification1",
  //   header: "Area Specificity 1",
  // },
  // {
  //   accessorKey: "AraeSpecification2",
  //   header: "Area Specificity 2",
  // },
  // {
  //   accessorKey: "AraeSpecification3",
  //   header: "Area Specificity 3",
  // },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
