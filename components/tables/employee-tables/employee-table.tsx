"use client";
import React, { useEffect, useState } from "react";
import { DataTableTender } from "@/components/table/tender-table";

export default function EmployeeTable({ searchKey }: any) {
  return (
    <main className="w-full">
      <DataTableTender />
    </main>
  );
}
