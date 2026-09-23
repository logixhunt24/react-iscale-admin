import { useState, useEffect } from 'react'
import { Edit2, Trash2, Camera } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function EventCategoryList() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(50)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/myadmin/event-category/get-event-categories`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status || response.data?.success) {
        setData(response.data.data || response.data.categories || response.data.eventCategories || [])
      } else {
        setData(response.data || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (id) => {
    if (!await window.customConfirm('Are you sure you want to delete this category?')) return;
    try {
      const token = localStorage.getItem('token')
      const response = await axios.delete(`${BASE_URL}/myadmin/event-category/delete-event-category/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status || response.data?.success || response.data?.msg) {
        fetchData()
      } else {
        await window.customAlert(response.data?.message || response.data?.msg || 'Delete failed')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      await window.customAlert(error.response?.data?.message || error.response?.data?.msg || 'Delete failed')
    }
  }

  const getField = (row, possibleKeys) => {
    for (const key of possibleKeys) {
      if (row[key] !== undefined && row[key] !== null) return row[key];
    }
    return '-';
  }

  const filteredData = data.filter(row => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const title = getField(row, ['m_ec_title', 'm_event_category_name', 'name', 'title', 'categoryName']) || '';
    const keyword = getField(row, ['m_ec_keyword', 'm_event_category_keyword', 'keyword']) || '';
    return String(title).toLowerCase().includes(searchLower) || String(keyword).toLowerCase().includes(searchLower);
  });

  const TOTAL_ENTRIES = filteredData.length
  const totalPages = Math.ceil(TOTAL_ENTRIES / entriesPerPage) || 1
  const activePage = Math.min(currentPage, totalPages) || 1

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  const indexOfLastEntry = activePage * entriesPerPage
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry)

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow border border-slate-100 transition-colors overflow-hidden flex flex-col h-full w-full">
        <div className="p-4 flex justify-between items-center bg-gradient-to-r from-[#144f36] to-[#1a6545] rounded-t-2xl">
          <div className="flex items-center">
            <div className="w-1.5 h-6 bg-white rounded-full mr-3"></div>
            <h2 className="text-xl font-bold text-white tracking-tight">Event Category List</h2>
          </div>
          <Link 
            to={'/events/category/add'}
            className="bg-white text-[#144f36] px-5 py-2 rounded-full flex items-center gap-2 text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
          >
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
                  className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 bg-[#f6f6ff] dark:bg-[#1f1b2e]"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-slate-800 dark:text-slate-200">Entries</span>
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
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Search..."
                value={searchTerm}
                onChange={async (e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded-full px-4 py-1.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 w-64"
              />
            </div>
          </div>

          <div className="overflow-auto border border-slate-200 dark:border-[#1f1b2e] flex-1">
            <table className="w-full text-left text-sm text-slate-800 dark:text-slate-200">
              <thead className="bg-slate-50 dark:bg-[#13111c] text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-gray-800">
                <tr>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">
                    <div className="flex items-center justify-between">
                      S.No.
                      <span className="text-[10px] flex flex-col leading-[0.5]"><span className="text-white/50">▲</span><span>▼</span></span>
                    </div>
                  </th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">
                    <div className="flex items-center justify-between">
                      Title
                      <span className="text-[10px] flex flex-col leading-[0.5]"><span className="text-white/50">▲</span><span>▼</span></span>
                    </div>
                  </th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Icon</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Banner</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">
                    <div className="flex items-center justify-between">
                      Keyword
                      <span className="text-[10px] flex flex-col leading-[0.5]"><span className="text-white/50">▲</span><span>▼</span></span>
                    </div>
                  </th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Order</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 font-bold whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-8">Loading...</td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-8">No categories found</td>
                  </tr>
                ) : (
                  currentEntries.map((row, index) => {
                    const id = row._id || row.id;
                    const title = getField(row, ['m_ec_title', 'm_event_category_name', 'name', 'title', 'categoryName']);
                    const keyword = getField(row, ['m_ec_keyword', 'm_event_category_keyword', 'keyword']);
                    const order = getField(row, ['m_ec_order', 'm_event_category_order', 'order']);
                    const icon = getField(row, ['m_ec_icon', 'm_event_category_icon', 'icon']);
                    const banner = getField(row, ['m_ec_banner', 'm_event_category_banner', 'banner']);
                    const statusStr = getField(row, ['m_ec_status', 'm_event_category_status', 'status']);
                    const status = statusStr !== '-' ? String(statusStr) : '1';
                    const sno = indexOfFirstEntry + index + 1;

                    return (
                      <tr key={id || index} className="border-b border-slate-200 dark:border-gray-800/50 hover:bg-slate-50 dark:bg-[#1f1b2e]/50 bg-[#f6f6ff] dark:bg-[#1f1b2e]">
                        <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">{sno}</td>
                        <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle whitespace-nowrap">{title}</td>
                        <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                          {icon && icon !== '-' ? (
                            <img 
                              src={icon.startsWith('http') ? icon : `${BASE_URL.replace(/\/api\/?$/, '')}/${icon.replace(/\\/g, '/').replace(/^src\//, '')}`} 
                              alt="Icon"
                              className="w-8 h-8 object-cover mx-auto rounded"
                              onError={(e) => { e.target.style.display = 'none' }}
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-slate-600 dark:text-slate-400">
                              <Camera size={24} />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                          {banner && banner !== '-' ? (
                            <img 
                              src={banner.startsWith('http') ? banner : `${BASE_URL.replace(/\/api\/?$/, '')}/${banner.replace(/\\/g, '/').replace(/^src\//, '')}`} 
                              alt="Banner"
                              className="w-16 h-8 object-cover mx-auto rounded"
                              onError={(e) => { e.target.style.display = 'none' }}
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-slate-600 dark:text-slate-400">
                              <Camera size={24} />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle">{keyword}</td>
                        <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                          {order}
                        </td>
                        <td className="px-4 py-4 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                          <button className={`text-white px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${status.toLowerCase() === 'active' || status === '1' ? 'bg-[#144f36] hover:bg-[#0f3d2a]' : 'bg-red-500 hover:bg-red-600'}`}>
                            {status.toLowerCase() === 'active' || status === '1' ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-4 py-4 align-middle">
                          <div className="flex gap-2 justify-center">
                            <Link 
                              to={`/events/category/edit/${id}`} state={{ categoryData: row }}
                              className="inline-block bg-orange-500 text-white p-1.5 rounded hover:bg-orange-600 transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </Link>
                            <button 
                              onClick={() => handleDelete(id)}
                              className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col md:flex-row justify-between items-center text-sm text-slate-800 dark:text-slate-200">
            <div className="mb-4 md:mb-0">
              Showing {TOTAL_ENTRIES > 0 ? indexOfFirstEntry + 1 : 0} to {Math.min(indexOfLastEntry, TOTAL_ENTRIES)} of {TOTAL_ENTRIES} entries
            </div>
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={activePage === 1}
                className="px-3 py-1 rounded bg-slate-50 dark:bg-[#13111c] disabled:opacity-50 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Prev
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-[#144f36] text-white shadow-sm font-medium text-xs">
                {activePage}
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={activePage === totalPages}
                className="px-3 py-1 rounded bg-slate-50 dark:bg-[#13111c] disabled:opacity-50 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
