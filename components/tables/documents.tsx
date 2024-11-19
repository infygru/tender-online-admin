import React from "react";

const Documents = ({ data }: any) => {
  if (!data) return <div className="">...loading</div>;

  return (
    <div className="p-0">
      <div className="rounded-xl bg-white p-6 shadow-md">
        {data?.map((document: any) => {
          // Check if tenderId exists to avoid runtime errors
          const tender = document?.tenderId;
          const user = document?.userId;

          return (
            <div
              key={document._id}
              className="mb-4 rounded-lg border p-4 transition hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold">
                {tender?.tenderName || "No Tender Name"}
              </h2>
              {/* <p className="text-gray-700">
                {tender?.WorkDescription || "No Description Available"}
              </p>
              <p className="text-gray-500">
                Published Date: {tender?.epublishedDate || "N/A"}
              </p>
              <p className="text-gray-500">
                Submission Date:{" "}
                {tender?.bidSubmissionDate
                  ? new Date(tender.bidSubmissionDate).toLocaleString()
                  : "N/A"}
              </p>
              <p className="text-gray-500">
                Opening Date:{" "}
                {tender?.bidOpeningDate
                  ? new Date(tender.bidOpeningDate).toLocaleString()
                  : "N/A"}
              </p>
              <p className="text-gray-500">
                Tender ID: {tender?.TenderId || "N/A"}
              </p>
              <p className="text-gray-500">
                Department: {tender?.department || "N/A"}
              </p>
              <p className="text-gray-500">
                Location: {tender?.location || "N/A"}
              </p>
              <p className="text-gray-500">
                Address: {tender?.address || "N/A"}
              </p>
              <p className="text-gray-500">
                Pincode: {tender?.pincode || "N/A"}
              </p>
              <p className="text-gray-500">
                Industry: {tender?.industry || "N/A"}
              </p>
              <p className="text-gray-500">
                Sub Industry: {tender?.subIndustry || "N/A"}
              </p>
              <p className="text-gray-500">
                Classification: {tender?.classification || "N/A"}
              </p>
              <p className="text-gray-500">
                EMD Amount: {tender?.EMDAmountin || "N/A"}
              </p>
              <p className="text-gray-500">
                Contact Person: {user?.name || "N/A"}
              </p>
              <p className="text-gray-500">Phone: {user?.phone || "N/A"}</p>
              <p className="text-gray-500">Email: {user?.email || "N/A"}</p>
              <p className="text-gray-500">
                Created At: {document.createdAt || "N/A"}
              </p>
              <p className="text-gray-500">
                Updated At: {document.updatedAt || "N/A"}
              </p> */}
              <p className="text-gray-500">
                Tender Id: {tender?.tenderId || "N/A"}
              </p>

              <p className="text-gray-500">
                Client Id: {user?.clientId || "N/A"}
              </p>
              <p className="text-gray-500">
                Contact Person: {user?.name || "N/A"}
              </p>
              <p className="text-gray-500">Phone: {user?.phone || "N/A"}</p>
              <p className="text-gray-500">Email: {user?.email || "N/A"}</p>
              <p className="text-gray-500">
                Requested On: {document.createdAt || "N/A"}
              </p>
              <div className="mt-4 flex space-x-4">
                <a
                  href={`mailto:${user?.email}`}
                  className="rounded-xl bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
                >
                  Email
                </a>
                <a
                  href={`tel:${user?.phone}`}
                  className="rounded-xl bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
                >
                  Call
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Documents;
