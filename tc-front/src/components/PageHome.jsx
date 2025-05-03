import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import DocumentRow from '../components/DocumentRow';
import DocumentModal from '../components/DocumentModal';
import { useNavigate } from 'react-router-dom';


const mockDocuments = [
  { id: 1, title: 'Confidential_NDA.pdf', status: 'Pending', modified: 'Today, 9:00 AM' },
  { id: 2, title: 'Loan_Report_Q1.pdf', status: 'Signed', modified: 'Yesterday' },
  { id: 3, title: 'Partnership_Agreement.pdf', status: 'Signed', modified: 'Last week' },
  { id: 4, title: 'Project_Plan_2025.pdf', status: 'Pending', modified: '2 days ago' },
  { id: 5, title: 'Confidential_NDA.pdf', status: 'Pending', modified: 'Today, 9:00 AM' },
  { id: 6, title: 'Loan_Report_Q1.pdf', status: 'Signed', modified: 'Yesterday' },
  { id: 7, title: 'Partnership_Agreement.pdf', status: 'Signed', modified: 'Last week' },
  { id: 8, title: 'Project_Plan_2025.pdf', status: 'Pending', modified: '2 days ago' },
  { id: 9, title: 'Confidential_NDA.pdf', status: 'Pending', modified: 'Today, 9:00 AM' },
  { id: 10, title: 'Loan_Report_Q1.pdf', status: 'Signed', modified: 'Yesterday' },
  { id: 11, title: 'Partnership_Agreement.pdf', status: 'Signed', modified: 'Last week' },
  { id: 12, title: 'Project_Plan_2025.pdf', status: 'Pending', modified: '2 days ago' },
  { id: 13, title: 'Confidential_NDA.pdf', status: 'Pending', modified: 'Today, 9:00 AM' },
  { id: 14, title: 'Loan_Report_Q1.pdf', status: 'Signed', modified: 'Yesterday' },
  { id: 15, title: 'Partnership_Agreement.pdf', status: 'Signed', modified: 'Last week' },
  { id: 16, title: 'Project_Plan_2025.pdf', status: 'Pending', modified: '2 days ago' },
];

export default function RecentDocumentsPage() {
    const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);

  const filteredDocs = mockDocuments.filter(doc => {
    const matchesFilter = filter === 'All' || doc.status === filter;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex bg-[#BFD7ED] min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-[#0074B7]">📁 My Documents</h1>
 
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4 items-center ">
          {['All', 'Pending', 'Signed'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                filter === type
                  ? 'bg-[#0074B7] text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              {type}
            </button>
          ))}

          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ml-auto px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none"
            style={{ boxShadow: '0 0 4px #0074B7' }}
          />
        </div>
        
 {/* Navigate Button */}
 <div className="mt-6 flex justify-end">
          <button
            onClick={() => navigate('/esign')}
            className="bg-[#0074B7] text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition"
          >
            ✍️ Go to Sign Document
          </button>
        </div>
        {/* Bulk Action */}
        <div className="mb-4">
          <button
            onClick={() => alert('Downloading all signed documents...')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            ⬇ Download All Signed
          </button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-4 font-semibold text-gray-600 border-b pb-2">
          <div>Title</div>
          <div>Status</div>
          <div>Last Modified</div>
          <div>Action</div>
        </div>

        {/* Document Rows - Scrollable */}
<div className="divide-y max-h-[500px] overflow-y-auto  scrollbar-blue rounded-lg bg-[#BFD7ED] mt-2 shadow-inner">
  {filteredDocs.map(doc => (
    <DocumentRow key={doc.id} doc={doc} onPreview={() => setPreviewDoc(doc)} />
  ))}
</div>
  


        {/* Modal */}
        {previewDoc && (
          <DocumentModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
        )}
      </main>
    </div>
  );
}