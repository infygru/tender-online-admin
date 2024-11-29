"use client";
import React, { useState, useCallback, useMemo } from "react";
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
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface ParsedData {
  [key: string]: string | number | boolean | Date | null;
}

const ROWS_PER_PAGE = 50; // Show only 50 rows at a time

const App: React.FC = () => {
  const [data, setData] = useState<ParsedData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);

  const router = useRouter();
  const visibleRows = useMemo(() => {
    const start = currentPage * ROWS_PER_PAGE;
    return data.slice(start, start + ROWS_PER_PAGE);
  }, [data, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(data.length / ROWS_PER_PAGE);
  }, [data]);

  const headers = useMemo(() => {
    return data.length > 0 ? Object.keys(data[0]) : [];
  }, [data]);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  }, [totalPages]);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  }, []);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      const loadingToast = toast({
        title: "Processing File",
        description: "Please wait while we process your file...",
        duration: Infinity,
      });

      // Use a Web Worker for parsing large files
      const worker = new Worker(
        URL.createObjectURL(
          new Blob(
            [
              `
              importScripts('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');
              onmessage = function(e) {
                const binaryString = e.data;
                const workbook = XLSX.read(binaryString, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                
                // More granular progress tracking
                const rawData = XLSX.utils.sheet_to_json(sheet, {
                  defval: '',
                  cellDates: true,
                  raw: false
                });
                
                // Break processing into stages for more granular progress
                const stages = [
                  { name: 'Parsing Metadata', progress: 30 },
                  { name: 'Formatting Data', progress: 70 },
                  { name: 'Finalizing', progress: 90 }
                ];
      
                // Simulate stage-based progress
                stages.forEach(stage => {
                  self.postMessage({ 
                    type: 'progress', 
                    progress: stage.progress, 
                    message: stage.name 
                  });
                  
                  // Simulate some processing time
                  const start = Date.now();
                  while (Date.now() - start < 300) {}
                });
                
                const parsedData = rawData.map(item => {
                  const parsedItem = {};
                  Object.keys(item).forEach(key => {
                    const formattedKey = key.replace(/\\s/g, '');
                    const value = item[key];
                    parsedItem[formattedKey] = value != null ? String(value) : '';
                  });
                  return parsedItem;
                });
                
                // Final progress and data
                postMessage({ 
                  type: 'data', 
                  data: parsedData,
                  progress: 100,
                  message: 'Complete' 
                });
              }
            `,
            ],
            { type: "application/javascript" },
          ),
        ),
      );

      worker.onmessage = (e) => {
        if (e.data.type === "progress") {
          setProcessingProgress(e.data.progress);
          setUploadMessage(e.data.message);
        } else if (e.data.type === "data") {
          setData(e.data.data);
          setProcessingProgress(100);
          setUploadMessage("Processing Complete");

          toast({
            title: "File Uploaded",
            variant: "default",
            description: `Loaded ${e.data.data.length} rows of data`,
          });
          worker.terminate();
        }
      };

      worker.onerror = (error) => {
        console.error("Worker error:", error);
        loadingToast.dismiss();
        setIsUploading(false);
        setProcessingProgress(0);
        toast({
          title: "Upload Error",
          variant: "destructive",
          description: "Failed to upload and parse the file.",
        });
        worker.terminate();
      };

      const reader = new FileReader();
      reader.onload = (event) => {
        worker.postMessage(event.target?.result);
      };
      reader.readAsBinaryString(file);
    },
    [],
  );

  const handleSaveData = useCallback(async () => {
    setIsLoading(true);
    setUploadProgress(0);
    const chunkSize = 100;
    let allDataUploaded = true;

    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);

      try {
        const response = await axios.post(
          "http://localhost:8080/api/tender/upload/bulk",
          chunk,
        );

        const percentage = Math.round(((i + chunk.length) / data.length) * 100);
        setUploadProgress(percentage);
        setUploadMessage(`Uploading... ${percentage}%`);

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
        break;
      }
    }

    setIsLoading(false);

    if (allDataUploaded) {
      toast({
        title: "Data Saved",
        variant: "default",
        description: "All data saved successfully.",
      });
      setUploadMessage("Upload complete!");
      router.push("/dashboard/tender");
    } else {
      setUploadMessage("Upload failed.");
    }
  }, [data, router]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const element = e.currentTarget;
      if (
        element.scrollHeight - element.scrollTop === element.clientHeight &&
        (currentPage + 1) * ROWS_PER_PAGE < data.length
      ) {
        setCurrentPage((prev) => prev + 1);
      }
    },
    [currentPage, data.length],
  );

  return (
    <div className="container mx-auto my-4 overflow-hidden">
      <ScrollArea>
        <div>
          <h1 className="mb-4 text-2xl font-bold">Upload Excel File</h1>
          <label className="block">
            <input
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              onChange={handleFileUpload}
            />
            <div className="flex cursor-pointer items-center justify-center rounded-full border border-gray-700 px-6 py-4 text-sm shadow-md transition-all hover:bg-black hover:text-white">
              {!data.length && isUploading ? (
                <div className="mr-2 flex items-center justify-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-l-2 border-black" />
                </div>
              ) : (
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
              )}
              {!data.length && isUploading
                ? "Processing file..."
                : "Upload a xlsx file or google excel sheet"}
            </div>
          </label>

          <ScrollArea
            className="mt-4 h-[58vh] min-h-fit"
            onScroll={handleScroll}
          >
            {!data.length && isUploading && (
              <div>
                <Progress value={processingProgress} className="h-2" />
                <p className="mt-2 text-sm text-gray-600">
                  Processing: {processingProgress}%
                </p>
              </div>
            )}
            {data.length > 0 && (
              <div className="relative w-[80vw] overflow-auto rounded-3xl border">
                {isLoading && (
                  <div className="absolute left-0 right-0 top-[30vh] z-10 flex flex-col items-center justify-center bg-white/80">
                    <div className="w-1/2 px-4">
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {uploadMessage}
                    </p>
                  </div>
                )}
                <ScrollArea
                  className={`h-[58vh] min-h-fit overflow-hidden`}
                  onScroll={handleScroll}
                  style={{
                    pointerEvents: isLoading ? "none" : "auto",
                    userSelect: isLoading ? "none" : "auto",
                    opacity: isLoading ? 0.3 : 1,
                  }}
                >
                  <Table className="w-max rounded-3xl border">
                    <TableCaption>
                      Showing {visibleRows.length} of {data.length} rows
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        {headers.map((key) => (
                          <TableHead key={key} className="border px-4 py-2">
                            {key}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visibleRows.map((row: ParsedData, rowIndex: number) => (
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
                </ScrollArea>
              </div>
            )}{" "}
          </ScrollArea>

          {/* Pagination Controls */}
          {data.length > ROWS_PER_PAGE && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  onClick={() => setCurrentPage(0)}
                  disabled={currentPage === 0}
                >
                  First
                </Button>
                <Button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                >
                  Previous
                </Button>
              </div>
              <span className="text-sm">
                Page {currentPage + 1} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages - 1}
                >
                  Next
                </Button>
                <Button
                  onClick={() => setCurrentPage(totalPages - 1)}
                  disabled={currentPage === totalPages - 1}
                >
                  Last
                </Button>
              </div>
            </div>
          )}
          {data.length > 0 && (
            <Button
              className="mt-2"
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
