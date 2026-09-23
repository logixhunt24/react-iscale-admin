import IconButton from '../../components/common/IconButton'
import { useState, useMemo, useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../../config/api'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, Trash2, Search, Download, Copy, FileSpreadsheet, FileText, Printer } from 'lucide-react'

const TOTAL_ENTRIES_MOCK = 53547

export default function AnalyticsList() {
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(50)

  // Filter States
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [leadGenerate, setLeadGenerate] = useState('--Select Lead Generate--')
  const [searchName, setSearchName] = useState('')

  const [appliedFilters, setAppliedFilters] = useState({
    fromDate: '',
    toDate: '',
    leadGenerate: '--Select Lead Generate--',
    searchName: ''
  })
  
  const [templates, setTemplates] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${BASE_URL}/myadmin/data-analytics/all`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.data?.status && res.data.data) {
          const formattedData = res.data.data.map(item => ({
            _id: item._id,
            lead: item.m_lg_title || 'Lead Data',
            name: item.data_name || 'N/A',
            mobile: item.data_mobile || 'N/A',
            email: item.data_email || 'N/A',
            gender: item.data_gender || 'N/A',
            date: new Date(item.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-'),
            originalDate: item.createdAt
          }))
          setTemplates(formattedData)
        }
      } catch (err) {
        console.error("Failed to load analytics", err)
      }
    }
    fetchData()
  }, [])

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      let match = true
      if (appliedFilters.searchName && !t.name.toLowerCase().includes(appliedFilters.searchName.toLowerCase())) match = false
      if (appliedFilters.leadGenerate !== '--Select Lead Generate--' && t.lead !== appliedFilters.leadGenerate) match = false
      
      if (appliedFilters.fromDate) {
        const fromTime = new Date(`${appliedFilters.fromDate}T00:00:00`).getTime();
        const itemTime = new Date(t.originalDate).getTime();
        if (itemTime < fromTime) match = false;
      }
      
      if (appliedFilters.toDate) {
        const toTime = new Date(`${appliedFilters.toDate}T23:59:59`).getTime();
        const itemTime = new Date(t.originalDate).getTime();
        if (itemTime > toTime) match = false;
      }

      return match
    })
  }, [templates, appliedFilters])

  const isFiltered = appliedFilters.searchName || appliedFilters.leadGenerate !== '--Select Lead Generate--' || appliedFilters.fromDate || appliedFilters.toDate

  const currentTotal = isFiltered ? filteredTemplates.length : TOTAL_ENTRIES_MOCK
  const TOTAL_PAGES = Math.ceil(currentTotal / entriesPerPage) || 1

  const startIndex = (currentPage - 1) * entriesPerPage
  const endIndex = Math.min(startIndex + entriesPerPage, currentTotal)

  const currentData = useMemo(() => {
    if (filteredTemplates.length === 0) return []
    const numItems = Math.min(entriesPerPage, currentTotal - startIndex)
    
    return Array.from({ length: numItems }, (_, i) => {
      const template = filteredTemplates[i % filteredTemplates.length]
      return {
        _id: template._id,
        id: startIndex + i + 1,
        sno: startIndex + i + 1,
        leadName: template.lead,
        fullName: template.name,
        mobile: template.mobile,
        email: template.email,
        gender: template.gender,
        createdAt: template.date
      }
    })
  }, [filteredTemplates, startIndex, entriesPerPage, currentTotal])

  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(TOTAL_PAGES, startPage + 4)
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4)
    }
    const pages = []
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  const handleSearch = () => {
    setAppliedFilters({ fromDate, toDate, leadGenerate, searchName })
    setCurrentPage(1)
  }

  const handleReset = () => {
    setFromDate('')
    setToDate('')
    setLeadGenerate('--Select Lead Generate--')
    setSearchName('')
    setAppliedFilters({
      fromDate: '',
      toDate: '',
      leadGenerate: '--Select Lead Generate--',
      searchName: ''
    })
    setCurrentPage(1)
  }

  const handleExport = () => {
    const headers = ['S.No.', 'Lead Name', 'Full Name', 'Mobile', 'Email', 'Gender', 'CreatedAt']
    const csvRows = [headers.join(',')]
    filteredTemplates.forEach((template, i) => {
      const values = [
        i + 1,
        `"${template.lead}"`,
        `"${template.name}"`,
        `"${template.mobile}"`,
        `"${template.email}"`,
        template.gender,
        template.date
      ]
      csvRows.push(values.join(','))
    })
    const csvContent = csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'analytics_export.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDelete = async (id) => {
    if (!await window.customConfirm('Are you sure you want to delete this record?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`${BASE_URL}/myadmin/data-analytics/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.status || res.status === 200 || res.status === 204) {
        setTemplates(prev => prev.filter(t => t._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete record", err);
      await window.customAlert("Failed to delete record");
    }
  };

  return (
    <div className="h-full animate-fade-in-up flex flex-col gap-4">
      {/* Top Header */}
      <div className="bg-[#144f36] dark:bg-[#0f3d2a] rounded-xl shadow-sm border border-[#144f36] p-4">
        <h2 className="text-lg font-bold text-white tracking-tight">Analytics List</h2>
      </div>

      {/* Filters */}
      <div className="bg-[#f6f6ff] dark:bg-[#1f1b2e] rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">From Date</label>
            <div className="relative">
              <input 
                type="date" 
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">To Date</label>
            <div className="relative">
              <input 
                type="date" 
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Lead Generate</label>
            <select 
              value={leadGenerate}
              onChange={(e) => setLeadGenerate(e.target.value)}
              className="w-full border border-slate-300 dark:border-gray-700 rounded px-3 py-2 text-sm outline-none bg-white dark:bg-[#13111c] focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
            >
              <option>--Select Lead Generate--</option>
              <option>A.I. Full Course (Free) | Master AI Tools & Core Concepts Notes</option>
              <option>Advanced AI Full Course (100% FREE) 2026 | Download PDF</option>
              <option>AI Masterclass | Tools & Prompt Notes</option>
              <option>Data Analyst Course Form</option>
              <option>Prompt Engineering Full Course | Beginner To Pro</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div>
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Search By Name</label>
            <input 
              type="text" 
              placeholder="Search..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
            />
          </div>
          <div className="md:col-span-3 flex gap-3 pb-0">
            <button 
              onClick={handleSearch}
              className="bg-[#144f36] text-white px-6 py-2 rounded-full font-bold hover:bg-[#0f3d2a] transition-colors shadow-sm flex items-center justify-center"
            >
              Search / Filter
            </button>
            <button 
              onClick={handleReset}
              className="bg-white text-[#144f36] border border-[#144f36] px-6 py-2 rounded-full font-bold hover:bg-slate-50 transition-colors shadow-sm"
            >
              Reset
            </button>
            <button 
              onClick={handleExport}
              className="bg-white text-[#144f36] border border-[#144f36] px-6 py-2 rounded-full font-bold hover:bg-slate-50 transition-colors shadow-sm"
            >
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Table Data Box */}
      <div className="bg-[#f6f6ff] dark:bg-[#1f1b2e] rounded-xl shadow-sm border border-slate-200 flex flex-col flex-1 min-h-[300px]">
        <div className="p-4 flex items-center gap-4 border-b border-slate-200 dark:border-gray-800/50">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-700">Show</span>
            <select 
              value={entriesPerPage}
              onChange={async (e) => {
                setEntriesPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-[#144f36]"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-slate-700">Entries</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handleExport} className="p-1.5 border border-slate-200 rounded text-blue-600 hover:bg-blue-50 transition-colors"><Copy size={16} /></button>
            <button onClick={handleExport} className="p-1.5 border border-slate-200 rounded text-green-600 hover:bg-green-50 transition-colors"><FileSpreadsheet size={16} /></button>
            <button onClick={handleExport} className="p-1.5 border border-slate-200 rounded text-red-600 hover:bg-red-50 transition-colors"><FileText size={16} /></button>
            <button onClick={() => window.print()} className="p-1.5 border border-slate-200 rounded text-teal-600 hover:bg-teal-50 transition-colors"><Printer size={16} /></button>
          </div>
        </div>
        
        <div className="p-4 flex-1 flex flex-col min-h-0">
          <div className="overflow-auto border border-slate-200 dark:border-[#1f1b2e] flex-1 rounded-t-lg">
            <table className="w-full text-left text-sm text-slate-800 dark:text-slate-200">
              <thead className="bg-[#1e405a] text-white border-b border-slate-200 dark:border-gray-800">
                <tr>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">S.No.</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Lead Name</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Full Name</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Mobile</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Email</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Gender</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">CreatedAt</th>
                  <th className="px-4 py-3 font-bold whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? currentData.map((row) => (
                  <tr key={row.id} className={`border-b border-slate-200 dark:border-gray-800/50 hover:bg-slate-50 dark:bg-[#1f1b2e]/50 bg-white dark:bg-[#1f1b2e]`}>
                    <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">{row.sno}</td>
                    <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">{row.leadName}</td>
                    <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">{row.fullName}</td>
                    <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">{row.mobile}</td>
                    <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">{row.email}</td>
                    <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">{row.gender}</td>
                    <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">{row.createdAt}</td>
                    <td className="px-4 py-3 align-middle">
                      <div className="flex gap-2">
                        <Link 
                          to={`/analytics/details/${row._id}`}
                          className="inline-block bg-[#144f36] text-white p-1.5 rounded hover:bg-[#0f3d2a] transition-colors shadow-sm" 
                          title="View"
                        >
                          <Eye size={14} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(row._id)}
                          className="bg-red-600 text-white p-1.5 rounded hover:bg-red-700 transition-colors shadow-sm" 
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-slate-500">No results found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination Box */}
      {currentData.length > 0 && (
        <div className="bg-[#f6f6ff] dark:bg-[#1f1b2e] rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-800 dark:text-slate-200">
            <div className="mb-4 md:mb-0">
              Showing {startIndex + 1} to {endIndex} of {currentTotal} entries
            </div>
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-white dark:bg-[#1f1b2e] border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                «
              </button>
              {getPageNumbers().map(pageNum => (
                <button 
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 border ${currentPage === pageNum ? 'bg-[#144f36] text-white border-[#144f36]' : 'bg-white dark:bg-[#1f1b2e] border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                >
                  {pageNum}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(TOTAL_PAGES)}
                disabled={currentPage === TOTAL_PAGES}
                className="px-3 py-1 bg-white dark:bg-[#1f1b2e] border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                »
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
