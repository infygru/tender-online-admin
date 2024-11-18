"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";

import { ArrowUpDown, CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "../ui/scroll-area";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
export const formatDate = (isoDateString: string): string => {
  const date = new Date(isoDateString);

  const year = date.getFullYear().toString().slice(-2); // Get the last two digits of the year
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
  const month = monthNames[date.getMonth()]; // Get the month abbreviation
  const day = date.getDate().toString().padStart(2, "0"); // Ensure day is two digits

  // Extract and format time in 12-hour format
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Ensure minutes are two digits
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert to 12-hour format, with 12 being the fallback for 0

  return `${day}/${month}/${year} ${hours
    .toString()
    .padStart(2, "0")}:${minutes} ${ampm}`;
};

// Define the type for the tender data
export type Tender = {
  _id: string;
  tenderName: string;
  epublishedDate: string;
  bidSubmissionDate: string;
  bidOpeningDate: string;
  district?: string;
  department: string;
  classification?: any;
  active: boolean;
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

  // Remove commas from the input string and convert to a number
  const numAmount = Number(String(amount).replace(/,/g, ""));
  if (Number.isNaN(numAmount)) {
    return "Refer the document";
  }

  // Helper to format the number as per Indian units
  const formatWithUnits = (value: number): string => {
    if (value >= 1e7) {
      // 1 Crore and above
      const crore = value / 1e7;
      return `${crore.toFixed(2).replace(/\.00$/, "")} Crore`;
    } else if (value >= 1e5) {
      // 1 Lakh and above
      const lakh = value / 1e5;
      return `${lakh.toFixed(2).replace(/\.00$/, "")} Lakh`;
    }
    return value.toLocaleString("en-IN"); // Below 1 Lakh, use the standard comma format
  };

  return `₹${formatWithUnits(numAmount)}`;
}

export const columns: ColumnDef<Tender>[] = [
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
      `${row.department} - ${row.tenderName} - ${row.classification}`, // Combine two fields
    header: "Tender Information",
    cell: ({ row }) => {
      const department = row.original.department; // Access the original row's department
      const tenderName = row.original.tenderName; // Access the original row's tenderName
      const classification = row.original.classification; // Access classification

      return (
        <div className="flex min-w-60 items-center gap-3">
          <div className="flex flex-col">
            {/* Display department name */}
            {/* <span className="font-bold text-gray-900" title="Department">
              {department}
            </span> */}

            {/* Display tender title */}
            <span
              className="line-clamp-3 text-xs font-normal text-gray-500"
              title="Tender Title"
            >
              {tenderName}
            </span>
          </div>

          {/* Display classification */}
          <span
            className="flex w-max items-center gap-1 rounded-full border bg-[#ECFDF3] px-2 text-[9px] font-bold text-[#027A48]"
            title="Classification"
          >
            <div className="h-1 w-1 rounded-full bg-green-500" />
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
      <div className="w-32 text-center text-xs" title="Published Date">
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
      <div className="w-32 text-center text-xs" title="Bid Submission Date">
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
      <div className="w-32 text-center text-xs" title="Bid Opening Date">
        {formatDate(row.getValue("bidOpeningDate"))}
      </div>
    ),
  },
  {
    accessorKey: "refNo",
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-xs text-gray-500"
        variant="ghost"
        title="Reference No"
      >
        Reference No
      </Button>
    ),
    cell: ({ row }) => (
      <div className="line-clamp-2 text-center text-xs" title="Reference No">
        {row.getValue("refNo")}
      </div>
    ),
  },
  {
    accessorKey: "tenderValue",
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-center text-xs text-gray-500"
        variant="ghost"
        title="Tender Value (₹)"
      >
        Tender Value (₹)
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div title="Tender Value (₹)">
        {/* {row.getValue("tenderValue")} */}
        {formatIndianRupeePrice(row.getValue("tenderValue"))}
      </div>
    ),
  },
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="mr-4 rounded"
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
        className="mr-2 rounded"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        title="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
const fetchTenders = async (queryParams: URLSearchParams): Promise<any> => {
  const response = await fetch(
    `http://localhost:8080/api/tender/all?${queryParams.toString()}`,
  );
  if (!response.ok) {
    toast.error("Failed to fetch tenders");
  }
  return response.json();
};

