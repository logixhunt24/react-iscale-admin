import { useState, useEffect, useCallback } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function LiveClasses() {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  
  // Data State
  const [tableData, setTableData] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [loading, setLoading] = useState(false)
  
  // Dependencies for filters
  const [batches, setBatches] = useState([])
  const [teachers, setTeachers] = useState([])

  // Filter States
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [batchId, setBatchId] = useState('')
  const [teacherId, setTeacherId] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchDependencies = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }
      const [batchesRes, instructorsRes] = await Promise.all([
        axios.get(`${BASE_URL}/myadmin/batch/all?limit=1000`, { headers }),
        axios.get(`${BASE_URL}/myadmin/team/all?limit=1000`, { headers })
      ])
      if (batchesRes.data.status) setBatches(batchesRes.data.data)
      if (instructorsRes.data.status) setTeachers(instructorsRes.data.data)
    } catch (error) {
      console.error('Error fetching dependencies:', error)
    }
  }

  const fetchLiveClasses = useCallback(async () => {
    setLoading(true); 
    try {
      const token = localStorage.getItem('token')
      const params = {
        page: currentPage,
        limit: entriesPerPage,
        from_date: fromDate || undefined,
        to_date: toDate || undefined,
        batch: batchId || undefined,
        teacher: teacherId || undefined
      }
      const response = await axios.get(`${BASE_URL}/myadmin/live-class/all`, {
        params,
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data.status) {
        let fetchedData = response.data.data || []
        if (searchQuery) {
           fetchedData = fetchedData.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
        }
        setTableData(fetchedData)
        setTotalPages(response.data.totalPages || 1)
        setTotalRecords(response.data.total || 0)
      }
    } catch (error) {
      console.error('Error fetching live classes:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, entriesPerPage, fromDate, toDate, batchId, teacherId, searchQuery])

  useEffect(() => {
    fetchDependencies()
  }, [])

  useEffect(() => {
    fetchLiveClasses()
  }, [fetchLiveClasses])

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

  const handleReset = () => {
    setFromDate('')
    setToDate('')
    setBatchId('')
    setTeacherId('')
    setSearchQuery('')
    setCurrentPage(1)
  }

  const handleDelete = async (id) => {
    if (await window.customConfirm("Are you sure you want to delete this class?")) {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.delete(`${BASE_URL}/myadmin/live-class/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.data.status) {
          fetchLiveClasses()
        }
      } catch (error) {
        console.error('Error deleting live class:', error)
      }
    }
  }

  return (
    <div className="h-full animate-fade-in-up">
      {/* Title Card */}
      <div className="bg-[#144f36] rounded-t-2xl p-5 flex justify-between items-center shadow-md relative overflow-hidden group mb-5">
        <h2 className="text-white font-bold tracking-tight text-xl font-medium">Live Classes</h2>
        <div className="flex gap-2">
          <Link className="bg-white hover:bg-slate-50 text-[#144f36] px-5 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all flex items-center gap-2 hover:-translate-y-0.5" to={'/live-classes/add'}>Create Live Class</Link>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md border border-slate-100 p-5 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 w-full items-end">
          <div className="w-full">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">From Date</label>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" />
          </div>
          <div className="w-full">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">To Date</label>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" />
          </div>
          <div className="w-full">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">Batch</label>
            <select value={batchId} onChange={e => setBatchId(e.target.value)} className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600">
              <option value="">Select Batch</option>
              {batches.map(b => <option key={b._id} value={b._id}>{b.batch_name}</option>)}
            </select>
          </div>
          <div className="w-full">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">Teacher</label>
            <select value={teacherId} onChange={e => setTeacherId(e.target.value)} className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600">
              <option value="">Select Teacher</option>
              {teachers.map(t => <option key={t._id} value={t._id}>{t.member_name}</option>)}
            </select>
          </div>
          <div className="w-full flex gap-2 h-[32px]">
            <button onClick={handleReset} className="w-full px-4 py-1.5 bg-[#144f36] text-white text-xs rounded hover:bg-[#0f3d2a] transition-colors font-bold shadow-sm">Reset</button>
          </div>
        </div>
      </div>
      
      {/* Table Section */}
      <div className="bg-[#f6f6ff] dark:bg-[#1f1b2e] border border-slate-200 dark:border-[#1f1b2e] rounded-xl overflow-hidden p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <span className="text-sm text-slate-800 dark:text-slate-200">Show</span>
            <select 
              value={entriesPerPage}
              onChange={handleEntriesChange}
              className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-stone-600 focus:ring-1 focus:ring-stone-600 bg-[#f6f6ff] dark:bg-[#1f1b2e] text-slate-800 dark:text-slate-200"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-slate-800 dark:text-slate-200">entries</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-800 dark:text-slate-200">Search:</span>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-1 text-sm outline-none focus:border-stone-600 focus:ring-1 focus:ring-stone-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#1f1b2e]">
            <thead className="bg-slate-50 dark:bg-[#13111c] text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-gray-800">
              <tr>
                <th className="px-3 py-3 font-semibold text-xs border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">S.No.</th>
                <th className="px-3 py-3 font-semibold text-xs border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Title</th>
                <th className="px-3 py-3 font-semibold text-xs border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Date</th>
                <th className="px-3 py-3 font-semibold text-xs border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Duration</th>
                <th className="px-3 py-3 font-semibold text-xs border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Join Link</th>
                <th className="px-3 py-3 font-semibold text-xs border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Batch Name</th>
                <th className="px-3 py-3 font-semibold text-xs border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Teacher</th>
                <th className="px-3 py-3 font-semibold text-xs whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="px-4 py-8 text-center text-slate-500 font-medium">Loading...</td></tr>
              ) : tableData.length > 0 ? tableData.map((row, index) => (
                <tr key={row._id} className="border-b border-slate-200 dark:border-gray-800/50 bg-[#f6f6ff] dark:bg-[#1f1b2e] hover:bg-slate-50 dark:bg-[#1f1b2e]/50 transition-colors">
                  <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-top">
                    {(currentPage - 1) * entriesPerPage + index + 1}
                  </td>
                  <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-top">
                    <div className="w-40 break-words text-slate-800 dark:text-slate-200 font-bold">{row.title}</div>
                  </td>
                  <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-top">
                    {row.class_date ? new Date(row.class_date).toLocaleDateString() : ''} <br/>
                    <span className="text-xs text-slate-500">{row.start_time}</span>
                  </td>
                  <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-top">{row.duration} mins</td>
                  <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-top">
                    <a href={row.meeting_link} target="_blank" rel="noreferrer" className="text-blue-700 font-bold hover:underline">Click Here To Join</a>
                  </td>
                  <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-top">
                    <div className="w-40 break-words uppercase text-slate-500 dark:text-slate-400 text-xs font-semibold">
                      {row.batch_id?.batch_name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-top">
                    {row.teacher_id?.member_name || row.teacher_id?.m_instructor_name || 'N/A'}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-row gap-2">
                      <Link 
                        to={`/live-classes/edit/${row._id}`}
                        className="inline-block bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors w-fit"
                      >
                        <Edit2 size={14} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(row._id)}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors w-fit"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-slate-500 font-medium">No records found matching the filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center text-sm text-slate-800 dark:text-slate-200">
           <div>
             Showing {Math.min((currentPage - 1) * entriesPerPage + 1, totalRecords)} to {Math.min(currentPage * entriesPerPage, totalRecords)} of {totalRecords} entries
           </div>
          <div className="flex items-center space-x-1">
            <button 
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`mr-2 ${currentPage === 1 ? 'text-slate-400 cursor-not-allowed' : 'text-slate-800 dark:text-slate-200 hover:text-stone-700 cursor-pointer'}`}
            >
              Pre
            </button>
            {getPageNumbers().map(pageNum => (
              <button 
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors ${currentPage === pageNum ? 'bg-stone-700 text-white shadow-sm' : 'hover:bg-slate-100 dark:bg-[#1f1b2e]/50 text-slate-600 dark:text-slate-400'}`}
              >
                {pageNum}
              </button>
            ))}
            <button 
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`ml-2 ${currentPage === totalPages ? 'text-slate-400 cursor-not-allowed' : 'text-slate-800 dark:text-slate-200 hover:text-stone-700 cursor-pointer'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
