import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import axiosInstance from "../../utils/axiosinstance";
import PdfCard from "../../components/Cards/PdfCard";
import PdfModal from "../../components/Cards/PdfModal";

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [pdfList, setPdfList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null); // State for selected PDF for modal

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
        fetchPdfList();
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Please select a PDF file.");
        event.target.value = null;
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB. Please select a smaller PDF file.");
        event.target.value = null;
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    try {
      if (!userInfo) {
        alert("Please log in to upload a PDF.");
        return;
      }

      if (!selectedFile) {
        alert("Please select a PDF file to upload.");
        return;
      }

      const formData = new FormData();
      formData.append("pdf", selectedFile);

      const response = await axiosInstance.post("/upload-pdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.pdf) {
        alert("PDF uploaded successfully!");
        fetchPdfList();
        setSelectedFile(null);
        document.getElementById("file-input").value = "";
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
      alert("Failed to upload PDF. Please try again later.");
    }
  };

  const fetchPdfList = async () => {
    try {
      const response = await axiosInstance.get("/pdfs");
      if (response.data && response.data.pdfs) {
        setPdfList(response.data.pdfs);
      }
    } catch (error) {
      console.error("Error fetching PDFs:", error);
      alert("Failed to fetch PDFs. Please try again later.");
    }
  };

  const handleViewPdf = (pdf) => {
    setSelectedPdf(pdf);
  };

  const handleDeletePdf = async (pdfToDelete) => {
    try {
      const response = await axiosInstance.delete(`/delete-pdf/${pdfToDelete._id}`);

      if (response.data && response.data.error === false) {
        alert("PDF deleted successfully!");
        fetchPdfList();
      } else {
        alert(response.data.message || "Failed to delete PDF.");
      }
    } catch (error) {
      console.error("Error deleting PDF:", error);
      alert("Failed to delete PDF. Please try again later.");
    }
  };

  const handleCloseModal = () => {
    setSelectedPdf(null);
  };

  return (
    <>
      <NavBar userInfo={userInfo} />
      <div className="flex flex-col items-center mt-10 h-screen">
        <h1 className="text-3xl font-bold mb-4">PDF Reader Online</h1>
        <div className="w-2/3 h-fit bg-slate-200 flex items-center justify-center max-w-full">
          <div className="flex flex-col items-center justify-center mt-4 max-md:w-2/3">
            <h2 className="text-xl font-semibold max-md:text-sm">Add Your PDF to Start</h2>
            <img
              className="mt-5"
              src="/images/pdf.png"
              alt="PDF Icon"
              width={50}
              height={50}
            />
            <input
              id="file-input"
              type="file"
              className="file:bg-red-300 
             file:m-5 
             file:border-none 
             file:px-6 
             file:py-3 
             file:max-md:px-3 
             file:max-md:py-1 
             file:max-md:m-2 
             file:rounded-full 
             file:cursor-pointer
             file:text-black
             file:font-semibold

             px-2
             bg-white m-1 mt-4 rounded-full font-semibold w-full md:w-96 max-md:text-xs"
              accept="application/pdf"
              onChange={handleFileChange}
            />
            <p className="mt-5 text-slate-500 text-sm font-semibold">
              maximum limit is 5mb
            </p>
            <button
              className="mt-3 px-4 py-2 mb-4 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-400"
              onClick={handleUpload}
            >
              Upload PDF
            </button>
          </div>
        </div>
        <div className="self-start my-5 mx-5 w-full">
          <h1 className="text-2xl font-semibold">PDF List</h1>
          {pdfList.length === 0 ? (
            <p className="mt-2 text-lg text-gray-600">No PDFs uploaded yet.</p>
          ) : (
            <div className="flex flex-wrap mt-2">
              {pdfList.map((pdf) => (
                <PdfCard key={pdf._id} pdf={pdf} onView={handleViewPdf} onDelete={handleDeletePdf} />
              ))}
            </div>
          )}
        </div>
      </div>
      {selectedPdf && <PdfModal pdf={selectedPdf} onClose={handleCloseModal} />}
    </>
  );
};

export default Home;
