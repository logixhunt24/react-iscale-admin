import { useState, useEffect } from 'react'
import { Edit2, Trash2, Eye, EyeOff } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function CouponsList() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(50)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      setLoading(true); 
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/myadmin/coupons/all`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data && response.data.data) {
        setData(response.data.data)
      } else {
        setData([])
      }
    } catch (error) {
      console.error('Failed to fetch coupons:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!await window.customConfirm('Are you sure you want to delete this coupon?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${BASE_URL}/myadmin/coupons/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchCoupons()
    } catch (error) {
      console.error('Delete failed:', error)
      await window.customAlert(error.response?.data?.message || 'Failed to delete')
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token')
      const url = `${BASE_URL}/myadmin/coupons/status/${id}`
      const config = { headers: { Authorization: `Bearer ${token}` } }
      
      try {
        await axios.put(url, {}, config)
      } catch (err) {
        if (err.response?.status === 404) {
          try { await axios.post(url, {}, config) } catch (err2) {
            if (err2.response?.status === 404) {
              try { await axios.patch(url, {}, config) } catch (err3) {
                if (err3.response?.status === 404) {
                  await axios.get(url, config)
                } else throw err3;
              }
            } else throw err2;
          }
        } else throw err;
      }
      fetchCoupons()
    } catch (error) {
      console.error('Status toggle failed:', error)
      if (error.response?.status === 404) {
        await window.customAlert("Status API Endpoint Not Found (404). Please ask your backend developer to verify the route for toggling status.")
      } else {
        await window.customAlert(error.response?.data?.message || 'Failed to update status')
      }
    }
  }

  const handleToggleVisibility = async (id, currentVis) => {
    try {
      const token = localStorage.getItem('token')
      const url = `${BASE_URL}/myadmin/coupons/visibility/${id}`
      const config = { headers: { Authorization: `Bearer ${token}` } }
      
      try {
        await axios.put(url, {}, config)
      } catch (err) {
        if (err.response?.status === 404) {
          try { await axios.post(url, {}, config) } catch (err2) {
            if (err2.response?.status === 404) {
              try { await axios.patch(url, {}, config) } catch (err3) {
                if (err3.response?.status === 404) {
                  await axios.get(url, config)
                } else throw err3;
              }
            } else throw err2;
          }
        } else throw err;
      }
      fetchCoupons()
    } catch (error) {
      console.error('Visibility toggle failed:', error)
      if (error.response?.status === 404) {
        await window.customAlert("Visibility API Endpoint Not Found (404). Please ask your backend developer to verify the route for toggling visibility.")
      } else {
        await window.customAlert(error.response?.data?.message || 'Failed to update visibility')
      }
    }
  }

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  const getField = (row, fieldNames) => {
    for (const name of fieldNames) {
      if (row[name] !== undefined && row[name] !== null) return row[name]
    }
    return '-'
  }

  const getCouponTypeLabel = (typeVal) => {
    const mapping = {
      '1': 'Course',
      '2': 'Notes',
      '3': 'Test Series'
    };
    return mapping[String(typeVal)] || typeVal || '-';
  };

  const filteredData = data.filter((row) => {
    if (!searchTerm) return true;
    
    const code = row.coupon_code || '';
    const title = row.coupon_title || '';
    const type = getCouponTypeLabel(row.coupon_type);
    
    const searchLower = searchTerm.toLowerCase();
    
    return (
      String(code).toLowerCase().includes(searchLower) ||
      String(title).toLowerCase().includes(searchLower) ||
      String(type).toLowerCase().includes(searchLower)
    );
  });

  const indexOfLastEntry = currentPage * entriesPerPage
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry)
  const TOTAL_ENTRIES = filteredData.length

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow border border-slate-100 overflow-hidden flex flex-col h-full w-full">
        {/* Header - Success Story Theme */}
        <div className="p-4 flex justify-between items-center bg-gradient-to-r from-[#144f36] to-[#1a6545] rounded-t-2xl">
          <div className="flex items-center">
            <div className="w-1.5 h-6 bg-white rounded-full mr-3"></div>
            <h2 className="text-xl font-bold text-white tracking-tight">Coupons List</h2>
          </div>
          <Link 
            to={'/master/coupons/add'}
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
                  className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] text-slate-700 rounded px-2 py-1 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
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
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={async (e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] text-slate-700 rounded-full px-4 py-1.5 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] w-64"
              />
            </div>
          </div>

          <div className="overflow-auto border border-slate-200 dark:border-gray-800/50 rounded-lg flex-1">
            <table className="w-full text-left text-sm text-slate-800 dark:text-slate-200">
              <thead className="bg-slate-50 dark:bg-[#13111c] text-slate-700 dark:text-slate-200 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 whitespace-nowrap">S.No.</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 whitespace-nowrap">Code</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 whitespace-nowrap">Title</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 whitespace-nowrap">Type</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 whitespace-nowrap">Discount</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 whitespace-nowrap">Start - End</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 whitespace-nowrap">Total / Used</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 whitespace-nowrap">Visibility</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 font-bold whitespace-nowrap text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="text-center py-8">Loading coupons...</td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-8">No coupons found</td>
                  </tr>
                ) : currentEntries.length === 0 && searchTerm ? (
                  <tr>
                    <td colSpan="10" className="text-center py-8">No matching coupons found</td>
                  </tr>
                ) : (
                  currentEntries.map((row, index) => {
                    const id = row._id || row.id;
                    const sno = indexOfFirstEntry + index + 1;
                    const code = row.coupon_code || '-';
                    const title = row.coupon_title || '-';
                    const type = getCouponTypeLabel(row.coupon_type);
                    const discountType = row.coupon_discount_type || 'flat';
                    const discount = row.coupon_discount || 0;
                    const startDate = row.coupon_start_date || '-';
                    const endDate = row.coupon_end_date || '-';
                    const total = row.total_coupon || 0;
                    const used = row.used_coupon || 0;
                    const isVisibleStr = row.coupon_visible || 'yes';
                    const statusStr = row.coupon_status || 'active';
                    
                    const isVisible = String(isVisibleStr).toLowerCase() === 'yes' || String(isVisibleStr).toLowerCase() === 'true' || isVisibleStr === 1 || String(isVisibleStr) === '1';
                    const isActive = String(statusStr).toLowerCase() === 'active' || String(statusStr).toLowerCase() === 'true' || statusStr === 1 || String(statusStr) === '1';

                    return (
                      <tr key={id} className="border-b border-slate-200 hover:bg-slate-50 bg-[#f6f6ff] transition-colors">
                        <td className="px-4 py-4 border-r border-slate-200 align-middle text-center">{sno}</td>
                        <td className="px-4 py-4 border-r border-slate-200 align-middle font-bold text-[#144f36]">{code}</td>
                        <td className="px-4 py-4 border-r border-slate-200 align-middle">{title}</td>
                        <td className="px-4 py-4 border-r border-slate-200 align-middle">{type}</td>
                        <td className="px-4 py-4 border-r border-slate-200 align-middle">
                           {discountType === 'Flat' || discountType === 'flat' ? '₹' : ''}{discount}{discountType === 'Percentage' || discountType === 'percentage' ? '%' : ''}
                        </td>
                        <td className="px-4 py-4 border-r border-slate-200 align-middle whitespace-nowrap text-xs">
                          <div className="flex flex-col">
                            <span>S: {startDate?.split('T')[0] || startDate}</span>
                            <span>E: {endDate?.split('T')[0] || endDate}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 border-r border-slate-200 align-middle text-center">
                          {total} / {used || 0}
                        </td>
                        <td className="px-4 py-4 border-r border-slate-200 align-middle text-center">
                          <button 
                            onClick={() => handleToggleVisibility(id, isVisible)}
                            className={`p-1.5 rounded-full transition-colors ${isVisible ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
                            title={isVisible ? "Visible" : "Hidden"}
                          >
                            {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                        </td>
                        <td className="px-4 py-4 border-r border-slate-200 align-middle text-center">
                          <button 
                            onClick={() => handleToggleStatus(id, isActive)}
                            className={`text-white px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors ${isActive ? 'bg-[#144f36] hover:bg-[#0f3d2a]' : 'bg-red-500 hover:bg-red-600'}`}
                          >
                            {isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-4 py-4 align-middle">
                          <div className="flex gap-2 justify-center">
                            <Link 
                              to={`/master/coupons/edit/${id}`} state={{ couponData: row }}
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

          <div className="mt-4 flex justify-between items-center text-sm text-slate-800">
            <div>Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, TOTAL_ENTRIES)} of {TOTAL_ENTRIES} entries</div>
            <div className="flex space-x-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100">1</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
