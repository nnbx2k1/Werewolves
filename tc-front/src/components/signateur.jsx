import React, { useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import SignatureCanvas from 'react-signature-canvas';

export default function ESignature() {
  const [file, setFile] = useState(null);
  const sigPadRef = useRef();
  const fileInputRef = useRef();

  const handleUpload = (e) => {
    const uploaded = e.target.files[0];
    if (uploaded && uploaded.type === 'application/pdf') {
      setFile(uploaded);
    } else {
      alert("Please upload a PDF file");
    }
  };

  const handleSign = () => {
    if (!file) {
      alert('Please upload a document first');
      return;
    }

    if (sigPadRef.current.isEmpty()) {
      alert("Please draw your signature");
      return;
    }

    const signatureImage = sigPadRef.current.getTrimmedCanvas().toDataURL("image/png");

    // Simulate sending to backend or saving
    console.log("Signature Image:", signatureImage);
    alert("Document signed successfully!");

    // Reset
    setFile(null);
    sigPadRef.current.clear();
  };

  return (
    <div className="flex h-screen bg-[#BFD7ED]">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-[#0074B7]">E-Signature</h1>

        <div className="bg-white rounded-xl p-6 shadow-lg" style={{ boxShadow: '0 0 10px #0074B7' }}>
          {/* File Upload */}
          <div className="mb-4">
            <label className="block font-semibold mb-2 text-gray-700">Upload Document (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              ref={fileInputRef}
              onChange={handleUpload}
              className="border border-gray-300 px-3 py-2 rounded w-full"
            />
          </div>

          {/* File Preview */}
          {file && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">Selected File: {file.name}</p>
              <embed
                src={URL.createObjectURL(file)}
                type="application/pdf"
                className="w-full h-64 border rounded mt-2"
              />
            </div>
          )}

          {/* Signature Canvas */}
          <div className="mb-4">
            <label className="block font-semibold mb-2 text-gray-700">Draw Your Signature</label>
            <div className="border rounded-md shadow" style={{ boxShadow: '0 0 5px #0074B7' }}>
              <SignatureCanvas
                ref={sigPadRef}
                penColor="#0074B7"
                canvasProps={{
                  width: 500,
                  height: 150,
                  className: "bg-white rounded"
                }}
              />
            </div>
            <button
              onClick={() => sigPadRef.current.clear()}
              className="mt-2 text-sm text-red-500 hover:underline"
            >
              Clear Signature
            </button>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSign}
            className="bg-[#0074B7] text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Sign Document
          </button>
        </div>
      </div>
    </div>
  );
}