export function DataTableTender({ setSearch, search }: any) {
  const [foryou, setForYou] = React.useState<any | null>(null);
  const [searchList, setSearchList] = React.useState<string[]>([]);

  React.useEffect(() => {
    // Check if window is defined (client-side only)
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const foryouValue = params.get("foryou");
      setForYou(foryouValue);
      console.log(foryouValue, "foryou");
    }
  }, []);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const TenderValue = [
    { value: "1", label: "Less than ₹10L", minValue: 0, maxValue: 1000000 },
    {
      value: "2",
      label: "₹10L - ₹1Cr",
      minValue: 1000000,
      maxValue: 10000000,
    },
    {
      value: "3",
      label: "₹1Cr - ₹100Cr",
      minValue: 10000000,
      maxValue: 1000000000,
    },
    { value: "4", label: "More than ₹100Cr", minValue: 1000000000 },
  ];

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  console.log(rowSelection, "rowSelection");
  const isAnyRowSelected = Object.values(rowSelection).some(
    (selected) => selected,
  );
  const [district, setDistrict] = React.useState<string>("");
  const [tenderValue, setTenderValue] = React.useState<string>("");
  const [department, setDepartment] = React.useState<string>("");
  const [selectedRowData, setSelectedRowData] = React.useState<Tender | null>(
    null,
  );
  const [industry, setIndustry] = React.useState<any>("");
  const [subIndustry, setSubIndustry] = React.useState<any>("");
  const [classification, setClassification] = React.useState<any>("");
  const [selectedDistricts, setSelectedDistricts] = React.useState<any>([]);
  const [selectedDepartments, setSelectedDepartments] = React.useState<any>([]);
  const [selectedStatus, setSelectedStatus] = React.useState<any>([]);
  const [selectedTenderValues, setSelectedTenderValues] = React.useState<any>(
    [],
  );
  const [filterIndustry, setFilterIndustry] = React.useState<any>([]);
  const [filterSubIndustry, setFilterSubIndustry] = React.useState<any>([]);

  const [status, setStatus] = React.useState<string>("");
  const [endDate, setEndDate] = React.useState<any | null>(null);

  const [dateRange, setDateRange] = React.useState<DateRange | null>(null);
  const [tenders, setTenders] = React.useState<any | null>(null);
  const fetchTenders = async () => {
    const response = await axios.get("http://localhost:8080/api/tender/all");
    setTenders(response.data);
    return response.data;
  };

  React.useEffect(() => {
    fetchTenders();
  }, []);
  // const {
  //   data: tenders,
  //   isLoading,
  //   refetch,
  // } = useQuery({
  //   queryKey: ["tenders"],
  //   queryFn: async () => {
  //     const queryParams = new URLSearchParams();

  //     // Helper to append multi-select values dynamically
  //     const appendMultiSelect = (key: string, values: any[]) => {
  //       if (values.length) {
  //         const isObjectWithValue =
  //           values[0] && typeof values[0] === "object" && "value" in values[0];

  //         const valueString = isObjectWithValue
  //           ? values.map((item) => item.value).join(",")
  //           : values.join(",");

  //         queryParams.append(key, valueString);
  //       }
  //     };

  //     appendMultiSelect("district", selectedDistricts);
  //     appendMultiSelect("department", selectedDepartments);
  //     appendMultiSelect("tenderValue", selectedTenderValues);
  //     appendMultiSelect("status", selectedStatus);
  //     appendMultiSelect("industry", industry);
  //     appendMultiSelect("subIndustry", subIndustry);
  //     appendMultiSelect(
  //       "classification",
  //       classification ? [classification] : [],
  //     );

  //     // Append global search
  //     if (searchList) {
  //       queryParams.append("search", searchList.join(","));
  //     }

  //     // Append date range filter
  //     if (dateRange && dateRange.startDate && dateRange.endDate) {
  //       queryParams.append("startDate", dateRange.startDate.toISOString());
  //       queryParams.append("endDate", dateRange.endDate.toISOString());
  //     }

  //     return fetchTenders(queryParams);
  //   },
  // });
  const [user, setUser] = React.useState<any | null>(null);

  // Function to get the auth token from sessionStorage
  const getaccessToken = () => sessionStorage.getItem("accessToken");

  // Fetch user details dynamically
  const fetchUserDetails = async (
    url: string = "http://localhost:8080/api/auth/me",
  ): Promise<any | null> => {
    try {
      const token = getaccessToken();
      if (!token) throw new Error("No auth token found");

      const response = await axios.get<any>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data); // Store user details in state
      return response.data; // Return the fetched user data
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null; // Return null if an error occurs
    }
  };

  const [selectedRow, setSelectedRow] = React.useState<any>([]);

  const data = tenders?.result;

  const router = useRouter();
  const pathName = usePathname();

  React.useEffect(() => {
    fetchTenders();
  }, [district, tenderValue, department, status, user]);

  const table = useReactTable({
    data: data || [],
    columns: columns || [],
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (!tenders) {
    return <div className="">Loading....</div>;
  }

  return (
    <div className="w-full rounded-xl border">
      <div className="">
        <ScrollArea className="">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table?.getRowModel().rows?.length ? (
                table?.getRowModel().rows.map((row) => {
                  const bidSubmissionDate = new Date(
                    row.original.bidSubmissionDate,
                  ); // Assuming bidSubmissionDate exists in row.original
                  const isPastDate = false;

                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={
                        isPastDate ? "cursor-not-allowed bg-gray-100" : ""
                      }
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          className={`cursor-pointer ${
                            isPastDate && "opacity-50"
                          }`} // Make past rows appear dimmer
                          key={cell.id}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      <div className="flex items-center justify-end space-x-2 px-4 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getRowModel().rows.length} row(s) selected.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
