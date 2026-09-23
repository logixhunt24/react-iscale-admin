import { useState, useEffect } from 'react'
import { Eye, Edit2, Trash2, Book } from 'lucide-react'
import * as Icons from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'
import { getImageUrl } from '../../utils/imageUtils'
export default function PopularCourses() {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(50)
  const [searchTerm, setSearchTerm] = useState('')
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalEntries, setTotalEntries] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const fetchCourses = async () => {
    try {
      setLoading(true); 
      setError(null)
      const token = localStorage.getItem('token')
      console.log('TOKEN:', token ? `${token.substring(0, 30)}...` : 'NULL/MISSING')

      if (!token) {
        setError('No auth token found. Please login again.')
        setLoading(false)
        return
      }

      const url = `${BASE_URL}/myadmin/course/popular-courses?search=${searchTerm}&limit=${entriesPerPage}&page=${currentPage}`
      console.log('FETCHING URL:', url)

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      })

      console.log('POPULAR COURSES RESPONSE:', response.data)

      const resData = response.data

      // Handle multiple possible response shapes
      if (resData) {
        // Shape 1: { status: true, data: [...], pagination: {...} }
        // Shape 2: { success: true, data: [...] }
        // Shape 3: { status: true, courses: [...] }
        const isSuccess = resData.status === true || resData.status === 1 || resData.success === true
        const dataArray = resData.data || resData.courses || resData.results || []

        if (isSuccess && Array.isArray(dataArray)) {
          setCourses(dataArray)
          setTotalEntries(resData.pagination?.total || dataArray.length)
          setTotalPages(resData.pagination?.totalPages || 1)
        } else if (Array.isArray(resData)) {
          // Shape 4: response is directly an array
          setCourses(resData)
          setTotalEntries(resData.length)
          setTotalPages(1)
        } else {
          console.warn('Unexpected response shape:', resData)
          setCourses([])
          setTotalEntries(0)
          setTotalPages(1)
        }
      }
    } catch (err) {
      console.error('POPULAR COURSES ERROR:', err)
      console.error('Error response:', err.response?.data)
      setError(err.response?.data?.message || `Error ${err.response?.status || ''}: Failed to load popular courses`)
      setCourses([])
      setTotalEntries(0)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!await window.customConfirm('Are you sure you want to delete this course?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')

      const response = await axios.delete(
        `${BASE_URL}/myadmin/course/delete-course/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      console.log('DELETE COURSE RESPONSE:', response.data)

      if (response.data?.status) {
        await window.customAlert(response.data.message || 'Course deleted successfully')
        fetchCourses()
      } else {
        await window.customAlert('Delete failed')
      }
    } catch (error) {
      console.error('DELETE COURSE ERROR:', error)

      if (error.response) {
        console.log(error.response.data)
        await window.customAlert(error.response.data?.message || 'Delete failed')
      } else {
        await window.customAlert('Network Error')
      }
    }
  }


  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchCourses()
    }, 300)
    return () => clearTimeout(delaySearch)
  }, [currentPage, entriesPerPage, searchTerm])

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

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#144f36] rounded-t-2xl p-5 flex justify-between items-center shadow-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
          
          <div className="flex items-center relative z-10">
            <div className="w-1.5 h-7 bg-white dark:bg-[#13111c]/90 rounded-full mr-4 shadow-[0_0_12px_rgba(255,255,255,0.9)] hidden sm:block"></div>
            <h2 className="text-white font-bold tracking-wide text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">Popular Courses</h2>
          </div>
          
          <div className="flex items-center gap-3 relative z-10">
            <Link to={'/courses/all/add'} className="bg-white hover:bg-slate-50 text-[#144f36] px-5 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all flex items-center gap-2 hover:-translate-y-0.5">
              <span>+ Add New Course</span>
            </Link>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col bg-white border-x border-b border-slate-200 rounded-b-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div className="flex items-center gap-3 bg-white dark:bg-[#1f1b2e] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1f1b2e] shadow-sm hover:border-indigo-300 transition-colors">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Show</span>
                <select 
                  value={entriesPerPage}
                  onChange={handleEntriesChange}
                  className="bg-transparent text-slate-800 dark:text-slate-200 font-bold text-sm outline-none cursor-pointer focus:text-[#144f36] transition-colors"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Entries</span>
              </div>
              <div className="flex gap-0 border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded overflow-hidden flex-wrap">
                {[
                  { label: 'Copy', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> },
                  { label: 'Excel', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M14 13h2"/><path d="M14 17h2"/></svg> },
                  { label: 'PDF', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg> },
                  { label: 'Print', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg> }
                ].map(btn => (
                  <button 
                    key={btn.label} 
                    title={btn.label} 
                    onClick={async () => {
                      if (btn.label === 'Print') {
                        window.print();
                      } else if (btn.label === 'Excel' || btn.label === 'Copy' || btn.label === 'PDF') {
                        const table = document.querySelector('table');
                        if (!table) return;
                        let csv = '';
                        const rows = table.querySelectorAll('tr');
                        rows.forEach(row => {
                          const cols = row.querySelectorAll('td, th');
                          const rowData = Array.from(cols).map(c => '"' + c.innerText.replace(/"/g, '""') + '"');
                          csv += rowData.join(',') + '\n';
                        });
                        if (btn.label === 'Copy') {
                          navigator.clipboard.writeText(csv);
                          await window.customAlert('Table data copied to clipboard!');
                        } else {
                          const blob = new Blob([csv], { type: 'text/csv' });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'export.csv';
                          a.click();
                        }
                      }
                    }}
                    className="px-3 py-1.5 bg-[#f6f6ff] dark:bg-[#1f1b2e] hover:bg-slate-50 dark:bg-[#1f1b2e]/50 border-r border-slate-300 dark:border-slate-600 last:border-r-0 flex items-center justify-center">
                    {btn.icon}
                  </button>
                ))}
              </div>
            </div>
            <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search anything..."
                className="border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded-full px-5 py-2 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all w-full sm:w-64 flex-1 hover:border-indigo-300"
              />
          </div>

          <div className="overflow-auto border border-slate-200 dark:border-[#1f1b2e] flex-1">
            <table className="w-full text-left text-sm text-slate-800 dark:text-slate-200">
              <thead className="bg-slate-50 dark:bg-[#13111c] text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-gray-800">
                <tr>
                  <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">S.No.</th>
                  <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap min-w-[150px]">Title</th>
                  <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Code</th>
                  <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Banner</th>
                  <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Course Type</th>
                  <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Course Price</th>
                  <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Offer Price</th>
                  <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Subjects</th>
                  <th className="px-3 py-3 font-bold whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Loading courses...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="9" className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-xl">⚠</div>
                        <span className="text-red-500 font-medium">{error}</span>
                        <button onClick={fetchCourses} className="mt-2 px-4 py-1.5 bg-purple-600 text-white rounded-full text-sm hover:bg-purple-700 transition-colors">Retry</button>
                      </div>
                    </td>
                  </tr>
                ) : courses.map((row, index) => {
                  // Map exact API fields: _id, title, code, banner, type, price, offer_price, slug
                  const title = row.title || row.m_course_title || 'N/A'
                  const code = row.code || row.m_course_code || 'N/A'
                  const banner = row.banner || row.m_course_banner || ''
                  const courseType = row.type || row.m_course_type || 'N/A'
                  const price = row.price ?? row.m_course_price ?? 'N/A'
                  const offerPrice = row.offer_price ?? row.m_course_offer_price ?? 'N/A'
                  const courseId = row._id || row.id || row.course_id || row.m_course_id || '';
                  
                  return (
                  <tr key={courseId || index} className="border-b border-slate-200 dark:border-gray-800/50 hover:bg-[#eaf3f8]/60 dark:hover:bg-indigo-900/20 transition-all duration-200 group">
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">
                      {(currentPage - 1) * entriesPerPage + index + 1}
                    </td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle text-blue-600 font-medium">
                      <div className="w-40 break-words">{title}</div>
                    </td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">{code}</td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">
                      {banner ? (
                        <img src={getImageUrl(banner)} alt="banner" className="w-8 h-8 object-cover rounded" />
                      ) : (
                        <div className="w-8 h-8 bg-slate-200 border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 flex items-center justify-center text-[10px] text-center overflow-hidden rounded">
                          Img
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">{courseType}</td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">₹{price}</td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">₹{offerPrice}</td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">
                      <Link to={`/courses/subjects/${courseId}`} className="bg-[#144f36] text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-[#0f3d2a] transition-colors flex items-center gap-1.5 whitespace-nowrap">
                        <Book size={12} />
                        Subject
                      </Link>
                    </td>
                    <td className="px-3 py-3 align-middle">
                      <div className="flex gap-1.5">
                        <Link to={`/courses/view/${courseId}`} state={{ courseData: row }} className="inline-block bg-[#144f36] text-white p-1.5 rounded hover:bg-[#0f3d2a] transition-colors">
                          <Eye size={14} />
                        </Link>
                        <Link to={`/courses/all/edit/${courseId}`} state={{ courseData: row }} className="inline-block bg-[#d87025] text-white p-1.5 rounded hover:bg-[#c2621f] transition-colors">
                          <Edit2 size={14} />
                        </Link>
                        <button onClick={() => handleDelete(courseId)} className="bg-[#d9534f] text-white p-1.5 rounded hover:bg-[#d9534f] transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  )
                })}
                {!loading && !error && courses.length === 0 && (
                  <tr>
                    <td colSpan="9" className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                      No Data Available In Table
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center text-sm text-slate-800 dark:text-slate-200">
            <div>
              Showing {totalEntries === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1} to {Math.min(currentPage * entriesPerPage, totalEntries)} of {totalEntries} entries
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
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-3 py-1 border rounded ${currentPage === totalPages || totalPages === 0 ? 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1f1b2e]' : 'text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:bg-[#1f1b2e]/50'}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}

