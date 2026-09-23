import { useState, useEffect } from 'react'
import { Edit2, Trash2, Camera } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'
import ThemeButton from '../../components/common/ThemeButton'
import CardHeader from '../../components/ui/CardHeader'

export default function SuccessStoryList() {
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

      const response = await axios.get(`${BASE_URL}/myadmin/success-story/all-ss`, {
        params,
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status) {
        setData(response.data.data || [])
        setTotalEntries(response.data.total || 0)
      } else {
        setData([])
        setTotalEntries(0)
      }
    } catch (error) {
      console.error('Error fetching success stories:', error)
      setData([])
      setTotalEntries(0)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!await window.customConfirm('Are you sure you want to delete this success story?')) return
    try {
      const token = localStorage.getItem('token')
      const response = await axios.delete(`${BASE_URL}/myadmin/success-story/delete-ss/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status) {
        await window.customAlert(response.data.message || 'Deleted successfully')
        fetchData()
      } else {
        await window.customAlert(response.data.message || 'Delete failed')
      }
    } catch (error) {
      console.error('Error deleting success story:', error)
      await window.customAlert(error.response?.data?.message || 'Delete failed')
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
        <CardHeader title="Success Story List">
          <ThemeButton variant="white-add" to={'/success-story/add'}>
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
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Full Name</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Designation</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Placed At</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Package</th>
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
                    <td colSpan="10" className="text-center py-8">No success stories found</td>
                  </tr>
                ) : (
                  data.map((row, index) => (
                    <tr key={row._id} className="border-b border-slate-200 dark:border-gray-800/50 hover:bg-slate-50 dark:bg-[#1f1b2e]/50 bg-[#f6f6ff] dark:bg-[#1f1b2e]">
                      <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-top">
                        {(currentPage - 1) * entriesPerPage + index + 1}
                      </td>
                      <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-top text-center">
                        <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-700 flex flex-col items-center justify-center border border-slate-200 dark:border-[#1f1b2e]">
                          {row.m_ss_image ? (
                            <img src={getImageUrl(row.m_ss_image)} alt={row.m_ss_name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                          ) : null}
                          <div className={`flex flex-col items-center justify-center ${row.m_ss_image ? 'hidden' : ''}`}>
                            <Camera className="text-slate-600 dark:text-slate-400 mb-1" size={20} />
                            <span className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">No image<br/>available</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-top w-40">{row.m_ss_name}</td>
                      <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-top w-32">{row.m_ss_designation || '-'}</td>
                      <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-top w-32">{row.m_ss_placed || '-'}</td>
                      <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-top w-32">{row.m_ss_package || '-'}</td>
                      <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-top text-center">
                        {(row.m_ss_youtube_url || row.m_ss_video) ? (
                          <a href={row.m_ss_youtube_url || row.m_ss_video} target="_blank" rel="noreferrer" className="bg-slate-50 dark:bg-[#13111c] text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-gray-800 px-4 py-1.5 rounded-full text-xs hover:bg-[#152a4a] transition-colors inline-block">
                            Link
                          </a>
                        ) : (
                          <span className="text-xs text-slate-500">No Link</span>
                        )}
                      </td>
                      <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-top">
                        {row.m_ss_order || 0}
                      </td>
                      <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-top text-center">
                        <span className={`text-white px-4 py-1.5 rounded-full text-xs transition-colors ${row.m_ss_status === 'active' || String(row.m_ss_status) === '1' ? 'bg-[#144f36]' : 'bg-red-500'}`}>
                          {row.m_ss_status === 'active' || String(row.m_ss_status) === '1' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex gap-2">
                          <Link 
                            to={`/success-story/edit/${row._id}`} state={{ story: row }}
                            className="inline-block bg-orange-500 text-white p-1.5 rounded hover:bg-orange-600 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </Link>
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

          <div className="mt-4 flex flex-col md:flex-row justify-between items-center text-sm text-slate-800 dark:text-slate-200">
            <div className="mb-4 md:mb-0">
              Showing {data.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} to {Math.min(currentPage * entriesPerPage, totalEntries)} of {totalEntries} entries
            </div>
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-slate-50 dark:bg-[#13111c] disabled:opacity-50"
              >
                Prev
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#144f36] text-white">
                {currentPage}
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-slate-50 dark:bg-[#13111c] disabled:opacity-50"
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
