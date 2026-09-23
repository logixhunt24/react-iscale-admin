import { useState, useEffect } from 'react'
import { Eye, Edit2, Trash2 } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'
import { getImageUrl } from '../../utils/imageUtils'
export default function TestSeriesPackages() {
  const navigate = useNavigate()
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(50)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      setLoading(true); 
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/myadmin/test-package/get-all-packages`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status) {
        setPackages(response.data.data || [])
      } else {
        setPackages([])
      }
    } catch (error) {
      console.error('Error fetching packages:', error)
      setPackages([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!await window.customConfirm('Are you sure you want to delete this package?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await axios.delete(`${BASE_URL}/myadmin/test-package/delete-package/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status) {
        await window.customAlert(response.data.message || 'Deleted successfully')
        fetchPackages()
      } else {
        await window.customAlert(response.data.message || 'Failed to delete')
      }
    } catch (error) {
      console.error('Error deleting package:', error)
      await window.customAlert(error.response?.data?.message || 'Delete failed')
    }
  }

  const filteredPackages = packages.filter(pkg => {
    return (pkg.m_package_title || '').toLowerCase().includes(searchTerm.toLowerCase())
  })

  const TOTAL_ENTRIES = filteredPackages.length
  const TOTAL_PAGES = Math.ceil(TOTAL_ENTRIES / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const endIndex = Math.min(startIndex + entriesPerPage, TOTAL_ENTRIES)
  const currentData = filteredPackages.slice(startIndex, endIndex)

  const handleExport = async (type) => {
    if (!filteredPackages || filteredPackages.length === 0) {
      await window.customAlert("No data to export");
      return;
    }
    
    const headers = ['S.No.', 'Title', 'Status'];
    const csvRows = [headers.join(',')];
    
    filteredPackages.forEach((row, index) => {
      const values = [
        index + 1,
        `"${row.m_package_title || ''}"`,
        `"${row.m_package_status === 1 ? 'Active' : 'In-Active'}"`
      ];
      csvRows.push(values.join(','));
    });
    
    const csvString = csvRows.join('\n');
    if (type === 'Copy') {
      navigator.clipboard.writeText(csvString);
      await window.customAlert('Table data copied to clipboard!');
    } else {
      const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvString);
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      link.setAttribute("download", type === 'PDF' ? "test_packages.pdf" : "test_packages.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  const handlePrint = () => {
    window.print();
  }

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < TOTAL_PAGES) setCurrentPage(currentPage + 1)
  }

  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(TOTAL_PAGES, startPage + 4)
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4)
    }
    
    const pages = []
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-[#eaf3f8] p-4 font-sans animate-fade-in-up">
      {/* Title Card */}
      <div className="bg-[#144f36] rounded-t-2xl p-5 flex justify-between items-center shadow-md relative overflow-hidden group mb-5">
        <h2 className="text-white font-bold tracking-tight text-xl relative z-10">Packages - Course</h2>
        <Link to={'/test-series/packages/add'} className="bg-white hover:bg-slate-50 text-[#144f36] px-5 py-2 rounded-full text-sm font-bold shadow-sm transition-all flex items-center gap-2">
          <span>+ Add New Package</span>
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <span className="text-sm text-slate-700">Show</span>
            <select 
              value={entriesPerPage}
              onChange={handleEntriesChange}
              className="border border-slate-300 bg-white text-slate-700 rounded px-2 py-1 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-slate-700 mr-2">Entries</span>
            <div className="flex gap-0 border border-slate-300 bg-white rounded overflow-hidden flex-wrap">
                {[
                  { label: 'Copy', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> },
                  { label: 'Excel', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M14 13h2"/><path d="M14 17h2"/></svg> },
                  { label: 'PDF', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg> },
                  { label: 'Print', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg> }
                ].map(btn => (
                  <button 
                    key={btn.label} 
                    title={btn.label} 
                    onClick={() => btn.label === 'Print' ? handlePrint() : handleExport(btn.label)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-50 border-r border-slate-300 last:border-r-0 flex items-center justify-center"
                  >
                    {btn.icon}
                  </button>
                ))}
              </div>
          </div>
          <div className="flex items-center">
            <input 
              type="text" 
              placeholder="Search..."
              value={searchTerm}
              onChange={async (e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="border border-slate-300 bg-white text-slate-700 rounded px-4 py-1.5 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] min-w-[200px]"
            />
          </div>
        </div>

        <div className="overflow-auto border border-slate-200 rounded">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-[#144f36] text-white">
              <tr>
                <th className="px-3 py-3 font-semibold text-xs border-r border-[#0f3d2a] whitespace-nowrap">S.No.</th>
                <th className="px-3 py-3 font-semibold text-xs border-r border-[#0f3d2a] whitespace-nowrap">Title</th>
                <th className="px-3 py-3 font-semibold text-xs border-r border-[#0f3d2a] whitespace-nowrap">Banner</th>
                <th className="px-3 py-3 font-semibold text-xs border-r border-[#0f3d2a] whitespace-nowrap">Quiz</th>
                <th className="px-3 py-3 font-semibold text-xs border-r border-[#0f3d2a] whitespace-nowrap">Training Highlights</th>
                <th className="px-3 py-3 font-semibold text-xs border-r border-[#0f3d2a] whitespace-nowrap">Status</th>
                <th className="px-3 py-3 font-semibold text-xs whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8">Loading packages...</td>
                </tr>
              ) : currentData.length > 0 ? (
                currentData.map((row, index) => (
                  <tr key={row._id} className="border-b border-slate-200 bg-white hover:bg-slate-50">
                    <td className="px-4 py-4 border-r border-slate-200 align-middle text-[#428bca]">{startIndex + index + 1}</td>
                    <td className="px-4 py-4 border-r border-slate-200 align-middle">{row.m_package_title}</td>
                    <td className="px-4 py-4 border-r border-slate-200 align-middle">
                      {row.m_package_image ? (
                        <div className="w-12 h-8 bg-[#144f36] rounded flex items-center justify-center overflow-hidden">
                          <img src={getImageUrl(row.m_package_image)} alt="banner" className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://placehold.co/48x32/144f36/ffffff?text=IMG'} />
                        </div>
                      ) : (
                        <div className="w-12 h-8 bg-[#144f36] rounded flex items-center justify-center overflow-hidden">
                          <span className="text-[10px] text-white font-bold">IMG</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 border-r border-slate-200 align-middle">
                      <Link to={`/quiz/list/${row._id}`} state={{ packageTitle: row.m_package_title }} className="inline-block bg-[#28a745] text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        Quiz
                      </Link>
                    </td>
                    <td className="px-4 py-4 border-r border-slate-200 align-middle">
                      <button className="bg-[#144f36] text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm whitespace-nowrap">
                        Training & Highlights
                      </button>
                    </td>
                    <td className="px-4 py-4 border-r border-slate-200 align-middle">
                      <button className={`bg-[#144f36] text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm whitespace-nowrap`}>
                        {row.m_package_status === 1 ? 'Active' : 'In-Active'}
                      </button>
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <div className="flex gap-1.5">
                        <Link to={`/test-series/packages/view/${row._id}`} state={{ packageData: row }} className="inline-block bg-[#144f36] text-white p-1.5 rounded-full hover:bg-[#0f3d2a] transition-colors">
                          <Eye size={14} />
                        </Link>
                        <Link to={`/test-series/packages/add`} state={{ editPackage: row }} className="inline-block bg-[#28a745] text-white p-1.5 rounded-full hover:bg-[#218838] transition-colors">
                          <Edit2 size={14} />
                        </Link>
                        <button onClick={() => handleDelete(row._id)} className="bg-[#d87025] text-white p-1.5 rounded-full hover:bg-[#b55d1f] transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8">No packages found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {TOTAL_PAGES > 0 && (
          <div className="mt-4 flex justify-between items-center text-sm text-slate-700">
            <div className="mb-4 sm:mb-0">
              Showing {startIndex + 1} to {endIndex} of {TOTAL_ENTRIES} entries
            </div>
            <div className="flex overflow-hidden items-center border border-slate-300 rounded">
              <button 
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`px-3 py-1 ${currentPage === 1 ? 'text-slate-400 cursor-not-allowed' : 'hover:bg-slate-50 text-slate-600 border-r border-slate-300'}`}
              >
                Previous
              </button>
              
              {getPageNumbers().map(pageNum => (
                <button 
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 text-sm border-r border-slate-300 ${currentPage === pageNum ? 'bg-[#144f36] font-bold text-white' : 'hover:bg-slate-50 text-slate-600'}`}
                >
                  {pageNum}
                </button>
              ))}
              
              <button 
                onClick={handleNext}
                disabled={currentPage === TOTAL_PAGES}
                className={`px-3 py-1 ${currentPage === TOTAL_PAGES ? 'text-slate-400 cursor-not-allowed' : 'hover:bg-slate-50 text-slate-600'}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
