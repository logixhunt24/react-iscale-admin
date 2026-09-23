import { useState, useEffect } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function BannersList() {
  const navigate = useNavigate()
  
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalEntries, setTotalEntries] = useState(0)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchBanners()
  }, [currentPage, entriesPerPage])

  const fetchBanners = async () => {
    try {
      setLoading(true); 
      const token = localStorage.getItem('token')
      const params = new URLSearchParams({
        page: currentPage,
        limit: entriesPerPage
      })
      if (search) params.append('keyword', search)

      const res = await axios.get(`${BASE_URL}/myadmin/banners/all?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.data?.status) {
        setData(res.data.data || [])
        setTotalPages(res.data.pagination?.totalPages || 1)
        setTotalEntries(res.data.pagination?.totalRecords || 0)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!await window.customConfirm("Are you sure you want to delete this banner?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`${BASE_URL}/myadmin/banners/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.status) {
        await window.customAlert(res.data.message || "Banner deleted successfully");
        fetchBanners();
      }
    } catch (err) {
      await window.customAlert(err.response?.data?.message || "Failed to delete banner");
    }
  }

  const handleStatusChange = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'running' ? 'pending' : 'running'
      const token = localStorage.getItem('token')
      const res = await axios.patch(`${BASE_URL}/myadmin/banners/status/${id}`, 
        { m_banner_status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.data?.status) {
        fetchBanners()
      }
    } catch (err) {
      await window.customAlert(err.response?.data?.message || "Failed to change status")
    }
  }

  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(totalPages, startPage + 4)
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

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const startIndex = (currentPage - 1) * entriesPerPage

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow border border-slate-100 transition-colors overflow-hidden flex flex-col h-full">
        <div className="p-4 flex justify-between items-center bg-[#144f36] dark:bg-[#0f3d2a] rounded-t-2xl">
          <h2 className="text-xl font-bold tracking-tight text-white">Banners List</h2>
          <Link 
            to={'/banners/add'}
            className="bg-white text-[#144f36] px-4 py-2 rounded-full text-sm font-bold hover:bg-slate-100 transition-colors flex items-center gap-2 shadow-sm"
          >
            <span>+ Add New Banner</span>
          </Link>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 sm:gap-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-800 dark:text-slate-200">Show</span>
                <select 
                  value={entriesPerPage}
                  onChange={handleEntriesChange}
                  className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-slate-800 dark:text-slate-200">Entries</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={search}
                onChange={async (e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
                onKeyDown={(e) => e.key === 'Enter' && fetchBanners()}
                placeholder="Search banners..."
                className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded-full px-4 py-1.5 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] w-64"
              />
            </div>
          </div>

          <div className="overflow-auto border border-slate-200 dark:border-[#1f1b2e] flex-1 rounded-lg">
            <table className="w-full text-left text-sm text-slate-800 dark:text-slate-200">
              <thead className="bg-slate-50 dark:bg-[#13111c] text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-gray-800">
                <tr>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">S.No.</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Title</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap text-center">Image</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap text-center">Status</th>
                  <th className="px-4 py-3 font-bold whitespace-nowrap text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-6">Loading...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-6 text-slate-500">No banners found.</td></tr>
                ) : (
                  data.map((row, index) => (
                    <tr key={row._id} className="border-b border-slate-200 dark:border-gray-800/50 hover:bg-slate-50 dark:bg-[#1f1b2e]/50">
                      <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">{startIndex + index + 1}</td>
                      <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle font-medium">{row.m_banner_title}</td>
                      <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                        {row.m_banner_image ? (
                          <div className="w-24 h-12 rounded overflow-hidden border border-slate-200 mx-auto bg-slate-100">
                            <img src={`${BASE_URL}/${row.m_banner_image.replace(/\\/g, '/')}`} alt="Banner" className="w-full h-full object-cover" onError={(e) => {e.target.onerror=null; e.target.src="https://via.placeholder.com/100x50?text=No+Image"}} />
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">No Image</span>
                        )}
                      </td>
                      <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                        <button 
                          onClick={() => handleStatusChange(row._id, row.m_banner_status)}
                          className={`px-4 py-1.5 rounded-full text-white text-xs font-bold transition-opacity hover:opacity-80 shadow-sm ${row.m_banner_status === 'pending' || row.m_banner_status === 'inactive' ? 'bg-slate-500' : 'bg-[#144f36]'}`}
                        >
                          {row.m_banner_status ? row.m_banner_status.charAt(0).toUpperCase() + row.m_banner_status.slice(1) : 'Unknown'}
                        </button>
                      </td>
                      <td className="px-4 py-3 align-middle text-center">
                        <div className="flex justify-center gap-2">
                          <Link to={`/banners/edit/${row._id}`} className="inline-block bg-[#d87025] text-white p-1.5 rounded hover:bg-[#b55d1f] transition-colors shadow-sm" title="Edit">
                            <Edit2 size={14} />
                          </Link>
                          <button onClick={() => handleDelete(row._id)} className="bg-red-600 text-white p-1.5 rounded hover:bg-red-700 transition-colors shadow-sm" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && totalEntries > 0 && (
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center text-sm text-slate-800 dark:text-slate-200 gap-4">
              <div>
                Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, totalEntries)} of {totalEntries} entries
              </div>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 border rounded ${currentPage === 1 ? 'text-slate-400 border-slate-200' : 'text-slate-700 hover:bg-slate-50 border-slate-300'}`}
                >
                  Previous
                </button>
                {getPageNumbers().map(pageNum => (
                  <button 
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded ${currentPage === pageNum ? 'bg-[#144f36] text-white border-transparent' : 'bg-transparent text-slate-600 border border-slate-300 hover:bg-slate-50'}`}
                  >
                    {pageNum}
                  </button>
                ))}
                <button 
                  onClick={handleNext}
                  disabled={currentPage >= totalPages}
                  className={`px-3 py-1 border rounded ${currentPage >= totalPages ? 'text-slate-400 border-slate-200' : 'text-slate-700 hover:bg-slate-50 border-slate-300'}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
