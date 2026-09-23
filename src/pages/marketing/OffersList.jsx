import { useState, useEffect } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function OffersList() {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ totalRecords: 0, totalPages: 1 })

  const fetchOffers = async () => {
    try {
      setLoading(true); 
      const token = localStorage.getItem('token')
      const res = await axios.get(`${BASE_URL}/myadmin/offers/all?page=${currentPage}&limit=${entriesPerPage}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.status) {
        setData(res.data.data)
        setPagination(res.data.pagination)
      }
    } catch (err) {
      console.error(err)
      await window.customAlert(err.response?.data?.message || 'Failed to fetch offers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOffers()
  }, [currentPage, entriesPerPage])

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.patch(`${BASE_URL}/myadmin/offers/status/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.status) {
        fetchOffers()
      }
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Failed to update status')
    }
  }

  const handleDelete = async (id) => {
    if (!await window.customConfirm('Are you sure you want to delete this offer?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await axios.delete(`${BASE_URL}/myadmin/offers/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.status) {
        fetchOffers()
      }
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Failed to delete offer')
    }
  }

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow border border-slate-100 transition-colors overflow-hidden flex flex-col h-full">
        <div className="p-4 flex justify-between items-center bg-[#144f36] dark:bg-[#0f3d2a] rounded-t-2xl">
          <h2 className="text-xl font-bold tracking-tight text-white">Offers List</h2>
          <Link to={'/offers/add'} className="bg-white text-[#144f36] px-4 py-2 rounded-full text-sm font-bold hover:bg-slate-100 transition-colors flex items-center gap-2 shadow-sm">
            <span>+ Add New</span>
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
                  className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                >
                  <option value={5}>5</option>
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
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">S.No.</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Offer Title</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Priority</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Images</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Description</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">URI</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 font-bold whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="8" className="px-4 py-8 text-center">Loading...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan="8" className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">No Data Available In Table</td></tr>
                ) : data.map((item, index) => (
                  <tr key={item._id} className="border-b border-slate-200 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-[#1f1b2e]/50">
                    <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50">{(currentPage - 1) * entriesPerPage + index + 1}</td>
                    <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 font-medium">{item.m_offer_title}</td>
                    <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50">{item.m_offer_priority}</td>
                    <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50">
                      {item.m_offer_image ? <img src={`${BASE_URL}/${item.m_offer_image.replace(/\\/g, '/')}`} alt="offer" className="h-10 object-cover rounded" /> : 'N/A'}
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 max-w-[200px] truncate" title={item.m_offer_des}>{item.m_offer_des || 'N/A'}</td>
                    <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 max-w-[150px] truncate"><a href={item.m_offer_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{item.m_offer_url || 'N/A'}</a></td>
                    <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50">
                      <button 
                        onClick={() => handleToggleStatus(item._id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${item.m_offer_status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                      >
                        {item.m_offer_status === 1 ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link to={`/offers/edit/${item._id}`} className="inline-block p-1.5 bg-[#d87025] text-white rounded hover:bg-[#b55d1f] transition-colors shadow-sm" title="Edit"><Edit2 size={16} /></Link>
                        <button onClick={() => handleDelete(item._id)} className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors shadow-sm" title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center text-sm text-slate-800 dark:text-slate-200">
            <div>
              Showing {data.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} to {Math.min(currentPage * entriesPerPage, pagination.totalRecords)} of {pagination.totalRecords} entries
            </div>
            <div className="flex gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button 
                disabled={currentPage === pagination.totalPages || pagination.totalPages === 0}
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50"
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
