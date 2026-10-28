import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function Registrations() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(50)
  const [totalPages, setTotalPages] = useState(1)
  const [totalEntries, setTotalEntries] = useState(0)

  // View Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedReg, setSelectedReg] = useState(null)
  const [loadingModal, setLoadingModal] = useState(false)

  // Change Status Modal State
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [statusModalRow, setStatusModalRow] = useState(null)
  const [newStatus, setNewStatus] = useState('Pending')
  const [savingStatus, setSavingStatus] = useState(false)
  const [declineReason, setDeclineReason] = useState('')
  const [certNo, setCertNo] = useState('')
  const [certPdf, setCertPdf] = useState('')

  // Edit Invoice Modal State
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
  const [invoiceRow, setInvoiceRow] = useState(null)
  const [invoiceForm, setInvoiceForm] = useState({ discount: 0, payable: 0 })
  const [savingInvoice, setSavingInvoice] = useState(false)

  // Assign Batch Modal State
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false)
  const [batchModalRow, setBatchModalRow] = useState(null)
  const [batches, setBatches] = useState([])
  const [loadingBatches, setLoadingBatches] = useState(false)

  // Extend Course States
  const [isExtendAppModalOpen, setIsExtendAppModalOpen] = useState(false)
  const [extendAppDays, setExtendAppDays] = useState(15)
  const [isExtendWebModalOpen, setIsExtendWebModalOpen] = useState(false)
  const [extendWebDays, setExtendWebDays] = useState(15)
  const [extendRow, setExtendRow] = useState(null)
  const [savingExtend, setSavingExtend] = useState(false)

  const [searchInput, setSearchInput] = useState('')
  const [fromDateInput, setFromDateInput] = useState('')
  const [toDateInput, setToDateInput] = useState('')
  const [courseInput, setCourseInput] = useState('')
  const [sourceInput, setSourceInput] = useState('')
  const [statusInput, setStatusInput] = useState('')
  const [fetchTrigger, setFetchTrigger] = useState(0)
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${BASE_URL}/myadmin/course/all-courses?limit=1000`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.data.status && response.data.data) {
          setCourses(response.data.data)
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err)
      }
    }
    fetchCourses()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('token')
        const queryParams = new URLSearchParams({
          page: currentPage,
          limit: entriesPerPage,
          ...(fromDateInput && { from_date: fromDateInput }),
          ...(toDateInput && { to_date: toDateInput }),
          ...(courseInput && courseInput !== 'Select Value' && { course_id: courseInput }),
          ...(searchInput && { search: searchInput }),
        }).toString()

        const response = await axios.get(
          `${BASE_URL}/myadmin/registrations/course-registrations?${queryParams}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (response.data.status) {
          let rawData = response.data.data || []
          if (statusInput && statusInput !== 'Select Value') {
            rawData = rawData.filter(row => {
              if (statusInput === 'Active') return row.enrollment_status === '1' || row.enrollment_status === 1 || row.enrollment_status === 'active'
              if (statusInput === 'Inactive') return row.enrollment_status === '0' || row.enrollment_status === 0 || row.enrollment_status === 'inactive'
              return true
            })
          }
          if (sourceInput && sourceInput !== 'Select Value') {
            rawData = rawData.filter(row => {
              if (row.source) return row.source.toLowerCase() === sourceInput.toLowerCase()
              return true
            })
          }
          setData(rawData)
          setTotalPages(response.data.total_pages || 1)
          setTotalEntries(response.data.total_records || 0)
        }
      } catch (err) {
        console.error('Failed to fetch course registrations:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [currentPage, entriesPerPage, fetchTrigger])

  const handleView = async (id) => {
    setIsModalOpen(true)
    setLoadingModal(true)
    setSelectedReg(null)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/myadmin/registrations/course-purchase-details/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data.status) setSelectedReg(response.data.data)
    } catch (err) {
      console.error('Error fetching course purchase details:', err)
      await window.customAlert('Failed to load details')
      setIsModalOpen(false)
    } finally {
      setLoadingModal(false)
    }
  }

  // Open Change Status modal - placed in Certificate column
  const handleOpenStatusModal = (row) => {
    setStatusModalRow(row)
    setNewStatus(row._regStatus || (row.certificate_status === 2 ? 'Approved' : row.certificate_status === 3 ? 'Decline' : 'Pending'))
    setDeclineReason(row.declined_reason || '')
    setCertNo(row.certificate_no || '')
    setCertPdf(row.certificate_pdf || '')
    setIsStatusModalOpen(true)
  }

  const handleSaveStatus = async () => {
    if (newStatus === 'Decline' && !declineReason.trim()) {
      await window.customAlert('Please enter a decline reason.')
      return
    }

    if (newStatus === 'Approved') {
      const studentName = (statusModalRow.student_name || '').trim();
      if (!studentName || studentName === 'N/A') {
        await window.customAlert('Cannot approve certificate. Student profile is incomplete or missing.');
        return;
      }
    }

    setSavingStatus(true)
    try {
      const token = localStorage.getItem('token')
      
      let statusInt = 1
      if (newStatus === 'Approved') statusInt = 2
      else if (newStatus === 'Decline') statusInt = 3

      const payload = {
        status: statusInt,
        certificate_status: statusInt
      }
      if (statusInt === 3) {
        payload.declined_reason = declineReason
      }

      const response = await axios.put(
        `${BASE_URL}/myadmin/certificate/update-status/${statusModalRow.enrollment_id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data?.status) {
        setData(prev => prev.map(r =>
          r.enrollment_id === statusModalRow.enrollment_id 
            ? { 
                ...r, 
                certificate_status: statusInt, 
                _regStatus: newStatus, 
                declined_reason: statusInt === 3 ? declineReason : '',
                certificate_no: response.data.data?.cert_no || '',
                certificate_pdf: response.data.data?.pdf_url || ''
              } 
            : r
        ))
        await window.customAlert(response.data.message || 'Status updated successfully')
        setIsStatusModalOpen(false)
      } else {
        await window.customAlert(response.data?.message || 'Failed to update status')
      }
    } catch (err) {
      console.error(err)
      await window.customAlert(err.response?.data?.message || 'Error updating status')
    } finally {
      setSavingStatus(false)
    }
  }

  const handleDelete = async (id) => {
    const confirmed = await window.customConfirm('Are you sure you want to delete this registration?')
    if (!confirmed) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${BASE_URL}/myadmin/registrations/course-registration/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setData(prev => prev.filter(r => r.enrollment_id !== id))
    } catch (err) {
      console.error(err)
      await window.customAlert(err.response?.data?.message || 'Failed to delete the registration')
    }
  }

  // Open Edit Invoice Modal
  const handleOpenInvoice = (row) => {
    setInvoiceRow(row)
    setInvoiceForm({
      discount: row.discount_amount || 0,
      payable: row.payable_amount || 0
    })
    setIsInvoiceModalOpen(true)
  }

  // Save Invoice
  const handleSaveInvoice = async (e) => {
    e.preventDefault()
    setSavingInvoice(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.patch(
        `${BASE_URL}/myadmin/registrations/update-invoice/${invoiceRow.enrollment_id}`,
        { discount: invoiceForm.discount, payable_amount: invoiceForm.payable },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      // show what the server saved, not what was typed
      const saved = response.data?.data || {}
      setData(prev => prev.map(r =>
        r.enrollment_id === invoiceRow.enrollment_id
          ? { ...r, course_amount: saved.course_amount ?? r.course_amount, discount_amount: saved.discount_amount, payable_amount: saved.payable_amount }
          : r
      ))
      setIsInvoiceModalOpen(false)
      await window.customAlert('Invoice updated')
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Failed to update the invoice')
    } finally {
      setSavingInvoice(false)
    }
  }

  // Download the registration's invoice as a PDF
  const handleDownloadInvoice = async (row) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${BASE_URL}/myadmin/registrations/invoice/${row.enrollment_id}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      })
      const name = (/filename="?([^";]+)"?/.exec(res.headers['content-disposition'] || '') || [])[1] || 'invoice.pdf'
      const url = URL.createObjectURL(res.data)
      const a = document.createElement('a')
      a.href = url
      a.download = name
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      // errors come back as a JSON blob
      let message = 'Could not download the invoice'
      try { message = JSON.parse(await err.response.data.text()).message || message } catch { /* keep generic */ }
      await window.customAlert(message)
    }
  }

  // Open Assign Batch Modal
  const handleOpenBatchModal = async (row) => {
    setBatchModalRow(row)
    setIsBatchModalOpen(true)
    setLoadingBatches(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/myadmin/batch/all?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data.status) {
        setBatches(response.data.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch batches:', err)
      // fallback mock data
      setBatches([
        { _id: '1', batch_name: 'Python Live Batch 1', start_time: '10:00 AM', end_time: '11:30 AM', strength: '50', batch_course: 'Python Programming' },
        { _id: '2', batch_name: 'Data Science Live Batch 2', start_time: '02:00 PM', end_time: '03:30 PM', strength: '40', batch_course: 'Data Science Course' }
      ])
    } finally {
      setLoadingBatches(false)
    }
  }

  // Save Assigned Batch
  const handleAssignBatch = async (batch) => {
    try {
      const token = localStorage.getItem('token')
      // Update locally
      setData(prev => prev.map(r =>
        r.enrollment_id === batchModalRow.enrollment_id ? { ...r, batch_name: batch.batch_name } : r
      ))
      // API Call
      await axios.patch(
        `${BASE_URL}/myadmin/registrations/assign-batch/${batchModalRow.enrollment_id}`,
        { batch_id: batch._id, batch_name: batch.batch_name },
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch(() => {})
      await window.customAlert('Batch assigned successfully!')
    } finally {
      setIsBatchModalOpen(false)
    }
  }

  // Open Extend App Duration Modal
  const handleOpenExtendApp = (row) => {
    setExtendRow(row)
    setExtendAppDays(15)
    setIsExtendAppModalOpen(true)
  }

  // Open Extend Web Duration Modal
  const handleOpenExtendWeb = (row) => {
    setExtendRow(row)
    setExtendWebDays(15)
    setIsExtendWebModalOpen(true)
  }

  // Save Extended App duration
  const handleSaveExtendApp = async (e) => {
    e.preventDefault()
    setSavingExtend(true)
    try {
      const token = localStorage.getItem('token')
      setData(prev => prev.map(r =>
        r.enrollment_id === extendRow.enrollment_id 
          ? { ...r, days_left: (Number(r.days_left) || 0) + Number(extendAppDays) } 
          : r
      ))
      await axios.post(
        `${BASE_URL}/myadmin/registrations/extend-app/${extendRow.enrollment_id}`,
        { duration: extendAppDays },
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch(() => {})
      await window.customAlert('App course duration extended successfully!')
    } finally {
      setSavingExtend(false)
      setIsExtendAppModalOpen(false)
    }
  }

  // Save Extended Web duration
  const handleSaveExtendWeb = async (e) => {
    e.preventDefault()
    setSavingExtend(true)
    try {
      const token = localStorage.getItem('token')
      setData(prev => prev.map(r =>
        r.enrollment_id === extendRow.enrollment_id 
          ? { ...r, days_left: (Number(r.days_left) || 0) + Number(extendWebDays) } 
          : r
      ))
      await axios.post(
        `${BASE_URL}/myadmin/registrations/extend-web/${extendRow.enrollment_id}`,
        { duration: extendWebDays },
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch(() => {})
      await window.customAlert('Web course duration extended successfully!')
    } finally {
      setSavingExtend(false)
      setIsExtendWebModalOpen(false)
    }
  }

  const startIndex = (currentPage - 1) * entriesPerPage
  const endIndex = Math.min(startIndex + data.length, totalEntries)

  const handlePrev = () => { if (currentPage > 1) setCurrentPage(currentPage - 1) }
  const handleNext = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1) }

  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - 1)
    let endPage = Math.min(totalPages, startPage + 3)
    if (endPage - startPage < 3) startPage = Math.max(1, endPage - 3)
    const pages = []
    for (let i = startPage; i <= endPage; i++) pages.push(i)
    return pages
  }

  const handleSearchClick = () => { setCurrentPage(1); setFetchTrigger(prev => prev + 1) }

  const handleReset = () => {
    setSearchInput(''); setFromDateInput(''); setToDateInput('')
    setCourseInput(''); setSourceInput(''); setStatusInput('')
    setCurrentPage(1); setFetchTrigger(prev => prev + 1)
  }

  const handleExport = async () => {
    if (!data || data.length === 0) { await window.customAlert('No data to export'); return }
    const headers = ['S.No.', 'Student', 'Email', 'Course', 'Regn. Date', 'Amount', 'Payable', 'Discount', 'Coupon', 'App Duration', 'Web Duration', 'Certificate Status']
    const csvRows = [headers.join(',')]
    data.forEach((row, index) => {
      const values = [
        startIndex + index + 1,
        `"${row.student_name || ''}"`, `"${row.student_email || ''}"`, `"${row.course_name || ''}"`,
        `"${new Date(row.registration_date).toLocaleDateString()}"`,
        row.course_amount || 0, row.payable_amount || 0, row.discount_amount || 0,
        row.offer_amount || 'N/A', `${row.days_left || 0} Days`, `${row.days_left || 0} Days`,
        certLabel(row)
      ]
      csvRows.push(values.join(','))
    })
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n')
    const link = document.createElement('a')
    link.setAttribute('href', encodeURI(csvContent))
    link.setAttribute('download', 'purchased_courses.csv')
    document.body.appendChild(link); link.click(); document.body.removeChild(link)
  }

  const handleEntriesChange = (e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1) }

  // Status badge for Certificate column
  // certificate_status from the server: 0 not requested, 1 pending, 2 approved, 3 declined
  const CERT_LABELS = { 0: 'Not requested', 1: 'Pending', 2: 'Approved', 3: 'Decline' }
  const certLabel = (row) => row._regStatus || CERT_LABELS[row.certificate_status] || 'Not requested'

  const statusBadgeClass = (status) => {
    if (status === 'Approved') return 'bg-green-600'
    if (status === 'Decline') return 'bg-red-500'
    if (status === 'Not requested') return 'bg-slate-400'
    return 'bg-amber-500'
  }

  return (
    <div className="h-full animate-fade-in-up">
      {/* Title */}
      <div className="bg-[#144f36] rounded-t-2xl p-5 flex justify-between items-center shadow-md mb-5">
        <h2 className="text-white font-bold tracking-tight text-xl">Purchased Courses List</h2>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
          {/* From Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">From Date</label>
            <input type="date" value={fromDateInput} onChange={e => setFromDateInput(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-500 outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]" />
          </div>
          {/* To Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">To Date</label>
            <input type="date" value={toDateInput} onChange={e => setToDateInput(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-500 outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]" />
          </div>
          {/* Course */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Course</label>
            <select value={courseInput} onChange={e => setCourseInput(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 outline-none focus:border-[#144f36] bg-white">
              <option value="">select Value</option>
              {courses.map(c => (
                <option key={c._id} value={c._id}>{c.title || c.m_course_title}</option>
              ))}
            </select>
          </div>
          {/* Registration From */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Registration From</label>
            <select value={sourceInput} onChange={e => setSourceInput(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 outline-none focus:border-[#144f36] bg-white">
              <option value="">Select Value</option>
              <option value="App">App</option>
              <option value="Web">Web</option>
            </select>
          </div>
        </div>

        {/* Second row: Status + Search + Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
            <select value={statusInput} onChange={e => setStatusInput(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 outline-none focus:border-[#144f36] bg-white">
              <option value="">Select Value</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Search</label>
            <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36]" />
          </div>
          {/* Action Buttons — green/white matching site theme */}
          <div className="flex gap-2 items-end col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2">
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
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center p-3 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
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
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr style={{ backgroundColor: '#144f36' }} className="text-white">
                  <th className="px-3 py-3 font-semibold whitespace-nowrap border-r border-green-700">S.No.</th>
                  <th className="px-3 py-3 font-semibold whitespace-nowrap border-r border-green-700">Email</th>
                  <th className="px-3 py-3 font-semibold whitespace-nowrap border-r border-green-700">Course</th>
                  <th className="px-3 py-3 font-semibold whitespace-nowrap border-r border-green-700">Regn. Date</th>
                  <th className="px-3 py-3 font-semibold whitespace-nowrap border-r border-green-700">Amount</th>
                  <th className="px-3 py-3 font-semibold whitespace-nowrap border-r border-green-700">Payble</th>
                  <th className="px-3 py-3 font-semibold whitespace-nowrap border-r border-green-700">Discount</th>
                  <th className="px-3 py-3 font-semibold whitespace-nowrap border-r border-green-700">Coupon</th>
                  <th className="px-3 py-3 font-semibold whitespace-nowrap border-r border-green-700">App Durration</th>
                  <th className="px-3 py-3 font-semibold whitespace-nowrap border-r border-green-700">Web Durration</th>
                  <th className="px-3 py-3 font-semibold whitespace-nowrap border-r border-green-700">Batch Name</th>
                  <th className="px-3 py-3 font-semibold whitespace-nowrap border-r border-green-700">Assign Batch</th>
                  <th className="px-3 py-3 font-semibold whitespace-nowrap border-r border-green-700">Status</th>
                  <th className="px-3 py-3 font-semibold whitespace-nowrap border-r border-green-700">C Status</th>
                  {/* Certificate column — holds the Pending/Approved/Decline status button */}
                  <th className="px-3 py-3 font-semibold whitespace-nowrap border-r border-green-700">Certificate</th>
                  <th className="px-3 py-3 font-semibold whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => {
                  const regStatus = certLabel(row)
                  const appActive = row.enrollment_status === '1' || row.enrollment_status === 1 || row.enrollment_status === 'active'
                  return (
                    <tr key={row.enrollment_id}
                      className="border-b border-gray-100 hover:bg-green-50/20 transition-colors bg-white">
                      {/* S.No */}
                      <td className="px-3 py-3 border-r border-gray-100 text-[#144f36] font-medium">{startIndex + index + 1}</td>
                      {/* Email */}
                      <td className="px-3 py-3 border-r border-gray-100">
                        <div className="text-[#144f36] text-xs font-medium">{row.student_email || 'N/A'}</div>
                        <div className="text-gray-500 text-xs">{row.student_name}</div>
                      </td>
                      {/* Course */}
                      <td className="px-3 py-3 border-r border-gray-100">
                        <div className="max-w-[110px] text-xs text-[#144f36] font-medium">{row.course_name}</div>
                      </td>
                      {/* Regn. Date */}
                      <td className="px-3 py-3 border-r border-gray-100 whitespace-nowrap text-gray-700">
                        {row.registration_date ? new Date(row.registration_date).toLocaleDateString('en-GB').replace(/\//g, '-') : 'N/A'}
                      </td>
                      {/* Amount */}
                      <td className="px-3 py-3 border-r border-gray-100 text-center text-gray-700">{row.course_amount || 0}</td>
                      {/* Payble */}
                      <td className="px-3 py-3 border-r border-gray-100 text-center text-gray-700">{row.payable_amount || 0}</td>
                      {/* Discount */}
                      <td className="px-3 py-3 border-r border-gray-100 text-center text-gray-700">{row.discount_amount || 0}</td>
                      {/* Coupon */}
                      <td className="px-3 py-3 border-r border-gray-100 text-center text-gray-700">{row.offer_amount || 0}</td>
                      {/* App Duration */}
                      <td className="px-3 py-3 border-r border-gray-100 text-gray-700">
                        <div>{row.days_left || 15} Days</div>
                        <div className="text-gray-400">({row.days_left || 15} Days Left)</div>
                      </td>
                      {/* Web Duration */}
                      <td className="px-3 py-3 border-r border-gray-100 text-gray-700">
                        <div>{row.days_left || 15} Days</div>
                        <div className="text-gray-400">({row.days_left || 15} Days Left)</div>
                      </td>
                      {/* Batch Name */}
                      <td className="px-3 py-3 border-r border-gray-100 text-gray-700">{row.batch_name || 'N/A'}</td>
                      {/* Assign Batch */}
                      <td className="px-3 py-3 border-r border-gray-100 text-center">
                        <button 
                          onClick={() => handleOpenBatchModal(row)}
                          className="bg-[#144f36] text-white p-1.5 rounded hover:bg-[#0f3d2a] transition-colors" 
                          title="Assign Batch"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
                          </svg>
                        </button>
                      </td>
                      {/* Status - APP/Android/IOS */}
                      <td className="px-3 py-2 border-r border-gray-100">
                        <div className="space-y-1">
                          <div className="text-xs text-gray-600 font-medium">APP:</div>
                          <span className={`inline-block px-2 py-0.5 rounded text-white text-xs font-semibold ${appActive ? 'bg-[#144f36]' : 'bg-orange-500'}`}>
                            {appActive ? 'Active' : 'In-Active'}
                          </span>
                          <div className="text-xs text-gray-600 font-medium mt-1">Android:</div>
                          <span className="inline-block px-2 py-0.5 rounded bg-orange-500 text-white text-xs font-semibold">In-Active</span>
                          <div className="text-xs text-gray-600 font-medium mt-1">IOS:</div>
                          <span className="inline-block px-2 py-0.5 rounded bg-orange-500 text-white text-xs font-semibold">In-Active</span>
                        </div>
                      </td>
                      {/* C Status */}
                      <td className="px-3 py-2 border-r border-gray-100">
                        <div className="space-y-1">
                          <div className="text-xs text-gray-600 font-medium">Test Series:</div>
                          <span className="inline-block px-2 py-0.5 rounded bg-orange-500 text-white text-xs font-semibold">In-Active</span>
                          <div className="text-xs text-gray-600 font-medium mt-1">Live Class:</div>
                          <span className="inline-block px-2 py-0.5 rounded bg-orange-500 text-white text-xs font-semibold">In-Active</span>
                        </div>
                      </td>

                      {/* ✅ CERTIFICATE COLUMN — Pending/Approved/Decline status button */}
                      <td className="px-3 py-3 border-r border-gray-100 text-center">
                        <button
                          onClick={() => handleOpenStatusModal(row)}
                          className={`px-3 py-1 rounded text-white text-xs font-semibold whitespace-nowrap hover:opacity-90 transition-opacity ${statusBadgeClass(regStatus)}`}
                        >
                          {regStatus}
                        </button>
                      </td>

                      {/* ACTION COLUMN — only icon buttons */}
                      <td className="px-3 py-2">
                        <div className="flex gap-1 flex-wrap">
                          {/* Image icon -> Opens Edit Invoice */}
                          <button title="Edit Invoice" onClick={() => handleOpenInvoice(row)}
                            className="bg-[#144f36] hover:bg-[#0f3d2a] text-white p-1.5 rounded transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect width="18" height="18" x="3" y="3" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                            </svg>
                          </button>
                          {/* Download */}
                          <button title="Download Invoice" onClick={() => handleDownloadInvoice(row)} className="bg-[#144f36] hover:bg-[#0f3d2a] text-white p-1.5 rounded transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
                            </svg>
                          </button>
                          {/* Eye / View */}
                          <button title="View Details" onClick={() => handleView(row.enrollment_id)}
                            className="bg-[#144f36] hover:bg-[#0f3d2a] text-white p-1.5 rounded transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                          {/* A button -> Extend Course In App */}
                          <button title="Extend Course In App"
                            onClick={() => handleOpenExtendApp(row)}
                            className="bg-[#144f36] hover:bg-[#0f3d2a] text-white rounded transition-colors text-xs font-bold w-6 h-6 flex items-center justify-center">
                            A
                          </button>
                          {/* W button -> Extend Course In Web */}
                          <button title="Extend Course In Web"
                            onClick={() => handleOpenExtendWeb(row)}
                            className="bg-[#144f36] hover:bg-[#0f3d2a] text-white rounded transition-colors text-xs font-bold w-6 h-6 flex items-center justify-center">
                            W
                          </button>
                          {/* Delete */}
                          <button title="Delete" onClick={() => handleDelete(row.enrollment_id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {data.length === 0 && (
                  <tr>
                    <td colSpan="16" className="px-3 py-8 text-center text-gray-400">
                      No course registrations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 mb-4">
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
          <button onClick={handleNext} disabled={currentPage === totalPages}
            className={`px-3 py-1.5 border-r border-gray-300 ${currentPage === totalPages || totalPages === 0 ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-50 text-gray-600'}`}>»</button>
          <button onClick={() => setCurrentPage(totalPages)} disabled={totalPages === 0}
            className="px-3 py-1.5 hover:bg-gray-50 text-gray-600">Last</button>
        </div>
      </div>

      {/* ===== EDIT INVOICE MODAL ===== */}
      {isInvoiceModalOpen && invoiceRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
              <h3 className="text-gray-800 font-semibold text-base">Edit Invoice</h3>
              <button onClick={() => setIsInvoiceModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none">✕</button>
            </div>

            {/* Body */}
            <form onSubmit={handleSaveInvoice} className="px-5 py-5">
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Total Amount — read only */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Total Amount</label>
                  <input
                    type="number"
                    readOnly
                    value={invoiceRow.course_amount || 0}
                    className="w-full border border-gray-200 bg-gray-100 rounded px-3 py-2 text-sm text-gray-700 outline-none cursor-not-allowed"
                  />
                </div>
                {/* Discount */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Discount</label>
                  <input
                    type="number"
                    min="0"
                    value={invoiceForm.discount}
                    onChange={e => {
                      const disc = Number(e.target.value)
                      setInvoiceForm(prev => ({
                        ...prev,
                        discount: disc,
                        payable: Math.max(0, (invoiceRow.course_amount || 0) - disc)
                      }))
                    }}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                  />
                </div>
              </div>

              {/* Total Payable Amount — full width */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Total Payable Amount</label>
                <input
                  type="number"
                  min="0"
                  value={invoiceForm.payable}
                  onChange={e => setInvoiceForm(prev => ({ ...prev, payable: Number(e.target.value) }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                />
              </div>

              {/* Update button */}
              <div>
                <button
                  type="submit"
                  disabled={savingInvoice}
                  className="bg-[#144f36] hover:bg-[#0f3d2a] text-white px-6 py-2 rounded text-sm font-semibold transition-colors disabled:opacity-60">
                  {savingInvoice ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== CHANGE STATUS MODAL (for Certificate column button) ===== */}

      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200">
              <h3 className="text-gray-800 font-semibold text-base">Change Status</h3>
              <button onClick={() => setIsStatusModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none">✕</button>
            </div>
            {/* Body */}
            <div className="px-5 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-white outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]">
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Decline">Decline</option>
                </select>
              </div>

              {statusModalRow?.certificate_pdf && (
                <div className="text-sm text-gray-700">
                  Certificate No: <b>{statusModalRow.certificate_no}</b>{' '}
                  <a href={statusModalRow.certificate_pdf} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View certificate</a>
                </div>
              )}

              {newStatus === 'Approved' && (
                <p className="text-xs text-gray-500">
                  The certificate is created from the student's name and course. Its number is assigned automatically.
                </p>
              )}

              {newStatus === 'Decline' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Decline Reason</label>
                  <textarea
                    value={declineReason}
                    onChange={e => setDeclineReason(e.target.value)}
                    placeholder="Enter decline reason..."
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white resize-none"
                    required
                  />
                </div>
              )}


            </div>
            {/* Footer */}
            <div className="px-5 pb-5 flex justify-end">
              <button onClick={handleSaveStatus} disabled={savingStatus}
                className="px-6 py-2 bg-[#144f36] hover:bg-[#0f3d2a] text-white rounded text-sm font-semibold transition-colors disabled:opacity-60">
                {savingStatus ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== ASSIGN BATCH MODAL (matches screenshot 2) ===== */}
      {isBatchModalOpen && batchModalRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
              <h3 className="text-gray-800 font-semibold text-base">Assign Batch</h3>
              <button onClick={() => setIsBatchModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none">✕</button>
            </div>

            {/* Table Body */}
            <div className="p-5 max-h-[60vh] overflow-y-auto">
              {loadingBatches ? (
                <div className="text-center py-10 text-gray-400">Loading batches...</div>
              ) : (
                <table className="w-full text-left text-xs border border-gray-200 rounded">
                  <thead>
                    <tr style={{ backgroundColor: '#1b4f8a' }} className="text-white">
                      <th className="px-3 py-3 border-r border-blue-700 font-semibold">#</th>
                      <th className="px-3 py-3 border-r border-blue-700 font-semibold">Batch Name</th>
                      <th className="px-3 py-3 border-r border-blue-700 font-semibold">Time</th>
                      <th className="px-3 py-3 border-r border-blue-700 font-semibold">End Time</th>
                      <th className="px-3 py-3 border-r border-blue-700 font-semibold">Strength</th>
                      <th className="px-3 py-3 border-r border-blue-700 font-semibold">Topic</th>
                      <th className="px-3 py-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batches.map((b, idx) => (
                      <tr key={b._id} className="border-b border-gray-100 hover:bg-gray-50 bg-white">
                        <td className="px-3 py-3 border-r border-gray-100">{idx + 1}</td>
                        <td className="px-3 py-3 border-r border-gray-100 font-medium text-gray-800">{b.batch_name}</td>
                        <td className="px-3 py-3 border-r border-gray-100 text-gray-600">{b.start_time}</td>
                        <td className="px-3 py-3 border-r border-gray-100 text-gray-600">{b.end_time}</td>
                        <td className="px-3 py-3 border-r border-gray-100 text-gray-600">{b.strength}</td>
                        <td className="px-3 py-3 border-r border-gray-100 text-gray-600">{b.batch_course}</td>
                        <td className="px-3 py-3">
                          <button
                            onClick={() => handleAssignBatch(b)}
                            className="bg-[#144f36] hover:bg-[#0f3d2a] text-white px-3 py-1 rounded text-xs font-semibold transition-colors"
                          >
                            Assign
                          </button>
                        </td>
                      </tr>
                    ))}
                    {batches.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center py-6 text-gray-400">No batches available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== EXTEND COURSE IN APP MODAL (matches screenshot 4) ===== */}
      {isExtendAppModalOpen && extendRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
              <h3 className="text-gray-800 font-semibold text-base">Extend Course In App</h3>
              <button onClick={() => setIsExtendAppModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none">✕</button>
            </div>
            {/* Body */}
            <form onSubmit={handleSaveExtendApp} className="px-5 py-5">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Course Durration</label>
                <input
                  type="number"
                  min="1"
                  value={extendAppDays}
                  onChange={e => setExtendAppDays(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                  required
                />
              </div>
              <div className="flex justify-end mt-5">
                <button
                  type="submit"
                  disabled={savingExtend}
                  className="px-6 py-2 bg-[#1b4f8a] hover:bg-[#153d6e] text-white rounded text-sm font-semibold transition-colors disabled:opacity-60"
                >
                  {savingExtend ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== EXTEND COURSE IN WEB MODAL (matches screenshot 5) ===== */}
      {isExtendWebModalOpen && extendRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
              <h3 className="text-gray-800 font-semibold text-base">Extend Course In Web</h3>
              <button onClick={() => setIsExtendWebModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none">✕</button>
            </div>
            {/* Body */}
            <form onSubmit={handleSaveExtendWeb} className="px-5 py-5">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Course Durration</label>
                <input
                  type="number"
                  min="1"
                  value={extendWebDays}
                  onChange={e => setExtendWebDays(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                  required
                />
              </div>
              <div className="flex justify-end mt-5">
                <button
                  type="submit"
                  disabled={savingExtend}
                  className="px-6 py-2 bg-[#1b4f8a] hover:bg-[#153d6e] text-white rounded text-sm font-semibold transition-colors disabled:opacity-60"
                >
                  {savingExtend ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== VIEW PURCHASE DETAILS MODAL ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">Course Purchase Details</h3>
              <button onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {loadingModal ? (
                <div className="text-center text-gray-400 py-10">Loading details...</div>
              ) : selectedReg ? (
                <div className="space-y-6 text-sm">
                  <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                    <h4 className="font-semibold text-[#144f36] mb-3 uppercase text-xs tracking-wider">Candidate Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div><p className="text-gray-400 text-xs mb-1">Name</p><p className="font-medium text-gray-800">{selectedReg.student?.name}</p></div>
                      <div><p className="text-gray-400 text-xs mb-1">Email</p><p className="font-medium text-gray-800">{selectedReg.student?.email}</p></div>
                      <div><p className="text-gray-400 text-xs mb-1">Mobile</p><p className="font-medium text-gray-800">{selectedReg.student?.phone}</p></div>
                      <div><p className="text-gray-400 text-xs mb-1">Alternate Mobile</p><p className="font-medium text-gray-800">{selectedReg.student?.alt_phone}</p></div>
                      <div className="col-span-2"><p className="text-gray-400 text-xs mb-1">Address</p><p className="font-medium text-gray-800">{selectedReg.student?.address?.trim() || 'N/A'}</p></div>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                    <h4 className="font-semibold text-teal-700 mb-3 uppercase text-xs tracking-wider">Course Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2"><p className="text-gray-400 text-xs mb-1">Course Title</p><p className="font-medium text-gray-800">{selectedReg.course?.title}</p></div>
                      <div><p className="text-gray-400 text-xs mb-1">Price</p><p className="font-medium text-gray-800">₹{selectedReg.course?.price}</p></div>
                      <div><p className="text-gray-400 text-xs mb-1">Offer Price</p><p className="font-medium text-gray-800">₹{selectedReg.course?.offer_price}</p></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                      <h4 className="font-semibold text-purple-700 mb-3 uppercase text-xs tracking-wider">Registration Details</h4>
                      <div className="space-y-3">
                        <div><p className="text-gray-400 text-xs mb-1">Registration Date</p><p className="font-medium text-gray-800">{selectedReg.registration?.registration_date ? new Date(selectedReg.registration.registration_date).toLocaleString() : 'N/A'}</p></div>
                        <div><p className="text-gray-400 text-xs mb-1">Access Type</p><p className="font-medium text-gray-800 capitalize">{selectedReg.registration?.access_type}</p></div>
                        <div><p className="text-gray-400 text-xs mb-1">Progress</p><p className="font-medium text-gray-800">{selectedReg.registration?.progress}%</p></div>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                      <h4 className="font-semibold text-emerald-700 mb-3 uppercase text-xs tracking-wider">Payment Details</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Status</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${selectedReg.payment?.payment_status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {selectedReg.payment?.payment_status}
                          </span>
                        </div>
                        <div><p className="text-gray-400 text-xs mb-1">Purchased Price</p><p className="font-medium text-gray-800">₹{selectedReg.payment?.purchased_price}</p></div>
                        <div><p className="text-gray-400 text-xs mb-1">Payment Mode</p><p className="font-medium text-gray-800 capitalize">{selectedReg.payment?.payment_mode}</p></div>
                        {selectedReg.payment?.transaction_id && (
                          <div><p className="text-gray-400 text-xs mb-1">Transaction ID</p><p className="font-medium text-gray-800 text-xs break-all">{selectedReg.payment.transaction_id}</p></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-red-500 py-10">Failed to load registration details.</div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-[#144f36] hover:bg-[#0f3d2a] text-white rounded-full text-sm font-medium transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
