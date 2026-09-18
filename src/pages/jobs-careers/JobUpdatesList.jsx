import { useState, useEffect } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'
import { getImageUrl } from '../../utils/imageUtils'

export default function JobUpdatesList() {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(50)
  const [jobsData, setJobsData] = useState([])
  const [totalEntries, setTotalEntries] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const fetchJobs = async () => {
    try {
      setLoading(true); 
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/myadmin/comp-requirement/get-all-jobs`, {
        params: {
          page: currentPage,
          limit: entriesPerPage,
          search: search || undefined
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.data && response.data.status) {
        setJobsData(response.data.data)
        if (response.data.pagination) {
          setTotalEntries(response.data.pagination.total)
          setTotalPages(response.data.pagination.totalPages)
        }
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (await window.customConfirm('Are you sure you want to delete this job?')) {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.delete(`${BASE_URL}/myadmin/comp-requirement/delete-job/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (response.data && response.data.status) {
          fetchJobs()
        }
      } catch (error) {
        console.error('Error deleting job:', error)
        await window.customAlert('Failed to delete job')
      }
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.patch(`${BASE_URL}/myadmin/comp-requirement/status/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.data && response.data.status) {
        fetchJobs()
      } else {
        await window.customAlert(response.data?.message || 'Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      await window.customAlert('Error updating status')
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs()
    }, 300)
    return () => clearTimeout(timer)
  }, [currentPage, entriesPerPage, search])

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  return (
    <div className="h-full animate-fade-in-up flex flex-col min-h-0">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow border border-slate-100 transition-colors overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="bg-[#144f36] rounded-t-2xl p-5 flex justify-between items-center shadow-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white dark:bg-[#13111c]/10 rounded-full blur-2xl group-hover:bg-white dark:bg-[#13111c]/20 transition-all duration-700 pointer-events-none"></div>
          
          <div className="flex items-center relative z-10">
            <div className="w-1.5 h-7 bg-white dark:bg-[#13111c]/90 rounded-full mr-4 shadow-[0_0_12px_rgba(255,255,255,0.9)] hidden sm:block"></div>
            <h2 className="text-white font-bold tracking-wide text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">Job Update List</h2>
          </div>
          
          <button 
            onClick={() => navigate('/job-updates/add')}
            className="bg-white hover:bg-slate-50 text-[#144f36] px-5 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all flex items-center gap-2 relative z-10 hover:shadow hover:-translate-y-0.5"
          >
            <span>+ Add New</span>
          </button>
        </div>

        <div className="p-4 flex-1 flex flex-col min-h-0">
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
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded-full px-4 py-1.5 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] w-64"
              />
            </div>
          </div>

          <div className="overflow-auto border border-slate-200 dark:border-[#1f1b2e] flex-1 min-h-0 relative">
            <table className="w-full text-left text-sm text-slate-800 dark:text-slate-200">
              <thead className="bg-slate-50 dark:bg-[#13111c] text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-gray-800 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">S.No.</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Title</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Logo</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Company</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Location</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Experience</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Salary</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap text-center">Status</th>
                  <th className="px-4 py-3 font-bold whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="9" className="text-center py-8 text-slate-500">Loading...</td></tr>
                ) : jobsData.length === 0 ? (
                  <tr><td colSpan="9" className="text-center py-8 text-slate-500">No jobs found</td></tr>
                ) : jobsData.map((row, index) => (
                  <tr key={row._id} className="border-b border-slate-200 dark:border-gray-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                      {(currentPage - 1) * entriesPerPage + index + 1}
                    </td>
                    <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle w-48 font-medium">{row.job_title}</td>
                    <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                      {row.company_logo ? (
                        <img
                          src={getImageUrl(row.company_logo)}
                          alt={row.company_name || 'Company logo'}
                          className="w-12 h-12 mx-auto rounded object-cover"
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                      ) : null}
                      <div
                        className="w-12 h-12 mx-auto items-center justify-center font-bold text-[#144f36] bg-[#144f36]/10 text-xl rounded"
                        style={{ display: row.company_logo ? 'none' : 'flex' }}
                      >
                        {row.company_name ? row.company_name.charAt(0).toUpperCase() : 'C'}
                      </div>
                    </td>
                    <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle">{row.company_name}</td>
                    <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle w-32">{row.job_locations?.join(', ')}</td>
                    <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle whitespace-nowrap">
                      {row.experience?.min}-{row.experience?.max} {row.experience?.label || row.experience?.unit}
                    </td>
                    <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle w-32">
                      {row.salary?.min}-{row.salary?.max}
                    </td>
                    <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                      {(() => {
                        const s1 = row.status;
                        const s2 = row.job_status;
                        const s3 = row.m_job_status;
                        const s4 = row.is_active;
                        const s5 = row.isActive;
                        
                        const hasNoStatus = s1 === undefined && s2 === undefined && s3 === undefined && s4 === undefined && s5 === undefined;
                        
                        const isActive = hasNoStatus ||
                          (s1 && (s1.toString().toLowerCase() === 'active' || s1.toString() === '1' || s1 === true)) ||
                          (s2 && (s2.toString().toLowerCase() === 'active' || s2.toString() === '1' || s2 === true)) ||
                          (s3 && (s3.toString().toLowerCase() === 'active' || s3.toString() === '1' || s3 === true)) ||
                          (s4 && (s4.toString().toLowerCase() === 'active' || s4.toString() === '1' || s4 === true)) ||
                          (s5 && (s5.toString().toLowerCase() === 'active' || s5.toString() === '1' || s5 === true));

                        return (
                          <button 
                            onClick={() => handleToggleStatus(row._id)}
                            className={`text-white px-4 py-1.5 rounded-full text-xs transition-colors ${isActive ? 'bg-[#144f36] hover:bg-[#0f3d2a]' : 'bg-red-500 hover:bg-red-600'}`}
                          >
                            {isActive ? 'Active' : 'Inactive'}
                          </button>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => navigate(`/job-updates/edit/${row._id}`, { state: { jobData: row } })}
                          className="bg-orange-500 text-white p-1.5 rounded hover:bg-orange-600 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(row._id)}
                          className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="mb-4 sm:mb-0">
              Showing {jobsData.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} to {Math.min(currentPage * entriesPerPage, totalEntries)} of {totalEntries} entries
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-white dark:bg-[#13111c] border border-slate-200 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                Prev
              </button>
              <span className="px-3 py-1 bg-[#144f36] text-white rounded">
                {currentPage}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 rounded bg-white dark:bg-[#13111c] border border-slate-200 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
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
