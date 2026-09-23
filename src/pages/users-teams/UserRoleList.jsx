import { useState, useEffect } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

import { useNavigate, Link } from 'react-router-dom'

export default function UserRoleList() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(50)
  const [searchTerm, setSearchTerm] = useState('')

  // Debug banner toggle
  const [showDebug, setShowDebug] = useState(false)

  // Removed unused form state

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true); 
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/myadmin/auth/all`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      let resData = response.data?.data || response.data;
      let finalData = [];
      
      if (Array.isArray(resData)) {
        finalData = resData;
      } else if (resData && typeof resData === 'object') {
        const possibleArray = Object.values(resData).find(val => Array.isArray(val));
        if (possibleArray) {
          finalData = possibleArray;
        } else if (resData._id || resData.id) {
          finalData = [resData];
        } else {
          finalData = [];
        }
      }
      
      setData(finalData)
    } catch (error) {
      console.error('Failed to fetch users:', error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!await window.customConfirm('Are you sure you want to delete this user?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${BASE_URL}/myadmin/auth/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchUsers()
      if (false) { // Just to keep block if needed
        // resetForm() removed
      }
    } catch (error) {
      console.error('Delete failed:', error)
      await window.customAlert(error.response?.data?.message || 'Failed to delete')
    }
  }

  const handleToggleStatus = async (row, currentIsActive) => {
    try {
      const id = row._id || row.id;
      const token = localStorage.getItem('token')
      const newStatus = currentIsActive ? 0 : 1
      
      const formPayload = new FormData()
      formPayload.append('kh_status', newStatus)
      formPayload.append('status', newStatus) // Send both just in case!
      
      // Pass existing fields just in case update API requires them to commit
      const adminName = getField(row, ['kh_admin_name', 'm_admin_name', 'admin_name', 'user_name', 'name'], 'Unknown User');
      const phone = getField(row, ['kh_admin_phone', 'm_contact_no', 'contact_no', 'phone', 'contact', 'mobile'], '-');
      const email = getField(row, ['kh_admin_email', 'm_email', 'email', 'login_id'], '');
      const role = getField(row, ['kh_role', 'm_role', 'role', 'permission'], 1);
      
      formPayload.append('kh_admin_name', adminName)
      formPayload.append('kh_admin_phone', Number(phone))
      formPayload.append('kh_admin_email', email)
      formPayload.append('kh_role', role)
      
      formPayload.append('admin_name', adminName) // Fallbacks
      formPayload.append('phone', Number(phone)) 

      const res = await axios.put(`${BASE_URL}/myadmin/auth/update/${id}`, formPayload, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      console.log("TOGGLE SUCCESS", res.data)
      await window.customAlert(`Backend Success: ${res.data.message || 'Status Updated'}\nWait for refresh...`)
      
      fetchUsers()
    } catch (error) {
      console.log("TOGGLE ERROR", error)
      if (error.response) {
         console.log("TOGGLE BACKEND ERROR", error.response.data)
      }
      const msg = error.response?.data?.message || 'Failed to update status'
      await window.customAlert(`Toggle Error: ${msg}\nCheck F12 Console for details.`)
    }
  }

  const getField = (row, fieldNames, defaultVal = '') => {
    for (const name of fieldNames) {
      if (row[name] !== undefined && row[name] !== null) return row[name]
    }
    return defaultVal
  }

  const handleEditClick = (row) => {
    const id = row._id || row.id;
    navigate(`/user-role/edit/${id}`)
  }

  const handleAddNewClick = () => {
    navigate('/user-role/add')
  }

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  const filteredData = data.filter((row) => {
    if (!searchTerm) return true;
    
    const adminName = getField(row, ['kh_admin_name', 'm_admin_name', 'admin_name', 'user_name', 'name'], 'Unknown User');
    const email = getField(row, ['kh_admin_email', 'm_email', 'email', 'login_id', 'email_address'], '-');
    const loginId = getField(row, ['kh_username', 'kh_login_id', 'login_id', 'email'], '-');
    const phone = getField(row, ['kh_admin_phone', 'm_contact_no', 'contact_no', 'phone', 'contact', 'mobile'], '-');
    const role = getField(row, ['kh_role', 'm_role', 'role', 'permission'], 'Permission');
    
    const searchLower = searchTerm.toLowerCase();
    
    return (
      String(adminName).toLowerCase().includes(searchLower) ||
      String(email).toLowerCase().includes(searchLower) ||
      String(loginId).toLowerCase().includes(searchLower) ||
      String(phone).toLowerCase().includes(searchLower) ||
      String(role).toLowerCase().includes(searchLower)
    );
  });

  const indexOfLastEntry = currentPage * entriesPerPage
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry)
  const TOTAL_ENTRIES = filteredData.length

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return dateStr
      return date.toLocaleDateString('en-GB')
    } catch (e) {
      return dateStr
    }
  }

  return (
    <div className="h-full animate-fade-in-up flex flex-col">


      <div className="bg-[#f6f6ff] rounded-2xl shadow-md border border-slate-100 flex flex-col h-full w-full overflow-hidden">
        {/* Header - Success Story Theme */}
        <div className="p-4 flex justify-between items-center bg-gradient-to-r from-[#144f36] to-[#1a6545]">
          <div className="flex items-center">
            <div className="w-1.5 h-6 bg-white rounded-full mr-3"></div>
            <h2 className="text-xl font-bold text-white tracking-tight">All Users List</h2>
          </div>
          <Link 
            to="/user-role/add"
            className="bg-white text-[#144f36] px-5 py-2 rounded-full flex items-center gap-2 text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <span>+ Add New User</span>
          </Link>
        </div>

        <div className="p-4 flex-1 flex flex-col lg:flex-row gap-6 overflow-y-auto">
          
          {/* LEFT PANEL: TABLE */}
          <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">Show</span>
                <select 
                  value={entriesPerPage}
                  onChange={handleEntriesChange}
                  className="border border-slate-300 bg-white text-slate-700 rounded px-2 py-1.5 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm font-medium text-slate-700">Entries</span>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={async (e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="border border-slate-300 bg-white text-slate-700 rounded-full px-4 py-1.5 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] w-full sm:w-64 shadow-inner"
                />
              </div>
            </div>

            <div className="overflow-x-auto flex-1 min-h-[400px]">
              <table className="w-full text-left text-sm text-slate-800">
                <thead className="bg-[#1b3d58] text-white">
                  <tr>
                    <th className="px-4 py-3 font-bold border-r border-slate-600 whitespace-nowrap">Sn.</th>
                    <th className="px-4 py-3 font-bold border-r border-slate-600 whitespace-nowrap">User Name</th>
                    <th className="px-4 py-3 font-bold border-r border-slate-600 whitespace-nowrap">Permission</th>
                    <th className="px-4 py-3 font-bold border-r border-slate-600 whitespace-nowrap">Login ID</th>
                    <th className="px-4 py-3 font-bold border-r border-slate-600 whitespace-nowrap">Contact No.</th>
                    <th className="px-4 py-3 font-bold border-r border-slate-600 whitespace-nowrap">Email</th>
                    <th className="px-4 py-3 font-bold border-r border-slate-600 whitespace-nowrap">Added On</th>
                    <th className="px-4 py-3 font-bold border-r border-slate-600 whitespace-nowrap">Status</th>
                    <th className="px-4 py-3 font-bold whitespace-nowrap text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="9" className="text-center py-8">Loading users...</td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-8">No users found</td>
                    </tr>
                  ) : filteredData.length === 0 && searchTerm ? (
                    <tr>
                      <td colSpan="9" className="text-center py-8">No matching users found</td>
                    </tr>
                  ) : currentEntries.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-8">No valid entries for this page</td>
                    </tr>
                  ) : (
                    currentEntries.map((row, index) => {3
                      if (!row || typeof row !== 'object') return null;
                      
                      const id = row._id || row.id || `fallback-${index}`;
                      const sno = indexOfFirstEntry + index + 1;
                      const adminName = getField(row, ['kh_admin_name', 'm_admin_name', 'admin_name', 'user_name', 'name'], 'Unknown User');
                      const email = getField(row, ['kh_admin_email', 'm_email', 'email', 'login_id', 'email_address'], '-');
                      const loginId = getField(row, ['kh_username', 'kh_login_id', 'login_id', 'email'], '-');
                      const phone = getField(row, ['kh_admin_phone', 'm_contact_no', 'contact_no', 'phone', 'contact', 'mobile'], '-');
                      const role = getField(row, ['kh_role', 'm_role', 'role', 'permission'], 'Permission');
                      const addedOn = getField(row, ['kh_added_on', 'added_on', 'createdAt', 'addedOn'], '-');
                      const statusStr = row.kh_status || row.status || 0;
                      
                      const isActive = String(statusStr).toLowerCase() === 'active' || String(statusStr).toLowerCase() === 'true' || String(statusStr) === '1';

                      return (
                        <tr key={`${id}-${index}`} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-4 border-r border-slate-200 align-middle text-slate-800">{sno}</td>
                          <td className="px-4 py-4 border-r border-slate-200 align-middle font-medium whitespace-nowrap text-slate-800">{adminName}</td>
                          <td className="px-4 py-4 border-r border-slate-200 align-middle whitespace-nowrap text-slate-800">
                            <span className="bg-[#5cb85c] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
                              {role}
                            </span>
                          </td>
                          <td className="px-4 py-4 border-r border-slate-200 align-middle whitespace-nowrap text-slate-800">{loginId}</td>
                          <td className="px-4 py-4 border-r border-slate-200 align-middle whitespace-nowrap text-slate-800">{phone}</td>
                          <td className="px-4 py-4 border-r border-slate-200 align-middle whitespace-nowrap text-slate-800">{email}</td>
                          <td className="px-4 py-4 border-r border-slate-200 align-middle whitespace-nowrap text-slate-800">{formatDate(addedOn)}</td>
                          <td className="px-4 py-4 border-r border-slate-200 align-middle text-slate-800">
                            <button 
                              onClick={() => handleToggleStatus(row, isActive)}
                              className={`text-white px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors ${isActive ? 'bg-[#144f36] hover:bg-[#0f3d2a]' : 'bg-red-500 hover:bg-red-600'}`}
                            >
                              {isActive ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="px-4 py-4 align-middle text-slate-800">
                            <div className="flex gap-2 justify-center">
                              <Link 
                                to={`/user-role/edit/${row._id || row.id}`}
                                className="inline-block bg-[#5cb85c] text-white p-1.5 rounded hover:bg-[#4cae4c] transition-colors shadow-sm"
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </Link>
                              <button 
                                onClick={() => handleDelete(id)}
                                className="bg-[#d9534f] text-white p-1.5 rounded hover:bg-[#c9302c] transition-colors shadow-sm"
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
            
            <div className="p-4 border-t border-slate-200 flex justify-between items-center text-sm text-slate-600 bg-slate-50">
              <div>Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, TOTAL_ENTRIES)} of {TOTAL_ENTRIES} entries</div>
              <div className="flex space-x-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-sm">1</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
