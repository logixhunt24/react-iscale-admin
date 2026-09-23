import { useState, useEffect } from 'react'
import { Eye, Edit2, Trash2 } from 'lucide-react'
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'
import { getImageUrl } from '../../utils/imageUtils'
export default function CourseTestSeries() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const courseTitle = location.state?.courseTitle || location.state?.course_title || 'Course'
  
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(50)

  useEffect(() => {
    fetchPackages()
  }, [id])

  const fetchPackages = async () => {
    try {
      setLoading(true); 
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/myadmin/test-package/get-packages/${id}`, {
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

  const handleDelete = async (packageId) => {
    if (!await window.customConfirm('Are you sure you want to delete this package?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await axios.delete(`${BASE_URL}/myadmin/test-package/delete-package/${packageId}`, {
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

  const TOTAL_ENTRIES = packages.length
  const TOTAL_PAGES = Math.ceil(TOTAL_ENTRIES / entriesPerPage)

  const currentData = packages.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  )

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value))
    setCurrentPage(1)
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

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow border border-slate-100 transition-colors overflow-hidden flex flex-col h-full">
        <div className="p-4 flex justify-between items-center bg-[#144f36] dark:bg-[#0f3d2a] rounded-t-2xl">
          <h2 className="text-xl font-bold tracking-tight text-white">Packages - {courseTitle}</h2>
          <Link 
            to={`/courses/test-series/add/${id}`} state={{ courseTitle }} 
            className="bg-white text-[#144f36] px-4 py-2 rounded-full text-sm font-bold hover:bg-slate-100 transition-colors flex items-center gap-2 shadow-sm"
          >
            <span>+ Add New Package</span>
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
                placeholder="Search..."
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
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap text-center">Banner</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap text-center">Quiz</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap text-center">Training Highlights</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap text-center">Status</th>
                  <th className="px-4 py-3 font-bold whitespace-nowrap text-center">Action</th>
                </tr>
              </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8">Loading packages...</td>
                </tr>
              ) : currentData.length > 0 ? (
                currentData.map((row, index) => (
                  <tr key={row._id} className="border-b border-slate-200 dark:border-gray-800/50 hover:bg-slate-50 dark:hover:bg-[#1f1b2e]/50 transition-colors">
                    <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">{(currentPage - 1) * entriesPerPage + index + 1}</td>
                    <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle font-medium">{row.m_package_title}</td>
                    <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                      {row.m_package_image ? (
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden mx-auto shadow-sm">
                          <img src={getImageUrl(row.m_package_image)} alt="banner" className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://placehold.co/48x48/144f36/ffffff?text=IMG'} />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] text-slate-400 font-bold rounded-lg mx-auto shadow-sm">
                          IMG
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                      <Link to={`/quiz/list/${row._id}`} state={{ packageTitle: row.m_package_title }} className="inline-block bg-[#144f36] text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#0f3d2a] transition-colors shadow-sm">
                        Quiz
                      </Link>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                      <button className="bg-[#144f36] text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#0f3d2a] transition-colors shadow-sm">
                        Training & Highlights
                      </button>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                      <button className={`${row.m_package_status === 1 ? 'bg-[#144f36]' : 'bg-[#d87025]'} text-white px-4 py-1.5 rounded-full text-xs font-bold transition-opacity hover:opacity-80 shadow-sm whitespace-nowrap`}>
                        {row.m_package_status === 1 ? 'Active' : 'In-Active'}
                      </button>
                    </td>
                    <td className="px-4 py-3 align-middle text-center">
                      <div className="flex justify-center gap-2">
                        <Link to={`/test-series/packages/view/${row._id}`} state={{ packageData: row }} className="inline-block bg-[#144f36] text-white p-1.5 rounded hover:bg-[#0f3d2a] transition-colors shadow-sm" title="View">
                          <Eye size={14} />
                        </Link>
                        <Link to={`/courses/test-series/add/${id}`} state={{ editPackage: row, courseTitle }} className="inline-block bg-[#d87025] text-white p-1.5 rounded hover:bg-[#b55d1f] transition-colors shadow-sm" title="Edit">
                          <Edit2 size={14} />
                        </Link>
                        <button onClick={() => handleDelete(row._id)} className="bg-red-600 text-white p-1.5 rounded hover:bg-red-700 transition-colors shadow-sm" title="Delete">
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
        {TOTAL_PAGES > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center text-sm text-slate-800 dark:text-slate-200 gap-4">
            <div>
              Showing {(currentPage - 1) * entriesPerPage + 1} to {Math.min(currentPage * entriesPerPage, TOTAL_ENTRIES)} of {TOTAL_ENTRIES} entries
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
                disabled={currentPage === TOTAL_PAGES}
                className={`px-3 py-1 border rounded ${currentPage === TOTAL_PAGES ? 'text-slate-400 border-slate-200' : 'text-slate-700 hover:bg-slate-50 border-slate-300'}`}
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
