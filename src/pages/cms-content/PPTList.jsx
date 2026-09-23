import { useState, useEffect } from 'react'
import { Edit2, Trash2, Camera } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'
import ThemeButton from '../../components/common/ThemeButton'
import CardHeader from '../../components/ui/CardHeader'

export default function PPTList() {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(50)
  const [search, setSearch] = useState('')
  const [data, setData] = useState([])
  const [totalEntries, setTotalEntries] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [currentPage, entriesPerPage, search])

  const fetchData = async () => {
    try {
      setLoading(true); 
      const token = localStorage.getItem('token')
      const params = {
        page: currentPage,
        limit: entriesPerPage
      }
      if (search) params.search = search

      const response = await axios.get(`${BASE_URL}/myadmin/ppt/get-ppts`, {
        params,
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status) {
        setData(response.data.data || [])
        setTotalEntries(response.data.pagination?.total || response.data.total || 0)
      } else {
        setData([])
        setTotalEntries(0)
      }
    } catch (error) {
      console.error('Error fetching PPTs:', error)
      setData([])
      setTotalEntries(0)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!await window.customConfirm('Are you sure you want to delete this PPT?')) return
    try {
      const token = localStorage.getItem('token')
      const response = await axios.delete(`${BASE_URL}/myadmin/ppt/delete-ppt/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status) {
        await window.customAlert(response.data.message || 'Deleted successfully')
        fetchData()
      } else {
        await window.customAlert(response.data.message || 'Delete failed')
      }
    } catch (error) {
      console.error('Error deleting PPT:', error)
      await window.customAlert(error.response?.data?.message || 'Delete failed')
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.patch(`${BASE_URL}/myadmin/ppt/status/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status) {
        fetchData()
      } else {
        await window.customAlert(response.data?.message || 'Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      await window.customAlert('Error updating status')
    }
  }

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    const formattedPath = imagePath.replace(/\\/g, '/').replace(/^\//, '')
    const baseUrl = BASE_URL.replace(/\/api\/?$/, '')
    return `${baseUrl}/${formattedPath}`
  }

  const totalPages = Math.ceil(totalEntries / entriesPerPage) || 1

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow border border-slate-100 transition-colors overflow-hidden flex flex-col h-full min-h-0">
        <CardHeader title="Pre-Placement Talks">
          <ThemeButton variant="white-add" to={'/placement-talks/add'}>
            + Add New
          </ThemeButton>
        </CardHeader>

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

          <div className="overflow-auto border border-slate-200 dark:border-[#1f1b2e] flex-1 min-h-0">
            <table className="w-full text-left text-sm text-slate-800 dark:text-slate-200">
              <thead className="bg-slate-50 dark:bg-[#13111c] text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-gray-800">
                <tr>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">S.No.</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Image</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Company Logo</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Full Name</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Designation</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Company</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Video</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Order</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 font-bold whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="text-center py-8">Loading...</td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-8">No PPTs found</td>
                  </tr>
                ) : (
                  data.map((row, index) => (
                    <tr key={row._id} className="border-b border-slate-200 dark:border-gray-800/50 hover:bg-slate-50 dark:bg-[#1f1b2e]/50 bg-[#f6f6ff] dark:bg-[#1f1b2e]">
                      <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle">
                        {(currentPage - 1) * entriesPerPage + index + 1}
                      </td>
                      <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                        <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-700 flex flex-col items-center justify-center border border-slate-200 dark:border-[#1f1b2e] rounded overflow-hidden">
                          {row.m_pre_image ? (
                            <img src={getImageUrl(row.m_pre_image)} alt={row.m_pre_name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                          ) : null}
                          <div className={`flex flex-col items-center justify-center ${row.m_pre_image ? 'hidden' : ''}`}>
                            <Camera className="text-slate-600 dark:text-slate-400 mb-1" size={20} />
                            <span className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">No image<br/>available</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                        <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-700 flex flex-col items-center justify-center border border-slate-200 dark:border-[#1f1b2e] rounded overflow-hidden">
                          {row.m_pre_company_img ? (
                            <img src={getImageUrl(row.m_pre_company_img)} alt={row.m_pre_company} className="w-full h-full object-contain p-1" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                          ) : null}
                          <div className={`flex flex-col items-center justify-center ${row.m_pre_company_img ? 'hidden' : ''}`}>
                            <Camera className="text-slate-600 dark:text-slate-400 mb-1" size={20} />
                            <span className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">No image<br/>available</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle font-medium text-slate-900 dark:text-slate-100">{row.m_pre_name}</td>
                      <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle">{row.m_pre_designation || '-'}</td>
                      <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle">{row.m_pre_company || '-'}</td>
                      <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                        {row.m_pre_video_link ? (
                          <a href={row.m_pre_video_link} target="_blank" rel="noreferrer" className="text-white bg-[#144f36] px-3 py-1 rounded-full text-xs hover:bg-[#0f3d2a] transition-colors inline-block whitespace-nowrap shadow-sm">
                            Watch Video
                          </a>
                        ) : (
                          <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">No Link</span>
                        )}
                      </td>
                      <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                        {row.m_pre_order || 0}
                      </td>
                      <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                        <button 
                          onClick={() => handleToggleStatus(row._id)}
                          className={`text-white px-3 py-1 rounded-full text-xs transition-colors shadow-sm ${row.m_pre_status === 'active' || String(row.m_pre_status) === '1' ? 'bg-[#144f36] hover:bg-[#0f3d2a]' : 'bg-red-500 hover:bg-red-600'}`}
                        >
                          {row.m_pre_status === 'active' || String(row.m_pre_status) === '1' ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <div className="flex gap-2">
                          <Link 
                            to={`/placement-talks/edit/${row._id}`} state={{ ppt: row }}
                            className="inline-block bg-orange-500 text-white p-1.5 rounded hover:bg-orange-600 transition-colors shadow-sm"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(row._id)}
                            className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600 transition-colors shadow-sm"
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

          <div className="mt-4 flex flex-col md:flex-row justify-between items-center text-sm text-slate-800 dark:text-slate-200">
            <div className="mb-4 md:mb-0">
              Showing {data.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} to {Math.min(currentPage * entriesPerPage, totalEntries)} of {totalEntries} entries
            </div>
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-slate-50 dark:bg-[#13111c] disabled:opacity-50 border border-slate-200 dark:border-slate-700"
              >
                Prev
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-[#144f36] text-white shadow-sm">
                {currentPage}
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-slate-50 dark:bg-[#13111c] disabled:opacity-50 border border-slate-200 dark:border-slate-700"
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
