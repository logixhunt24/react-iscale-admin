import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function CertificateRequests() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalEntries, setTotalEntries] = useState(0)

  // Filters
  const [filters, setFilters] = useState({
    from_date: '',
    to_date: '',
    status: '',
    search: ''
  })

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedReg, setSelectedReg] = useState(null)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [updateForm, setUpdateForm] = useState({
    status: 'pending',
    certificate_no: '',
    certificate_pdf: ''
  })

  const fetchData = async (overrideFilters = null, page = currentPage) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const activeFilters = overrideFilters || filters
      const queryParams = new URLSearchParams({
        page: page,
        limit: entriesPerPage,
        status: activeFilters.status,
        search: activeFilters.search,
        from_date: activeFilters.from_date,
        to_date: activeFilters.to_date
      }).toString()

      const response = await axios.get(`${BASE_URL}/myadmin/certificate/all-requests?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.status) {
        setData(response.data.data || [])
        setTotalPages(response.data.total_pages || 1)
        setTotalEntries(response.data.total_records || 0)
      }
    } catch (err) {
      console.error('Error fetching certificate requests:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(null, currentPage)
  }, [currentPage, entriesPerPage])

  const handleSearchClick = () => {
    setCurrentPage(1)
    fetchData(filters, 1)
  }

  const handleReset = () => {
    const emptyFilters = { from_date: '', to_date: '', status: '', search: '' }
    setFilters(emptyFilters)
    setCurrentPage(1)
    fetchData(emptyFilters, 1)
  }

  const openUpdateModal = (row) => {
    console.log('Selected Row Data:', row) // DEBUG: see actual field names
    setSelectedReg(row)
    setUpdateForm({
      status: row.certificate_status === 2 ? 'approved' : row.certificate_status === 3 ? 'declined' : 'pending',
      certificate_no: row.certificate_no || '',
      certificate_pdf: row.certificate_pdf || ''
    })
    setIsModalOpen(true)
  }

  const handleUpdateStatus = async (e) => {
    e.preventDefault()
    setUpdateLoading(true)
    try {
      const token = localStorage.getItem('token')
      let statusInt = 1
      if (updateForm.status === 'approved') statusInt = 2
      else if (updateForm.status === 'declined') statusInt = 3

      const payload = {
        status: statusInt,
        certificate_status: statusInt,
        declined_reason: statusInt === 3 ? (updateForm.declined_reason || '') : undefined
      }

      // Use whichever ID field exists in the API response
      const recordId = selectedReg._id || selectedReg.enrollment_id || selectedReg.certificate_id || selectedReg.id
      console.log('Using ID for update:', recordId, '| Full row:', selectedReg) // DEBUG

      const response = await axios.put(
        `${BASE_URL}/myadmin/certificate/update-status/${recordId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.status) {
        await window.customAlert(response.data.message || 'Status updated successfully')
        setIsModalOpen(false)
        fetchData(filters, currentPage)
      } else {
        await window.customAlert(response.data.message || 'Failed to update status')
      }
    } catch (err) {
      console.error('Error updating status:', err)
      await window.customAlert(err.response?.data?.message || 'Error updating status')
    } finally {
      setUpdateLoading(false)
    }
  }

  const startIndex = (currentPage - 1) * entriesPerPage
  const endIndex = Math.min(startIndex + data.length, totalEntries)

  const handlePrev = () => { if (currentPage > 1) setCurrentPage(currentPage - 1) }
  const handleNext = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1) }

  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(totalPages, startPage + 4)
    if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4)
    const pages = []
    for (let i = startPage; i <= endPage; i++) pages.push(i)
    return pages
  }

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  const handleExport = async () => {
    if (!data || data.length === 0) { await window.customAlert('No data to export'); return }
    const headers = ['S.No.', 'Student Name', 'Email', 'Course', 'Reg Date', 'Progress', 'Certificate No', 'Certificate PDF', 'Status']
    const csvRows = [headers.join(',')]
    data.forEach((row, index) => {
      const values = [
        startIndex + index + 1,
        `"${row.student_name || ''}"`, `"${row.student_email || ''}"`, `"${row.course_name || ''}"`,
        `"${new Date(row.registration_date).toLocaleDateString()}"`,
        `${row.course_progress || 0}%`, `"${row.certificate_no || 'N/A'}"`,
        `"${row.certificate_pdf || 'N/A'}"`,
        `"${row.certificate_status === 2 ? 'Approved' : row.certificate_status === 3 ? 'Declined' : 'Pending'}"`
      ]
      csvRows.push(values.join(','))
    })
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n')
    const link = document.createElement('a')
    link.setAttribute('href', encodeURI(csvContent))
    link.setAttribute('download', 'certificate_requests.csv')
    document.body.appendChild(link); link.click(); document.body.removeChild(link)
  }

  const getStatusBadge = (status) => {
    if (status === 2) return { label: 'Approved', cls: 'bg-green-600 text-white' }
    if (status === 3) return { label: 'Declined', cls: 'bg-red-500 text-white' }
    return { label: 'Pending', cls: 'bg-amber-500 text-white' }
  }

  return (
    <div className="h-full animate-fade-in-up">
      {/* Title Card */}
      <div className="bg-[#144f36] rounded-t-2xl p-5 flex justify-between items-center shadow-md mb-5">
        <h2 className="text-white font-bold tracking-tight text-xl">Course Request</h2>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
          {/* From Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">From Date</label>
            <input type="date" value={filters.from_date}
              onChange={e => setFilters({ ...filters, from_date: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-500 outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]" />
          </div>
          {/* To Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">To Date</label>
            <input type="date" value={filters.to_date}
              onChange={e => setFilters({ ...filters, to_date: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-500 outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]" />
          </div>
          {/* Registration From placeholder */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Registration From</label>
            <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-500 outline-none focus:border-[#144f36] bg-white">
              <option value="">Select Value</option>
              <option value="App">App</option>
              <option value="Web">Web</option>
            </select>
          </div>
          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
            <select value={filters.status}
              onChange={e => setFilters({ ...filters, status: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 outline-none focus:border-[#144f36] bg-white">
              <option value="">Select Value</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        </div>

        {/* Buttons row */}
        <div className="flex gap-2 mt-4">
          <button onClick={handleSearchClick}
            className="bg-[#144f36] hover:bg-[#0f3d2a] text-white px-6 py-2 rounded text-sm font-semibold shadow-sm transition-all">
            Filter
          </button>
          <button onClick={handleReset}
            className="border border-[#144f36] text-[#144f36] hover:bg-[#144f36] hover:text-white px-6 py-2 rounded text-sm font-semibold transition-all bg-white">
            Reset
          </button>
          <button onClick={handleExport}
            className="border border-[#144f36] text-[#144f36] hover:bg-[#144f36] hover:text-white px-6 py-2 rounded text-sm font-semibold transition-all bg-white">
            Export
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-5">
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center p-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show</span>
            <select value={entriesPerPage} onChange={handleEntriesChange}
              className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-[#144f36] bg-white">
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600">Entries</span>
            {/* Export icon buttons */}
            <div className="flex gap-0 border border-gray-300 rounded overflow-hidden ml-2">
              {[
                { label: 'Copy', icon: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg> },
                { label: 'Excel', icon: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M8 13h2" /><path d="M8 17h2" /><path d="M14 13h2" /><path d="M14 17h2" /></svg> },
                { label: 'PDF', icon: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg> },
                { label: 'Print', icon: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect width="12" height="8" x="6" y="14" /></svg> },
              ].map(btn => (
                <button key={btn.label} title={btn.label}
                  onClick={async () => {
                    if (btn.label === 'Print') { window.print() }
                    else {
                      const table = document.querySelector('table')
                      if (!table) return
                      let csv = ''
                      table.querySelectorAll('tr').forEach(row => {
                        const cols = row.querySelectorAll('td, th')
                        csv += Array.from(cols).map(c => '"' + c.innerText.replace(/"/g, '""') + '"').join(',') + '\n'
                      })
                      if (btn.label === 'Copy') {
                        navigator.clipboard.writeText(csv)
                        await window.customAlert('Table data copied to clipboard!')
                      } else {
                        const blob = new Blob([csv], { type: 'text/csv' })
                        const url = window.URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url; a.download = 'export.csv'; a.click()
                      }
                    }
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-gray-50 border-r border-gray-300 last:border-r-0 flex items-center justify-center">
                  {btn.icon}
                </button>
              ))}
            </div>
          </div>
          {/* Search right side */}
          <div className="mt-2 sm:mt-0">
            <input type="text" placeholder="Search..."
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleSearchClick()}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36] w-48" />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr style={{ backgroundColor: '#144f36' }} className="text-white">
                  <th className="px-3 py-3 font-semibold whitespace-nowrap border-r border-green-700">S.No.</th>
                  <th className="px-3 py-3 font-semibold whitespace-nowrap border-r border-green-700">Student</th>
                  <th className="px-3 py-3 font-semibold whitespace-nowrap border-r border-green-700">Course</th>
                  <th className="px-3 py-3 font-semibold whitespace-nowrap border-r border-green-700">Regn. Date</th>
                  <th className="px-3 py-3 font-semibold whitespace-nowrap border-r border-green-700">Progress</th>
                  <th className="px-3 py-3 font-semibold whitespace-nowrap border-r border-green-700">Certificate Number</th>
                  <th className="px-3 py-3 font-semibold whitespace-nowrap border-r border-green-700">Certificate PDF</th>
                  <th className="px-3 py-3 font-semibold whitespace-nowrap border-r border-green-700">Status</th>
                  <th className="px-3 py-3 font-semibold whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => {
                  const badge = getStatusBadge(row.certificate_status)
                  return (
                    <tr key={row.enrollment_id}
                      className="border-b border-gray-100 hover:bg-green-50/20 transition-colors bg-white">
                      <td className="px-3 py-3 border-r border-gray-100 text-gray-700">{startIndex + index + 1}</td>
                      <td className="px-3 py-3 border-r border-gray-100 text-[#144f36] font-medium">{row.student_name}</td>
                      <td className="px-3 py-3 border-r border-gray-100 text-[#144f36]">
                        <div className="max-w-[140px] text-xs font-medium">{row.course_name}</div>
                      </td>
                      <td className="px-3 py-3 border-r border-gray-100 text-gray-700 whitespace-nowrap">
                        {row.registration_date ? new Date(row.registration_date).toLocaleDateString('en-GB').replace(/\//g, '-') : 'N/A'}
                      </td>
                      <td className="px-3 py-3 border-r border-gray-100 text-gray-700">{row.course_progress || 0}</td>
                      <td className="px-3 py-3 border-r border-gray-100 text-gray-700">{row.certificate_no || ''}</td>
                      <td className="px-3 py-3 border-r border-gray-100 text-gray-700">
                        {row.certificate_pdf && row.certificate_pdf.startsWith('http') ? (
                          <a href={row.certificate_pdf} target="_blank" rel="noopener noreferrer"
                            className="text-[#144f36] hover:underline font-semibold">View PDF</a>
                        ) : (row.certificate_pdf || '')}
                      </td>
                      {/* Status Badge */}
                      <td className="px-3 py-3 border-r border-gray-100 text-center">
                        <span className={`inline-block px-3 py-1 rounded text-white text-xs font-semibold ${badge.cls}`}>
                          {badge.label}
                        </span>
                      </td>
                      {/* Action */}
                      <td className="px-3 py-3">
                        <button onClick={() => openUpdateModal(row)}
                          className="bg-[#144f36] hover:bg-[#0f3d2a] text-white px-4 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors">
                          Change Status
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {data.length === 0 && (
                  <tr>
                    <td colSpan="9" className="px-3 py-8 text-center text-gray-400">
                      No certificate requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-4 px-4 pb-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
          <div className="mb-2 sm:mb-0">
            Showing {totalEntries > 0 ? startIndex + 1 : 0} to {endIndex} of {totalEntries} entries
          </div>
          <div className="flex border border-gray-300 rounded overflow-hidden">
            <button onClick={handlePrev} disabled={currentPage === 1}
              className={`px-3 py-1.5 border-r border-gray-300 ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-50 text-gray-600'}`}>«</button>
            {getPageNumbers().map(pageNum => (
              <button key={pageNum} onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1.5 border-r border-gray-300 ${currentPage === pageNum ? 'bg-[#144f36] text-white' : 'hover:bg-gray-50 text-gray-600'}`}>
                {pageNum}
              </button>
            ))}
            <button onClick={handleNext} disabled={currentPage === totalPages || totalPages === 0}
              className={`px-3 py-1.5 ${currentPage === totalPages || totalPages === 0 ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-50 text-gray-600'}`}>»</button>
          </div>
        </div>
      </div>

      {/* ===== CHANGE STATUS MODAL (matches screenshot 1) ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200">
              <h3 className="text-gray-800 font-semibold text-base">Change Status</h3>
              <button onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none">✕</button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUpdateStatus} className="px-5 py-5">
              <div className="space-y-4">
                {/* Status dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={updateForm.status}
                    onChange={e => setUpdateForm({ ...updateForm, status: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-white outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                    required>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>

                {selectedReg?.certificate_pdf && (
                  <div className="text-sm text-gray-700">
                    Certificate No: <b>{selectedReg.certificate_no}</b>{' '}
                    <a href={selectedReg.certificate_pdf} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View certificate</a>
                  </div>
                )}

                {updateForm.status === 'approved' && (
                  <p className="text-xs text-gray-500">
                    The certificate is created from the student's name and course. Its number is assigned automatically.
                  </p>
                )}

                {updateForm.status === 'declined' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Decline Reason</label>
                    <textarea
                      value={updateForm.declined_reason || ''}
                      onChange={e => setUpdateForm({ ...updateForm, declined_reason: e.target.value })}
                      placeholder="Shown to the student"
                      rows={3}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                    />
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="mt-5 flex justify-end">
                <button type="submit" disabled={updateLoading}
                  className="px-6 py-2 bg-[#144f36] hover:bg-[#0f3d2a] text-white rounded text-sm font-semibold transition-colors disabled:opacity-60">
                  {updateLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
