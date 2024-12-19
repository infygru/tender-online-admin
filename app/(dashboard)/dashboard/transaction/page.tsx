"use client";

import React from "react";
import { useQuery } from "react-query";

interface User {
  _id: string;
  name: string;
  phone: string;
  email: string;
  profile_image: string;
  companyName: string;
  city: string;
  state: string[];
  subscriptionValidity: string;
}

interface Transaction {
  _id: string;
  userId: User;
  amount_received: number;
  price: number;
  payment_method: string;
  transaction_status: string;
  discount_applied: { $numberDecimal: string };
  tax_amount: { $numberDecimal: string };
  total_amount_paid: { $numberDecimal: string };
  payment_date: string;
  createdAt: string;
  updatedAt: string;
}

const TransactionPage: React.FC = () => {
  const { data, isLoading, error } = useQuery<Transaction[]>({
    queryKey: ["transaction"],
    queryFn: () =>
      fetch(
        process.env.NEXT_PUBLIC_API_ENPOINT + "/api/auth/payment/transcation",
      ).then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      }),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="animate-pulse text-xl font-semibold text-blue-600">
          Loading transactions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-red-50">
        <div className="font-semibold text-red-500">
          Something went wrong: {(error as Error).message}
        </div>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-600">
          No transactions found
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4">
      <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
        Transaction History
      </h1>
      <div className="container mx-auto">
        {data?.map((transaction) => (
          <div
            key={transaction._id}
            className="mb-6 rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
          >
            {/* User Details Section */}
            <div className="mb-4 flex items-center">
              <img
                src={transaction.userId?.profile_image}
                alt={`${transaction.userId?.name}'s profile`}
                className="h-16 w-16 rounded-full border"
              />
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {transaction.userId?.name}
                </h2>
                <p className="text-sm text-gray-600">
                  {transaction.userId?.companyName} | {transaction.userId?.city}
                  , {transaction.userId?.state.join(", ")}
                </p>
                <p className="text-sm text-gray-500">
                  Subscription valid till:{" "}
                  {new Date(
                    transaction.userId?.subscriptionValidity,
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Transaction Details Section */}
            <div className="mb-4 grid grid-cols-2 gap-4 text-gray-700 sm:grid-cols-4">
              <div>
                <p className="font-semibold">Transaction ID</p>
                <p className="truncate">{transaction._id}</p>
              </div>
              <div>
                <p className="font-semibold">Amount Received</p>
                <p>₹{transaction.amount_received}</p>
              </div>
              <div>
                <p className="font-semibold">Price</p>
                <p>₹{transaction.price}</p>
              </div>
              <div>
                <p className="font-semibold">Payment Method</p>
                <p>{transaction.payment_method}</p>
              </div>
              <div>
                <p className="font-semibold">Transaction Status</p>
                <p
                  className={`font-bold ${
                    transaction.transaction_status === "Completed"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.transaction_status}
                </p>
              </div>
              <div>
                <p className="font-semibold">Discount Applied</p>
                <p>
                  ₹{parseFloat(transaction.discount_applied.$numberDecimal)}
                </p>
              </div>
              <div>
                <p className="font-semibold">Tax Amount</p>
                <p>₹{parseFloat(transaction.tax_amount.$numberDecimal)}</p>
              </div>
              <div>
                <p className="font-semibold">Total Amount Paid</p>
                <p>
                  ₹{parseFloat(transaction.total_amount_paid.$numberDecimal)}
                </p>
              </div>
              <div>
                <p className="font-semibold">Payment Date</p>
                <p>
                  {new Date(transaction.payment_date).toLocaleDateString()}{" "}
                  {new Date(transaction.payment_date).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Contact Buttons Section */}
            <div className="flex gap-4">
              <a
                href={`mailto:${transaction.userId?.email}`}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow transition hover:bg-blue-700"
              >
                Email: {transaction.userId?.email}
              </a>
              <a
                href={`tel:${transaction.userId?.phone}`}
                className="rounded-lg bg-green-600 px-4 py-2 text-white shadow transition hover:bg-green-700"
              >
                Phone: {transaction.userId?.phone}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionPage;
