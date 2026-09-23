import { useState, useEffect } from 'react'
import { Eye, Edit2, Trash2 } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'
import AppUserDetails from './AppUserDetails'
import ThemeButton from '../../components/common/ThemeButton'
import CardHeader from '../../components/ui/CardHeader'

// Matches search text against name, email, and contact number
const matchesUserSearch = (row, searchLower) => {
  if (!searchLower) return true
  const displayName = (row.c_display_name || '').toLowerCase()
  const firstName = (row.c_first_name || '').toLowerCase()
  const lastName = (row.c_last_name || '').toLowerCase()
  const fullName = `${firstName} ${lastName}`.trim().toLowerCase()
  const contact = String(row.c_contact || '').toLowerCase()
  const email = (row.c_email || '').toLowerCase()

  return displayName.includes(searchLower) ||
         firstName.includes(searchLower) ||
         lastName.includes(searchLower) ||
         fullName.includes(searchLower) ||
         contact.includes(searchLower) ||
         email.includes(searchLower)
}

const isTruthyFlag = (v) => v === 1 || v === '1' || v === true

// phoneVerifiedValue: '' (any), '1' (phone verified), '0' (phone not verified)
const matchesPhoneVerified = (row, phoneVerifiedValue) => {
  if (!phoneVerifiedValue) return true
  const verified = isTruthyFlag(row.c_mobile_verified)
  return phoneVerifiedValue === '1' ? verified : !verified
}

// emailVerifiedValue: '' (any), '1' (email verified), '0' (email not verified)
const matchesEmailVerified = (row, emailVerifiedValue) => {
  if (!emailVerifiedValue) return true
  const verified = isTruthyFlag(row.c_email_verified)
  return emailVerifiedValue === '1' ? verified : !verified
}

// Large enough to pull the full matching set for a given date/status filter so
// name/email/contact search, and phone/email-verification filters can run
// entirely client-side (backend `search` may only match name, and phone-verified /
// email-verified aren't backend query params at all).
const SEARCH_FETCH_LIMIT = 10000

