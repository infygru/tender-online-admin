import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useState, useEffect } from "react";

interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

interface UserListProps {
  data: {
    message: string;
    contacts: Contact[];
    code: number;
  };
  setActiveTab: (tab: string) => void;
  activeTab: string;
  
}

const UserList: React.FC<UserListProps> = ({ data, setActiveTab , activeTab }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    // Initialize contacts state from data
    if (data && data.contacts) {
      setContacts(data.contacts);
    }
  }, [data]);

  const handleDelete = (id: string) => {
    // Simulate deletion logic
    setContacts((prevContacts) =>
      prevContacts.filter((contact) => contact._id !== id),
    );
    // You can add an API call here to delete the contact from the backend
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8 flex items-center gap-6">
        <button
          onClick={() => setActiveTab("support")}
          className={cn(
            "rounded-xl border px-4 py-2",
            activeTab === "support"
              ? "bg-blue-500 text-white"
              : "text-gray-600",
          )}
        >
          Support Entries
        </button>
        <button
          onClick={() => setActiveTab("contacted")}
          className={cn(
            "rounded-xl border px-4 py-2",
            activeTab === "contacted"
              ? "bg-blue-500 text-white"
              : "text-gray-600",
          )}
        >
          Contacted Entries
        </button>
      </div>

      {activeTab === "support" && (
        <>
          {contacts.length === 0 ? (
            <p className="text-gray-600">No contacts available.</p>
          ) : (
            <table className="min-w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg">
              <thead>
                <tr className="bg-gray-200 text-sm uppercase leading-normal text-gray-700">
                  <th className="border px-6 py-4 text-left">First Name</th>
                  <th className="border px-6 py-4 text-left">Last Name</th>
                  <th className="border px-6 py-4 text-left">Email</th>
                  <th className="border px-6 py-4 text-left">Message</th>
                  <th className="border px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm font-light text-gray-600">
                {contacts.map((contact) => (
                  <tr
                    key={contact._id}
                    className="transition-colors hover:bg-gray-100"
                  >
                    <td className="border px-6 py-4">{contact.firstName}</td>
                    <td className="border px-6 py-4">{contact.lastName}</td>
                    <td className="border px-6 py-4">{contact.email}</td>
                    <td className="border px-6 py-4">{contact.message}</td>
                    <td className="border px-6 py-4 text-center">
                      <Link
                        href={`mailto:${contact.email}`}
                        className="mr-2 inline-block rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                      >
                        Send Email
                      </Link>
                      <button
                        onClick={() => handleDelete(contact._id)}
                        className="inline-block rounded bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {activeTab === "contacted" && (
        <>
          {contacts.length === 0 ? (
            <p className="text-gray-600">No contacts available.</p>
          ) : (
            <table className="min-w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg">
              <thead>
                <tr className="bg-gray-200 text-sm uppercase leading-normal text-gray-700">
                  <th className="border px-6 py-4 text-left">First Name</th>
                  <th className="border px-6 py-4 text-left">Last Name</th>
                  <th className="border px-6 py-4 text-left">Email</th>
                  <th className="border px-6 py-4 text-left">Message</th>
                  <th className="border px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm font-light text-gray-600">
                {contacts.map((contact) => (
                  <tr
                    key={contact._id}
                    className="transition-colors hover:bg-gray-100"
                  >
                    <td className="border px-6 py-4">{contact.firstName}</td>
                    <td className="border px-6 py-4">{contact.lastName}</td>
                    <td className="border px-6 py-4">{contact.email}</td>
                    <td className="border px-6 py-4">{contact.message}</td>
                    <td className="border px-6 py-4 text-center">
                      <Link
                        href={`mailto:${contact.email}`}
                        className="mr-2 inline-block rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                      >
                        Send Email
                      </Link>
                      <button
                        onClick={() => handleDelete(contact._id)}
                        className="inline-block rounded bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default UserList;
