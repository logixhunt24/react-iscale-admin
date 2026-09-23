import { useState, useEffect } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function InstructorList() {
  const navigate = useNavigate()
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [totalEntries, setTotalEntries] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchInstructors()
  }, [currentPage, entriesPerPage])

  const fetchInstructors = async () => {
    try {
      setLoading(true); 
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${BASE_URL}/myadmin/instructor/get-all-instructors?page=${currentPage}&limit=${entriesPerPage}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      if (response.data && response.data.status) {
        setInstructors(response.data.data || [])
        setTotalEntries(response.data.pagination?.total || 0)
        setTotalPages(response.data.pagination?.totalPages || 1)
      } else {
        setInstructors([])
      }
    } catch (error) {
      console.error('Error fetching instructors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (await window.customConfirm("Are you sure you want to delete this instructor?")) {
      try {
        const token = localStorage.getItem('token')
        await axios.delete(`${BASE_URL}/myadmin/instructor/delete-instructor/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        fetchInstructors()
      } catch (error) {
        console.error('Delete failed:', error)
        await window.customAlert('Delete failed')
      }
    }
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

  const startIndex = (currentPage - 1) * entriesPerPage
  const endIndex = Math.min(startIndex + entriesPerPage, totalEntries)

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow border border-slate-100 overflow-hidden flex flex-col h-full">
        <div className="bg-[#144f36] rounded-t-2xl p-5 flex justify-between items-center shadow-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white dark:bg-[#13111c]/10 rounded-full blur-2xl group-hover:bg-white dark:bg-[#13111c]/20 transition-all duration-700 pointer-events-none"></div>
          <div className="flex items-center relative z-10">
            <div className="w-1.5 h-7 bg-white dark:bg-[#13111c]/90 rounded-full mr-4 shadow-[0_0_12px_rgba(255,255,255,0.9)] hidden sm:block"></div>
            <h2 className="text-white font-bold tracking-wide text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">Instructors List</h2>
          </div>
          <Link to={'/instructors/add'} className="bg-white hover:bg-slate-50 text-[#144f36] px-5 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all flex items-center gap-2 relative z-10 hover:shadow hover:-translate-y-0.5">
            <span>+ Add Instructor</span>
          </Link>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
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
          </div>

          <div className="overflow-auto border border-slate-200 dark:border-[#1f1b2e] flex-1">
            <table className="w-full text-left text-sm text-slate-800 dark:text-slate-200">
              <thead className="bg-slate-50 dark:bg-[#13111c] text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-gray-800">
                <tr>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-[#1f1b2e] whitespace-nowrap">S.No.</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-[#1f1b2e] whitespace-nowrap">Image</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-[#1f1b2e] whitespace-nowrap">Name</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-[#1f1b2e] whitespace-nowrap">Email</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-[#1f1b2e] whitespace-nowrap">Phone</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-[#1f1b2e] whitespace-nowrap">Skills</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-[#1f1b2e] whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 font-bold whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-8">Loading...</td>
                  </tr>
                ) : instructors.map((row, index) => (
                  <tr key={row._id} className="border-b border-slate-200 dark:border-[#1f1b2e] hover:bg-slate-50 dark:bg-[#1f1b2e]/50">
                    <td className="px-4 py-3 border-r border-slate-200 dark:border-[#1f1b2e] align-top">{startIndex + index + 1}</td>
                    <td className="px-4 py-3 border-r border-slate-200 dark:border-[#1f1b2e] align-top">
                      {row.m_instructor_profile ? (
                        <img src={row.m_instructor_profile} alt="Profile" className="w-10 h-10 rounded-full object-cover mx-auto" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-xs overflow-hidden mx-auto">
                          Img
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200 dark:border-[#1f1b2e] align-top text-[#144f36] font-medium">
                      {row.m_instructor_name}
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200 dark:border-[#1f1b2e] align-top">{row.m_instructor_email}</td>
                    <td className="px-4 py-3 border-r border-slate-200 dark:border-[#1f1b2e] align-top">{row.m_instructor_phone}</td>
                    <td className="px-4 py-3 border-r border-slate-200 dark:border-[#1f1b2e] align-top">
                      {row.m_instructor_skills?.join(', ')}
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200 dark:border-[#1f1b2e] align-top">
                      <span className={`px-3 py-1 rounded-full text-white text-xs whitespace-nowrap ${row.m_instructor_status === 1 ? 'bg-[#144f36]' : 'bg-red-500'}`}>
                        {row.m_instructor_status === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex gap-2">
                        <Link 
                          to={`/instructors/edit/${row._id}`}
                          className="inline-block bg-[#d87025] text-white p-1.5 rounded hover:bg-[#b55d1f] transition-colors shadow-sm"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(row._id)}
                          className="btn-glossy-red icon-only"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && instructors.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                      No Data Available In Table
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center text-sm text-slate-800 dark:text-slate-200">
            <div>
              Showing {totalEntries === 0 ? 0 : startIndex + 1} to {endIndex} of {totalEntries} entries
            </div>
            <div className="flex items-center space-x-1">
              <button 
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded ${currentPage === 1 ? 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1f1b2e]' : 'text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:bg-[#1f1b2e]/50'}`}
              >
                Previous
              </button>
              {getPageNumbers().map(pageNum => (
                <button 
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 flex items-center justify-center rounded ${currentPage === pageNum ? 'bg-slate-50 dark:bg-[#13111c] text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-gray-800' : 'hover:bg-slate-50 dark:bg-[#1f1b2e]/50 text-slate-600 dark:text-slate-400 border border-transparent hover:border-slate-300 dark:border-[#1f1b2e]'}`}
                >
                  {pageNum}
                </button>
              ))}
              <button 
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1f1b2e]' : 'text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:bg-[#1f1b2e]/50'}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


