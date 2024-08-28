"use client";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
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

interface ParsedData {
  [key: string]: string | number | boolean | Date | null;
}

const App: React.FC = () => {
  const [data, setData] = useState<ParsedData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsBinaryString(file);

      reader.onload = (event) => {
        try {
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

              if (typeof value === "string" && !isNaN(Date.parse(value))) {
                value = new Date(value);
              } else if (!isNaN(Number(value))) {
                value = Number(value);
              } else if (value === "TRUE" || value === "FALSE") {
                value = value === "TRUE";
              }

              parsedItem[formattedKey] = value;
            });
            return parsedItem;
          });

          setData(parsedData);
          toast({
            title: "File Uploaded",
            variant: "default",
            description: "File uploaded and parsed successfully.",
          });
        } catch (error) {
          console.error("Error reading file:", error);
          toast({
            title: "Upload Error",
            variant: "destructive",
            description: "Failed to upload and parse the file.",
          });
        }
      };
    }
  };

  const handleSaveData = async () => {
    setIsLoading(true);
    const chunkSize = 100; // Adjust the chunk size based on your needs
    let allDataUploaded = true;

    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);

      try {
        const response = await axios.post(
          "http://localhost:3000/api/tender/upload/bulk",
          chunk,
        );

        if (response.status !== 201) {
          allDataUploaded = false;
          throw new Error(`Unexpected response status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error saving data:", error);
        allDataUploaded = false;
        toast({
          title: "Save Error",
          variant: "destructive",
          description: "Failed to save data. Please try again.",
        });
        break; // Stop further uploads if an error occurs
      }
    }

    setIsLoading(false);

    if (allDataUploaded) {
      toast({
        title: "Data Saved",
        variant: "default",
        description: "All data saved successfully.",
      });
      router.push("/dashboard/tender");
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
            <div className="flex cursor-pointer items-center justify-center rounded-full border border-gray-700 px-6 py-4 text-sm shadow-md">
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
                <Table className="w-max rounded-3xl border">
                  <TableCaption>A list of your recent invoices.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(data[0]).map((key) => (
                        <TableHead key={key} className="border px-4 py-2">
                          {key}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((row: ParsedData, rowIndex: number) => (
                      <TableRow key={rowIndex}>
                        {Object.values(row).map(
                          (value: any, cellIndex: number) => (
                            <TableCell
                              key={cellIndex}
                              className="border px-6 py-3"
                            >
                              {value instanceof Date
                                ? value.toISOString()
                                : value?.toString()}
                            </TableCell>
                          ),
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </ScrollArea>
          {data.length > 0 && (
            <Button
              className="mt-4"
              onClick={handleSaveData}
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Save Data"}
            </Button>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default App;
