import { useState, useEffect } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import ThemeButton from '../../components/common/ThemeButton'
import CardHeader from '../../components/ui/CardHeader'
import { BASE_URL } from '../../config/api'

export default function TeamsList() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalEntries, setTotalEntries] = useState(0)
  const [entriesPerPage, setEntriesPerPage] = useState(10)

  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    fetchTeams()
  }, [currentPage, entriesPerPage])

  const fetchTeams = async () => {
    try {
      setLoading(true); 
      const token = localStorage.getItem('token')
      const params = new URLSearchParams({
        page: currentPage,
        limit: entriesPerPage
      })
      if (search) params.append('search', search)
      if (type) params.append('type', type)
      if (status) params.append('status', status)

      const res = await axios.get(`${BASE_URL}/myadmin/team/all?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.data?.status) {
        setData(res.data.data || [])
        setTotalPages(res.data.totalPages || 1)
        setTotalEntries(res.data.total || 0)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = () => {
    setCurrentPage(1)
    fetchTeams()
  }

  const handleReset = () => {
    setSearch('')
    setType('')
    setStatus('')
    setCurrentPage(1)
    setTimeout(() => {
      fetchTeams()
    }, 0)
  }

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
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

  const handleDelete = async (id) => {
    if (!await window.customConfirm("Are you sure you want to delete this team member?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`${BASE_URL}/myadmin/team/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.status) {
        await window.customAlert(res.data.message || "Team deleted successfully");
        fetchTeams();
      }
    } catch (err) {
      await window.customAlert(err.response?.data?.message || "Failed to delete team member");
    }
  }

  const startIndex = (currentPage - 1) * entriesPerPage

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow border border-slate-100 transition-colors overflow-hidden flex flex-col h-full">
        <CardHeader title="Teams List">
          <ThemeButton 
            variant="white-add"
            to={'/teams/add'}
          >
            + Add Team
          </ThemeButton>
        </CardHeader>

        <div className="p-4 bg-[#eef2f6]/50 border-b border-slate-200 dark:border-gray-800/50 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 w-48">
              <option value="">Select Type</option>
              <option value="1">Type 1</option>
              <option value="2">Type 2</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 w-48">
              <option value="">Select Status</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
          <div className="flex gap-2">
            <ThemeButton onClick={handleFilter} variant="solid-green">
              Filter
            </ThemeButton>
            <ThemeButton 
              onClick={handleReset} 
              variant="outline-green" 
              className="!bg-white !text-[#144f36] !border-2 !border-[#144f36] hover:!bg-[#144f36] hover:!text-white transition-all"
            >
              Reset
            </ThemeButton>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 sm:gap-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-800 dark:text-slate-200">Show</span>
                <select 
                  value={entriesPerPage}
                  onChange={handleEntriesChange}
                  className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
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
                onKeyDown={(e) => e.key === 'Enter' && fetchTeams()}
                placeholder="Search..."
                className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded-full px-4 py-1.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 w-64"
              />
            </div>
          </div>

          <div className="overflow-auto border border-slate-200 dark:border-[#1f1b2e] flex-1 rounded-lg">
            <table className="w-full text-left text-sm text-slate-800 dark:text-slate-200">
              <thead className="bg-slate-50 dark:bg-[#13111c] text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-gray-800">
                <tr>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">S.No.</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap text-center">Image</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Name</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Position</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Expertise</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Experience | Linkedin</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Type</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 font-bold whitespace-nowrap text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="9" className="text-center py-6">Loading...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan="9" className="text-center py-6 text-slate-500">No teams found.</td></tr>
                ) : (
                  data.map((row, index) => (
                    <tr key={row._id} className="border-b border-slate-200 dark:border-gray-800/50 hover:bg-slate-50 dark:bg-[#1f1b2e]/50">
                      <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">{startIndex + index + 1}</td>
                      <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden mx-auto border border-slate-300">
                          {row.member_image ? (
                            <img src={`${BASE_URL}/uploads/team/${row.member_image}`} alt={row.member_name} className="w-full h-full object-cover" onError={(e) => {e.target.onerror = null; e.target.src = "https://via.placeholder.com/40"}} />
                          ) : (
                            <span className="text-xs text-slate-500">Img</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle font-medium text-slate-900 dark:text-slate-100">{row.member_name}</td>
                      <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">{row.member_position}</td>
                      <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle text-xs">
                        <div className="max-w-[200px] truncate" title={row.member_expertise}>
                          {row.member_expertise}
                        </div>
                      </td>
                      <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">
                        <span className="font-medium text-slate-800 dark:text-slate-200">{row.member_experience} yrs</span>
                        {row.member_linkedin && (
                          <a href={row.member_linkedin} target="_blank" rel="noreferrer" className="ml-2 text-blue-600 hover:underline">
                            LinkedIn
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                        <span className="px-2 py-1 bg-slate-100 dark:bg-[#13111c] text-slate-600 dark:text-slate-300 rounded text-xs">{row.member_type}</span>
                      </td>
                      <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                        <span className={`px-2 py-1 text-xs text-white rounded ${row.member_status === 1 ? 'bg-[#144f36]' : 'bg-slate-500'}`}>
                          {row.member_status === 1 ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-middle text-center">
                        <div className="flex justify-center gap-2">
                          <Link to={`/teams/edit/${row._id}`} className="inline-block bg-[#d87025] text-white p-1.5 rounded hover:bg-[#b55d1f] transition-colors shadow-sm" title="Edit">
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