export default function AppUsers() {
  const navigate = useNavigate()

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState(null)
  
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalEntries, setTotalEntries] = useState(0)
  const entriesPerPage = 10

  const [search, setSearch] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [userStatus, setUserStatus] = useState('')
  const [phoneVerified, setPhoneVerified] = useState('')
  const [emailVerified, setEmailVerified] = useState('')

  const fetchUsers = async (
    page = currentPage,
    currentSearch = search,
    currentFromDate = fromDate,
    currentToDate = toDate,
    currentUserStatus = userStatus,
    currentPhoneVerified = phoneVerified,
    currentEmailVerified = emailVerified
  ) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token')
      const searchTerm = currentSearch.trim()
      const hasClientFilter = !!searchTerm || !!currentPhoneVerified || !!currentEmailVerified

      // Phone-presence and email-verified filters have no backend query params, and `search` may
      // only match name server-side — so whenever any of these are active, pull the full
      // date/status-filtered set and filter/paginate entirely client-side.
      const params = new URLSearchParams({
        page: String(hasClientFilter ? 1 : page),
        limit: String(hasClientFilter ? SEARCH_FETCH_LIMIT : entriesPerPage),
        search: hasClientFilter ? '' : currentSearch,
        from_date: currentFromDate,
        to_date: currentToDate,
        user_status: currentUserStatus
      })
      const res = await axios.get(`${BASE_URL}/myadmin/app-users/all?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.data?.status) {
        if (hasClientFilter) {
          const searchLower = searchTerm.toLowerCase()
          const matched = (res.data.data || [])
            .filter(row => matchesUserSearch(row, searchLower))
            .filter(row => matchesPhoneVerified(row, currentPhoneVerified))
            .filter(row => matchesEmailVerified(row, currentEmailVerified))
          const pages = Math.max(1, Math.ceil(matched.length / entriesPerPage))
          const safePage = Math.min(page, pages)
          const start = (safePage - 1) * entriesPerPage
          setData(matched.slice(start, start + entriesPerPage))
          setTotalPages(pages)
          setTotalEntries(matched.length)
          if (safePage !== page) setCurrentPage(safePage)
        } else {
          setData(res.data.data || [])
          setTotalPages(res.data.pagination?.totalPages || 1)
          setTotalEntries(res.data.pagination?.total || 0)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(currentPage, search, fromDate, toDate, userStatus, phoneVerified, emailVerified)
  }, [currentPage])

  const handleFilter = () => {
    setCurrentPage(1)
    fetchUsers(1, search, fromDate, toDate, userStatus, phoneVerified, emailVerified)
  }

  const handleReset = () => {
    setSearch('')
    setFromDate('')
    setToDate('')
    setUserStatus('')
    setPhoneVerified('')
    setEmailVerified('')
    setCurrentPage(1)
    fetchUsers(1, '', '', '', '', '', '')
  }

  const handlePrev = () => {
    if (currentPage > 1) {
      const nextPg = currentPage - 1
      setCurrentPage(nextPg)
      fetchUsers(nextPg, search, fromDate, toDate, userStatus, phoneVerified, emailVerified)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      const nextPg = currentPage + 1
      setCurrentPage(nextPg)
      fetchUsers(nextPg, search, fromDate, toDate, userStatus, phoneVerified, emailVerified)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleFilter()
    }
  }

  const filteredData = data.filter(row =>
    matchesUserSearch(row, search.trim().toLowerCase()) &&
    matchesPhoneVerified(row, phoneVerified) &&
    matchesEmailVerified(row, emailVerified)
  );

  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - 2)
    let borderEnd = startPage + 4
    let endPage = Math.min(totalPages, borderEnd)
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4)
    }
    const pages = []
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  const handleDelete = async (id) => {
    if (!await window.customConfirm("Are you sure you want to delete this app user?")) return;
    try {
      const token = localStorage.getItem('token')
      const res = await axios.delete(`${BASE_URL}/myadmin/app-users/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.status) {
        await window.customAlert(res.data.message || "App User deleted successfully");
        fetchUsers();
      } else {
        await window.customAlert(res.data.message || "Failed to delete App User");
      }
    } catch (err) {
      await window.customAlert(err.response?.data?.message || "Error deleting user");
    }
  }

  const handleToggleVerified = async (id, currentlyVerified) => {
    const nextLabel = currentlyVerified ? 'Unverified' : 'Verified'
    if (!await window.customConfirm(`Are you sure you want to mark this user as ${nextLabel}?`)) return
    try {
      const token = localStorage.getItem('token')
      const res = await axios.patch(`${BASE_URL}/myadmin/app-users/toggle-verified/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.status) {
        fetchUsers()
      } else {
        await window.customAlert(res.data?.message || 'Failed to update verification status')
      }
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Error updating verification status')
    }
  }

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token')
      const searchTerm = search.trim()
      const hasClientFilter = !!searchTerm || !!phoneVerified || !!emailVerified
      const params = new URLSearchParams({
        page: 1,
        limit: hasClientFilter ? SEARCH_FETCH_LIMIT : (totalEntries > 0 ? totalEntries : 10000),
        search: hasClientFilter ? '' : search,
        from_date: fromDate,
        to_date: toDate,
        user_status: userStatus
      })
      const res = await axios.get(`${BASE_URL}/myadmin/app-users/all?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.data?.status) {
        const searchLower = searchTerm.toLowerCase()
        const exportData = (res.data.data || [])
          .filter(row => matchesUserSearch(row, searchLower))
          .filter(row => matchesPhoneVerified(row, phoneVerified))
          .filter(row => matchesEmailVerified(row, emailVerified))
        const headers = ['S.No.', 'User Name', 'Contact No.', 'Email', 'Joined On', 'Status']
        const csvRows = [headers.join(',')]
        
        exportData.forEach((row, index) => {
          const userName = ( `${row.c_first_name || ''} ${row.c_last_name || ''}`).trim()
          const contact = row.c_contact || ''
          const email = row.c_email || ''
          const joinedOn = row.c_register_date ? new Date(row.c_register_date).toLocaleDateString() : 'N/A'
          const status = row.isVerified ? 'Verified' : 'Unverified'
          
          csvRows.push([
            index + 1,
            `"${userName}"`,
            `"${contact}"`,
            `"${email}"`,
            `"${joinedOn}"`,
            `"${status}"`
          ].join(','))
        })
        
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'app_users.csv'
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        await window.customAlert("Failed to fetch data for export.")
      }
    } catch (err) {
      console.error(err)
      await window.customAlert("Error exporting data.")
    }
  }

  const startIndex = (currentPage - 1) * entriesPerPage

  return (
    <div className="h-full animate-fade-in-up">
      <CardHeader title="App Users List" className="rounded-2xl mb-5">
        <ThemeButton variant="white-add" to={'/app-users/add'}>
          + Add Student
        </ThemeButton>
        <ThemeButton variant="white-add" onClick={handleExport}>
          Export
        </ThemeButton>
      </CardHeader>

      <div className="bg-[#f6f6ff] rounded-2xl shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow border border-slate-100 transition-colors overflow-hidden flex flex-col">
        {/* Filters */}
        <div className="p-4 border-b border-slate-200 dark:border-gray-800/50 flex flex-wrap gap-4 items-end bg-[#eef2f6]/50">
          <div>
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">From Date</label>
            <div className="relative">
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 w-48" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">To Date</label>
            <div className="relative">
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 w-48" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">User Type</label>
            <select value={userStatus} onChange={(e) => setUserStatus(e.target.value)} className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 w-40">
              <option value="">Select Type</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Phone Verification</label>
            <select value={phoneVerified} onChange={(e) => setPhoneVerified(e.target.value)} className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 w-44">
              <option value="">All</option>
              <option value="1">Verified</option>
              <option value="0">Unverified</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Email Verification</label>
            <select value={emailVerified} onChange={(e) => setEmailVerified(e.target.value)} className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 w-44">
              <option value="">All</option>
              <option value="1">Verified</option>
              <option value="0">Unverified</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Search</label>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleKeyDown} className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 w-48" />
          </div>
          <div className="flex gap-2">
            <ThemeButton onClick={handleFilter} variant="solid-green">Filter</ThemeButton>
            <ThemeButton onClick={handleReset} variant="outline-green">Reset</ThemeButton>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="overflow-auto border border-slate-200 dark:border-[#1f1b2e] rounded-t-lg flex-1">
            <table className="w-full text-left text-sm text-slate-800 dark:text-slate-200">
              <thead className="bg-slate-50 dark:bg-[#13111c] text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-gray-800">
                <tr>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">S.No.</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">User Name</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Contact No.</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Email</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Joined On</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 font-bold whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-6">Loading data...</td></tr>
                ) : filteredData.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-6">No users found.</td></tr>
                ) : (
                  filteredData.map((row, index) => (
                    <tr key={row._id} className="border-b border-slate-200 dark:border-gray-800/50 hover:bg-slate-50 dark:bg-[#1f1b2e]/50">
                      <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">{startIndex + index + 1}</td>
                      <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">
                        {`${row.c_first_name || ''} ${row.c_last_name || ''}`.trim() || row.c_display_name || 'N/A'}
                      </td>
                      <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">{row.c_contact || 'N/A'}</td>
                      <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">{row.c_email || 'N/A'}</td>
                      <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">
                        {row.c_register_date ? new Date(row.c_register_date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">
                        <button
                          onClick={() => handleToggleVerified(row._id, row.isVerified)}
                          className={`px-3 py-1 rounded-full text-white text-xs whitespace-nowrap cursor-pointer transition-opacity hover:opacity-80 ${row.isVerified ? 'bg-[#144f36]' : 'bg-red-500'}`}
                          title={`Click to mark as ${row.isVerified ? 'Unverified' : 'Verified'}`}
                        >
                          {row.isVerified ? 'Verified' : 'Unverified'}
                        </button>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex gap-1.5">
                          <button onClick={() => setSelectedUserId(row._id)} className="bg-[#144f36] text-white p-1.5 rounded hover:bg-[#0f3d2a] transition-colors" title="View Details">
                            <Eye size={14} />
                          </button>
                          <Link to={`/app-users/edit/${row._id}`} className="inline-block bg-green-600 text-white p-1.5 rounded hover:bg-green-700 transition-colors" title="Edit User">
                            <Edit2 size={14} />
                          </Link>
                          <button onClick={() => handleDelete(row._id)} className="btn-glossy-red icon-only" title="Delete User">
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

          {!loading && totalEntries > 0 && (
            <div className="mt-4 flex justify-between items-center text-sm text-slate-800 dark:text-slate-200">
              <div>
                Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, totalEntries)} of {totalEntries} entries
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
                {totalPages > 5 && currentPage < totalPages - 2 && <span className="px-2">...</span>}
                <button 
                  onClick={handleNext}
                  disabled={currentPage >= totalPages}
                  className={`px-3 py-1 border rounded ${currentPage >= totalPages ? 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1f1b2e]' : 'text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:bg-[#1f1b2e]/50'}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {selectedUserId && (
        <AppUserDetails userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
      )}
    </div>
  )
}
