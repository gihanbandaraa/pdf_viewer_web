import React from "react";
import { Document, Page, pdfjs } from "react-pdf";

import testPdf from "/images/enrollement.pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const PdfModal = ({ pdf, onClose }) => {
  const [numPages, setNumPages] = React.useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = (error) => {
    console.error("Error loading document:", error);
    // Additional error handling logic can be added here
  };

  if (!pdf) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-screen-sm  max-sm:max-w-xs relative overflow-hidden">
        <button
          className="absolute top-0 right-0 mt-4 mr-4 text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4">{pdf.originalFilename}</h2>
        <div className="overflow-auto max-h-[80vh]  ">
          <Document
            file={pdf.path}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<div>Loading...</div>}
          >
            {numPages &&
              Array.from(new Array(numPages), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} />
              ))}
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PdfModal;
