"use client";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios"; // Import axios for HTTP requests
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
function App() {
  const [data, setData] = useState<any>([]);
  console.log(data, "data");

  const router = useRouter();

  type ParsedData = { [key: string]: string | number | Date | boolean };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsBinaryString(file);

      reader.onload = (event) => {
        const binaryString = event.target?.result as string;
        const workbook = XLSX.read(binaryString, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json<ParsedData>(sheet);

        const parsedData = rawData.map((item) => {
          const parsedItem: ParsedData = {};
          Object.keys(item).forEach((key) => {
            const formattedKey = key.replace(/\s/g, "");
            let value = item[key];

            // Handle date parsing
            if (typeof value === "string" && !isNaN(Date.parse(value))) {
              value = new Date(value);
            }

            parsedItem[formattedKey] = value;
          });
          return parsedItem;
        });

        setData(parsedData);
      };
    }
  };

  const handleSaveData = async () => {
    try {
      // Make a POST request to your API endpoint with the data
      const response = await axios.post(
        "http://localhost:3000/api/tender/upload/bulk",
        data,
      );
      if (response.status === 201) {
        toast({
          title: "Data saved successfully",
          variant: "default",
          description: "Data saved successfully.",
        });
        router.push("/dashboard/tender");
      }

      console.log("Data saved successfully:", response.data);
      // You can add further logic here, such as showing a success message
    } catch (error) {
      console.error("Error saving data:", error);
      // Handle error, show error message to the user, etc.
    }
  };

  return (
    <div className="container mx-auto my-8 overflow-hidden">
      <ScrollArea className="h-[85vh] min-h-fit">
        <div className="">
          <h1 className="mb-4 text-2xl font-bold">Upload Excel File</h1>
          <label className="block">
            <input
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              onChange={handleFileUpload}
            />
            <div className="flex cursor-pointer items-center justify-center rounded-full border border-gray-700  px-6 py-4 text-sm shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Upload a xlsx file or google excel sheet
            </div>
          </label>
          <ScrollArea className="h-[65vh] min-h-fit">
            {data.length > 0 && (
              <div className="mt-12 w-[80vw] overflow-x-scroll rounded-3xl border">
                <Table className="w-max rounded-3xl border  ">
                  <TableCaption>A list of your recent invoices.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      {Object?.keys(data[0]).map((key) => (
                        <TableHead key={key} className="border px-4  py-2">
                          {key}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((row: any, index: any) => (
                      <TableRow key={index} className="">
                        {Object.values(row).map((value: any, index) => (
                          <TableCell key={index} className="border  px-6 py-3">
                            {value}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </ScrollArea>
          {data.length > 0 && (
            <Button className="mt-4 " onClick={handleSaveData}>
              Save Data
            </Button>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default App;
