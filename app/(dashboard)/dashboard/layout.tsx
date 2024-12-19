"use client";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Header />
        <div className="flex h-screen overflow-y-scroll">
          <Sidebar />
          <main className="ml-auto w-full max-w-[85%] pt-16">{children}</main>
        </div>
      </QueryClientProvider>
    </>
  );
}
