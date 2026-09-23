import { useState, useEffect } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'
import { getImageUrl } from '../../utils/imageUtils'

export default function NotesCategory() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(50)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true); 
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/myadmin/notes-category/all?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status) {
        setCategories(response.data.data || [])
      } else {
        setCategories([])
      }
    } catch (error) {
      console.error('Error fetching notes categories:', error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!await window.customConfirm('Are you sure you want to delete this category?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await axios.delete(`${BASE_URL}/myadmin/notes-category/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status) {
        await window.customAlert(response.data.message || 'Deleted successfully')
        fetchCategories()
      } else {
        await window.customAlert(response.data.message || 'Failed to delete')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      await window.customAlert(error.response?.data?.message || 'Delete failed')
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token')
      // Determine if we need a PUT with body or just call the endpoint. Prompt shows no body.
      const response = await axios.put(`${BASE_URL}/myadmin/notes-category/change-status/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status) {
        // Update local state or re-fetch
        fetchCategories()
      } else {
        await window.customAlert(response.data.message || 'Failed to change status')
      }
    } catch (error) {
      console.error('Error changing status:', error)
      await window.customAlert(error.response?.data?.message || 'Status change failed')
    }
  }

  const filteredCategories = categories.filter(cat => 
    cat.nc_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const TOTAL_ENTRIES = filteredCategories.length
  const TOTAL_PAGES = Math.ceil(TOTAL_ENTRIES / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const endIndex = Math.min(startIndex + entriesPerPage, TOTAL_ENTRIES)
  const currentData = filteredCategories.slice(startIndex, endIndex)

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
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md border border-slate-100 overflow-hidden flex flex-col h-full">
        <div className="p-4 flex justify-between items-center bg-[#144f36] text-white">
          <h2 className="text-xl font-bold tracking-tight text-white">Notes Category List</h2>
          <Link to={'/notes/category/add'} className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-2 border border-white/30">
            <span>+ Add New</span>
          </Link>
        </div>

        <div className="p-4 flex-1 flex flex-col bg-white">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-800">Show</span>
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
                <span className="text-sm text-slate-800">Entries</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-slate-300 bg-white text-slate-700 rounded-full px-4 py-1.5 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] w-64"
              />
            </div>
          </div>

          <div className="overflow-auto border border-slate-200 rounded-lg flex-1">
            <table className="w-full text-left text-sm text-slate-800">
              <thead className="bg-[#144f36] text-white border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a] whitespace-nowrap">S.No.</th>
                  <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a] whitespace-nowrap">Category Name</th>
                  <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a] whitespace-nowrap">Icon</th>
                  <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a] whitespace-nowrap">Banner</th>
                  <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a] min-w-[300px]">Description</th>
                  <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a] whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8">Loading categories...</td>
                  </tr>
                ) : currentData.length > 0 ? (
                  currentData.map((row, index) => (
                    <tr key={row._id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3 border-r border-slate-200 align-middle text-[#428bca]">{startIndex + index + 1}</td>
                      <td className="px-4 py-3 border-r border-slate-200 align-middle">{row.nc_name}</td>
                      <td className="px-4 py-3 border-r border-slate-200 align-middle">
                        {row.nc_icon ? (
                          <div className="w-10 h-10 rounded flex items-center justify-center overflow-hidden bg-slate-100">
                            <img src={getImageUrl(row.nc_icon)} alt="icon" className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://placehold.co/40x40/f1f5f9/94a3b8?text=ICN'} />
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-3 border-r border-slate-200 align-middle">
                        {row.nc_banner ? (
                          <div className="w-16 h-10 rounded flex items-center justify-center overflow-hidden bg-slate-100">
                            <img src={getImageUrl(row.nc_banner)} alt="banner" className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://placehold.co/64x40/f1f5f9/94a3b8?text=BNR'} />
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-3 border-r border-slate-200 align-middle">
                        <div className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {row.nc_description}
                        </div>
                      </td>
                      <td className="px-4 py-3 border-r border-slate-200 align-middle">
                        <button 
                          onClick={() => handleToggleStatus(row._id, row.nc_status)}
                          className={`px-3 py-1 rounded-full text-white text-xs font-bold shadow-sm ${row.nc_status === 'active' ? 'bg-[#144f36]' : 'bg-[#d87025]'}`}
                        >
                          {row.nc_status === 'active' ? 'Active' : 'In-Active'}
                        </button>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex gap-1.5">
                          <Link to={`/notes/category/add`} state={{ editCategory: row }} className="inline-block bg-[#28a745] text-white p-1.5 rounded-full hover:bg-[#218838] transition-colors">
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
                    <td colSpan="7" className="text-center py-8">No categories found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {TOTAL_PAGES > 0 && (
            <div className="mt-4 flex justify-between items-center text-sm text-slate-700">
              <div>
                Showing {TOTAL_ENTRIES === 0 ? 0 : startIndex + 1} to {endIndex} of {TOTAL_ENTRIES} entries
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
    </div>
  )
}
