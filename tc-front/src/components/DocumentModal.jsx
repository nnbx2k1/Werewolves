import React from 'react';

export default function DocumentModal({ doc, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-lg"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4 text-[#0074B7]">Document Preview</h2>

        <p><strong>Title:</strong> {doc.title}</p>
        <p><strong>Status:</strong> {doc.status}</p>
        <p><strong>Last Modified:</strong> {doc.modified}</p>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-[#0074B7] hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
