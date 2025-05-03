import React from 'react';

export default function DocumentRow({ doc, onPreview }) {
  return (
    <div className="grid grid-cols-4 py-3 items-center text-sm text-gray-800 hover:bg-white transition">
      <div>{doc.title}</div>
      <div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            doc.status === 'Signed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {doc.status}
        </span>
      </div>
      <div>{doc.modified}</div>
      <div>
        <button
          onClick={onPreview}
          className="text-[#0074B7] hover:underline"
        >
          {doc.status === 'Signed' ? '⬇ Download' : '🔍 View'}
        </button>
      </div>
    </div>
  );
}
