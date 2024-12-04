import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";

interface Contact {
  subject: any;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  type: string;
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

const UserList: React.FC<UserListProps> = ({
  data,
  setActiveTab,
  activeTab,
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    if (data && data.contacts) {
      setContacts(data.contacts);
    }
  }, [data]);

  const handleDelete = async (id: string) => {
    try {
      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact._id !== id),
      );

      const response = await fetch(
        process.env.NEXT_PUBLIC_API_ENPOINT + `/api/tender/contactDelete/${id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete contact");
      }
    } catch (error) {
      console.error("Failed to delete contact:", error);
      setContacts((prevContacts) => {
        return data.contacts;
      });
    }
  };

  const handleMarkAsContacted = async (id: string) => {
    try {
      // Find the contact that is being marked as contacted
      const contactToUpdate = contacts.find((contact) => contact._id === id);

      // Optimistically update the contact's type in local state
      setContacts((prevContacts) =>
        prevContacts
          .map((contact) =>
            contact._id === id ? { ...contact, type: "contacted" } : contact,
          )
          .filter((contact) => contact.type !== "contacted"),
      );

      const response = await fetch(
        process.env.NEXT_PUBLIC_API_ENPOINT +
          `/api/tender/contactMarkAsContacted/${id}`,
        {
          method: "PATCH",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to mark contact as contacted");
      }
    } catch (error) {
      console.error("Failed to mark contact as contacted:", error);
      // Revert to original contacts if API call fails
      setContacts(data.contacts);
    }
  };
  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8 flex items-center gap-6">
        <button
          onClick={() => setActiveTab("support")}
          className={cn(
            "rounded-xl border px-4 py-2",
            activeTab === "support" ? "bg-black text-white" : "text-gray-600",
          )}
        >
          Support Entries
        </button>
        <button
          onClick={() => setActiveTab("contacted")}
          className={cn(
            "rounded-xl border px-4 py-2",
            activeTab === "contacted" ? "bg-black text-white" : "text-gray-600",
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
                  <th className="border px-6 py-4 text-left">Subject</th>
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
                    <td className="border px-6 py-4">
                      {contact.subject ? contact.subject : "No subject"}
                    </td>
                    <td className="border px-6 py-4">{contact.email}</td>
                    <td className="border px-6 py-4">{contact.message}</td>
                    <td className="flex gap-2 border px-6 py-4 text-center">
                      <Link href={`mailto:${contact.email}`} className="w-fit">
                        <Button variant={"default"}>Send Email</Button>
                      </Link>{" "}
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(contact._id)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleMarkAsContacted(contact._id)}
                      >
                        Mark as Contacted
                      </Button>
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
                  <th className="border px-6 py-4 text-left">Subject</th>
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
                    <td className="border px-6 py-4">{contact.subject}</td>
                    <td className="border px-6 py-4">{contact.email}</td>
                    <td className="border px-6 py-4">{contact.message}</td>
                    <td className="border px-6 py-4 text-center">
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(contact._id)}
                      >
                        Delete
                      </Button>
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