import React from "react";

const Documents = ({ data }: any) => {
  return (
    <div className="p-0">
      <div className="rounded-xl bg-white p-6 shadow-md">
        {data?.map((document: any) => (
          <div
            key={document._id}
            className="mb-4 rounded-lg border p-4 transition hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold">
              {document.tenderId.tenderName}
            </h2>
            <p className="text-gray-700">{document.tenderId.WorkDescription}</p>
            <p className="text-gray-500">
              Published Date: {document.tenderId.epublishedDate}
            </p>
            <p className="text-gray-500">
              Submission Date:{" "}
              {new Date(document.tenderId.bidSubmissionDate).toLocaleString()}
            </p>
            <p className="text-gray-500">
              Opening Date:{" "}
              {new Date(document.tenderId.bidOpeningDate).toLocaleString()}
            </p>
            {/* // add tenderId */}
            <p className="text-gray-500">
              Tender ID: {document.tenderId.TenderId}
            </p>
            <p className="text-gray-500">
              Department: {document.tenderId.department}
            </p>
            <p className="text-gray-500">
              Location: {document.tenderId.location}
            </p>
            <p className="text-gray-500">
              Address: {document.tenderId.address}
            </p>
            <p className="text-gray-500">
              Pincode: {document.tenderId.pincode}
            </p>
            <p className="text-gray-500">
              Industry: {document.tenderId.industry}
            </p>
            <p className="text-gray-500">
              Sub Industry: {document.tenderId.subIndustry}
            </p>
            <p className="text-gray-500">
              Classification: {document.tenderId.classification}
            </p>

            <p className="text-gray-500">
              EMD Amount: {document.tenderId.EMDAmountin}
            </p>

            <p className="text-gray-500">
              Contact Person: {document.userId.name}
            </p>
            <p className="text-gray-500">Phone: {document.userId.phone}</p>
            <p className="text-gray-500">Email: {document.userId.email}</p>
            <p className="text-gray-500">Created At: {document.createdAt}</p>
            <p className="text-gray-500">Updated At: {document.updatedAt}</p>

            <div className="mt-4 flex space-x-4">
              <a
                href={`mailto:${document.userId.email}`}
                className="rounded-xl bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
              >
                Email
              </a>
              <a
                href={`tel:${document.userId.phone}`}
                className="rounded-xl bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
              >
                Call
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documents;
