import React from "react";
import { RiDeleteBinLine } from "react-icons/ri"; 

const PdfCard = ({ pdf, onView, onDelete }) => {
  const handleDelete = () => {
    onDelete(pdf); 
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 m-4 w-80 max-sm:w-60">
      <a href={pdf.path} target="_blank" rel="noopener noreferrer">
        <h2 className="text-xl font-semibold text-red-500 truncate">
          {pdf.originalFilename}
        </h2>
      </a>
      <p className="text-sm text-gray-600">Uploaded by: {pdf.uploadedBy.fullName}</p>
      <div className="flex mt-2 space-x-2">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-400"
          onClick={() => onView(pdf)}
        >
          View
        </button>
        <button
          className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg font-semibold hover:bg-gray-400"
          onClick={handleDelete}
        >
          <RiDeleteBinLine className="inline-block mr-1" /> Delete
        </button>
      </div>
    </div>
  );
};

export default PdfCard;
