import { useState, useEffect } from 'react'
import { Edit2, Trash2, Camera } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'
import { getImageUrl } from '../../utils/imageUtils'

export default function HiringDestinationsList() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [entriesPerPage, setEntriesPerPage] = useState(50)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalEntries, setTotalEntries] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/myadmin/hiring-destination/get-all`, {
        params: { page: currentPage, limit: entriesPerPage },
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status) {
        setData(response.data.data || [])
        setTotalEntries(response.data.pagination?.total || 0)
        setTotalPages(response.data.pagination?.totalPages || 1)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [currentPage, entriesPerPage])

  const handleDelete = async (id) => {
    if (!await window.customConfirm('Are you sure you want to delete this logo?')) return
    try {
      const token = localStorage.getItem('token')
      const response = await axios.delete(`${BASE_URL}/myadmin/hiring-destination/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status) {
        fetchData()
      } else {
        await window.customAlert(response.data?.message || 'Delete failed')
      }
    } catch (err) {
      console.error(err)
      await window.customAlert('Error deleting')
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.patch(`${BASE_URL}/myadmin/hiring-destination/status/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status) {
        fetchData()
      } else {
        await window.customAlert(response.data?.message || 'Failed to update status')
      }
    } catch (err) {
      console.error(err)
      await window.customAlert('Error updating status')
    }
  }

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
            <h2 className="text-white font-bold tracking-wide text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">Prime Hiring Destinations</h2>
          </div>

          <div className="flex gap-2 relative z-10">
            <button
              onClick={() => navigate('/career-fit')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-5 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all flex items-center gap-2 hover:-translate-y-0.5"
            >
              <span>« Career Fit</span>
            </button>
            <button
              onClick={() => navigate('/career-fit/hiring-destinations/add')}
              className="bg-white hover:bg-slate-50 text-[#144f36] px-5 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all flex items-center gap-2 hover:shadow hover:-translate-y-0.5"
            >
              <span>+ Add Logo</span>
            </button>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-4">
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

          <div className="overflow-auto border border-slate-200 dark:border-[#1f1b2e] flex-1 min-h-0">
            <table className="w-full text-left text-sm text-slate-800 dark:text-slate-200">
              <thead className="bg-slate-50 dark:bg-[#13111c] text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-gray-800">
                <tr>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">S.No.</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Logo</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Name</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Order</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap text-center">Status</th>
                  <th className="px-4 py-3 font-bold whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-4">No logos found</td></tr>
                ) : (
                  data.map((row, index) => (
                    <tr key={row._id} className="border-b border-slate-200 dark:border-gray-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle">
                        {(currentPage - 1) * entriesPerPage + index + 1}
                      </td>
                      <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle">
                        <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-700 flex flex-col items-center justify-center border border-slate-200 dark:border-[#1f1b2e]">
                          {row.m_phd_logo ? (
                            <img src={getImageUrl(row.m_phd_logo)} alt={row.m_phd_name} className="w-full h-full object-contain" />
                          ) : (
                            <div className="flex flex-col items-center justify-center">
                              <Camera className="text-slate-600 dark:text-slate-400 mb-1" size={20} />
                              <span className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">No image</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle font-medium">
                        {row.m_phd_name || '-'}
                      </td>
                      <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle">
                        {row.m_phd_order ?? 0}
                      </td>
                      <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                        <button
                          onClick={() => handleToggleStatus(row._id)}
                          className={`text-white px-3 py-1.5 rounded-full text-xs transition-colors ${row.m_phd_status === 1 ? 'bg-[#144f36]' : 'bg-red-500'}`}
                        >
                          {row.m_phd_status === 1 ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/career-fit/hiring-destinations/edit/${row._id}`, { state: { destination: row } })}
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
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col md:flex-row justify-between items-center text-sm text-slate-600 dark:text-slate-400">
            <div className="mb-4 md:mb-0">
              Showing {Math.min((currentPage - 1) * entriesPerPage + 1, totalEntries)} to {Math.min(currentPage * entriesPerPage, totalEntries)} of {totalEntries} entries
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-white dark:bg-[#13111c] border border-slate-200 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                Prev
              </button>
              <span className="px-3 py-1 bg-[#144f36] text-white rounded">{currentPage}</span>
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
