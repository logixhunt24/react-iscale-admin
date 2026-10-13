import { useState, useEffect } from 'react'
import { Edit2, Trash2, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

const DAYS_OPTIONS = [
  { value: 'mon', label: 'Mon' },
  { value: 'tue', label: 'Tue' },
  { value: 'wed', label: 'Wed' },
  { value: 'thu', label: 'Thu' },
  { value: 'fri', label: 'Fri' },
  { value: 'sat', label: 'Sat' },
  { value: 'sun', label: 'Sun' }
]

export default function BatchManagement() {
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)

  // Dependencies
  const [courses, setCourses] = useState([])
  const [instructors, setInstructors] = useState([])

  // Form State
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)
  const [formData, setFormData] = useState({
    batch_name: '',
    batch_instructor_id: '',
    batch_instructor: '',
    batch_course: '',
    batch_date: '',
    start_time: '',
    end_time: '',
    strength: '',
    m_batch_notice_desc: '',
    m_batch_notice_link: '',
    order: '',
    subject: '',
    m_batch_days: [],
    m_batch_status: 0
  })
  const [imageFile, setImageFile] = useState(null)

  // Loading states
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const fetchDependencies = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }
      
      const [coursesRes, instructorsRes] = await Promise.all([
        axios.get(`${BASE_URL}/myadmin/course/all-courses?limit=1000`, { headers }),
        axios.get(`${BASE_URL}/myadmin/instructor/get-all-instructors?limit=1000`, { headers })
      ])
      
      if (coursesRes.data.status) setCourses(coursesRes.data.data)
      if (instructorsRes.data.status) setInstructors(instructorsRes.data.data)
    } catch (error) {
      console.error('Error fetching dependencies:', error)
    }
  }

  const fetchBatches = async () => {
    setLoading(true); 
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/myadmin/batch/all`, {
        params: { page: currentPage, limit: entriesPerPage },
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data.status) {
        setData(response.data.data || [])
        setTotalPages(response.data.totalPages || 1)
        setTotalRecords(response.data.total || 0)
      }
    } catch (error) {
      console.error('Error fetching batches:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDependencies()
  }, [])

  useEffect(() => {
    fetchBatches()
  }, [currentPage, entriesPerPage])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'batch_instructor_id') {
      const selectedInst = instructors.find(i => i._id === value)
      setFormData(prev => ({
        ...prev,
        batch_instructor_id: value,
        batch_instructor: selectedInst ? selectedInst.m_instructor_name : ''
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleDayChange = (dayValue) => {
    setFormData(prev => {
      const newDays = prev.m_batch_days.includes(dayValue)
        ? prev.m_batch_days.filter(d => d !== dayValue)
        : [...prev.m_batch_days, dayValue]
      return { ...prev, m_batch_days: newDays }
    })
  }

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0])
  }

  const resetForm = () => {
    setFormData({
      batch_name: '',
      batch_instructor_id: '',
      batch_instructor: '',
      batch_course: '',
      batch_date: '',
      start_time: '',
      end_time: '',
      strength: '',
      m_batch_notice_desc: '',
      m_batch_notice_link: '',
      order: '',
      subject: '',
      m_batch_days: [],
      m_batch_status: 0
    })
    setImageFile(null)
    setEditId(null)
    setIsEditing(false)
    const fileInput = document.getElementById('batch-image-upload')
    if (fileInput) fileInput.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const submitData = new FormData()
      
      Object.keys(formData).forEach(key => {
        if (key === 'm_batch_days') {
          formData[key].forEach(day => submitData.append('m_batch_days', day))
        } else {
          submitData.append(key, formData[key] || '')
        }
      })
      
      if (imageFile) {
        submitData.append('m_batch_image', imageFile)
      }

      let response;
      if (isEditing) {
        response = await axios.put(`${BASE_URL}/myadmin/batch/update/${editId}`, submitData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      } else {
        response = await axios.post(`${BASE_URL}/myadmin/batch/add`, submitData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      }

      if (response.data.status) {
        resetForm()
        fetchBatches()
      } else {
        await window.customAlert('Failed to save batch')
      }
    } catch (error) {
      console.error('Error saving batch:', error)
      await window.customAlert('Error saving batch')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/myadmin/batch/get/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data.status) {
        const batch = response.data.data
        setFormData({
          batch_name: batch.batch_name || '',
          batch_instructor_id: batch.batch_instructor_id?._id || batch.batch_instructor_id || '',
          batch_instructor: batch.batch_instructor || '',
          batch_course: batch.batch_course?._id || batch.batch_course || '',
          batch_date: batch.batch_date ? batch.batch_date.split('T')[0] : '',
          start_time: batch.start_time || '',
          end_time: batch.end_time || '',
          strength: batch.strength || '',
          m_batch_notice_desc: batch.m_batch_notice_desc || '',
          m_batch_notice_link: batch.m_batch_notice_link || '',
          order: batch.order || '',
          subject: batch.subject || '',
          m_batch_days: batch.m_batch_days || [],
          m_batch_status: batch.m_batch_status || 0
        })
        setImageFile(null)
        setEditId(id)
        setIsEditing(true)
      }
    } catch (error) {
      console.error('Error fetching batch:', error)
    }
  }

  const handleDelete = async (id) => {
    if (await window.customConfirm('Are you sure you want to delete this batch?')) {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.delete(`${BASE_URL}/myadmin/batch/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.data.status) {
          fetchBatches()
        }
      } catch (error) {
        console.error('Error deleting batch:', error)
      }
    }
  }

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(totalPages, startPage + 4)
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4)
    }
    
    const pages = []
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  return (
    <div className="p-4 md:p-6 h-full bg-[#eef2f6]">
      {/* Title Card - Full Width */}
      <div className="bg-[#144f36] rounded-t-2xl p-5 flex justify-between items-center shadow-md relative overflow-hidden group mb-5">
        <h2 className="text-white font-bold tracking-tight text-lg font-bold">Batch Management</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Table Section */}
          <div className="bg-[#f6f6ff] dark:bg-[#1f1b2e] border border-slate-200 dark:border-[#1f1b2e] rounded-xl overflow-hidden p-3 md:p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-3">
              <div className="flex items-center gap-2 mb-3 sm:mb-0">
                <span className="text-xs text-slate-800 dark:text-slate-200">Show</span>
                <select 
                  value={entriesPerPage}
                  onChange={handleEntriesChange}
                  className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-1.5 py-1 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 bg-[#f6f6ff] dark:bg-[#1f1b2e] text-slate-800 dark:text-slate-200"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-xs text-slate-800 dark:text-slate-200">Entries</span>
              </div>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-[11px] md:text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#1f1b2e]">
                <thead className="bg-slate-50 dark:bg-[#13111c] text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-gray-800">
                  <tr>
                    <th className="px-2 py-2 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">S.No.</th>
                    <th className="px-2 py-2 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Batch Name</th>
                    <th className="px-2 py-2 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Batch Instructor</th>
                    <th className="px-2 py-2 font-bold border-r border-slate-200 dark:border-gray-800/50 min-w-[100px]">Course</th>
                    <th className="px-2 py-2 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Date</th>
                    <th className="px-2 py-2 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Start Time</th>
                    <th className="px-2 py-2 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">End Time</th>
                    <th className="px-2 py-2 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Strength</th>
                    <th className="px-2 py-2 font-bold border-r border-slate-200 dark:border-gray-800/50 min-w-[120px]">Subject</th>
                    <th className="px-2 py-2 font-bold whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="10" className="text-center py-4">Loading...</td></tr>
                  ) : data.length === 0 ? (
                    <tr><td colSpan="10" className="text-center py-4">No batches found</td></tr>
                  ) : data.map((row, index) => (
                    <tr key={row._id} className="border-b border-slate-200 dark:border-gray-800/50 bg-[#f6f6ff] dark:bg-[#1f1b2e] hover:bg-slate-50 dark:bg-[#1f1b2e]/50 transition-colors">
                      <td className="px-2 py-2 border-r border-slate-200 dark:border-gray-800/50 align-top">
                        {(currentPage - 1) * entriesPerPage + index + 1}
                      </td>
                      <td className="px-2 py-2 border-r border-slate-200 dark:border-gray-800/50 align-top text-blue-600 font-medium">
                        <div className="w-28 md:w-36 break-words uppercase">{row.batch_name}</div>
                      </td>
                      <td className="px-2 py-2 border-r border-slate-200 dark:border-gray-800/50 align-top">{row.batch_instructor}</td>
                      <td className="px-2 py-2 border-r border-slate-200 dark:border-gray-800/50 align-top">
                        <div className="w-24 md:w-32 break-words">
                           {row.batch_course ? courses.find(c => c._id === (row.batch_course._id || row.batch_course))?.title || 'Course ID: ' + (row.batch_course._id || row.batch_course).substring(0,6) : 'N/A'}
                        </div>
                      </td>
                      <td className="px-2 py-2 border-r border-slate-200 dark:border-gray-800/50 align-top">{row.batch_date ? new Date(row.batch_date).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-2 py-2 border-r border-slate-200 dark:border-gray-800/50 align-top">{row.start_time}</td>
                      <td className="px-2 py-2 border-r border-slate-200 dark:border-gray-800/50 align-top">{row.end_time}</td>
                      <td className="px-2 py-2 border-r border-slate-200 dark:border-gray-800/50 align-top">{row.strength}</td>
                      <td className="px-2 py-2 border-r border-slate-200 dark:border-gray-800/50 align-top">
                        <div className="w-32 md:w-40 break-words text-[10px] leading-tight">{row.subject}</div>
                      </td>
                      <td className="px-2 py-2 align-top">
                        <div className="flex gap-1.5">
                          <Link to={`/batch/students/${row._id}`} title="Manage students" className="bg-blue-600 text-white p-1.5 rounded hover:bg-blue-700 transition-colors w-fit">
                            <Users size={12} />
                          </Link>
                          <button onClick={() => handleEdit(row._id)} className="bg-orange-500 text-white p-1.5 rounded hover:bg-orange-600 transition-colors w-fit">
                            <Edit2 size={12} />
                          </button>
                          <button onClick={() => handleDelete(row._id)} className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600 transition-colors w-fit">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-3 flex justify-between items-center text-xs text-slate-800 dark:text-slate-200">
               <div>
                Showing {Math.min((currentPage - 1) * entriesPerPage + 1, totalRecords)} to {Math.min(currentPage * entriesPerPage, totalRecords)} of {totalRecords} entries
               </div>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`mr-2 ${currentPage === 1 ? 'text-slate-600 dark:text-slate-400' : 'text-slate-800 dark:text-slate-200 cursor-pointer'}`}
                >
                  Pre
                </button>
                {getPageNumbers().map(pageNum => (
                  <button 
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${currentPage === pageNum ? 'bg-slate-50 dark:bg-[#13111c] text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-gray-800' : 'hover:bg-slate-100 dark:bg-[#1f1b2e]/50 text-slate-600 dark:text-slate-400'}`}
                  >
                    {pageNum}
                  </button>
                ))}
                <button 
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`ml-2 ${currentPage === totalPages ? 'text-slate-600 dark:text-slate-400' : 'text-slate-800 dark:text-slate-200 cursor-pointer'}`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full lg:w-[280px] xl:w-[320px] bg-[#f6f6ff] rounded-2xl shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow border border-slate-100 transition-colors p-4 h-fit shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-indigo-900 dark:text-indigo-300 font-bold tracking-tight text-base font-bold text-center w-full">
              {isEditing ? 'Update Batch' : 'Add New Batch'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Batch Name</label>
              <input type="text" name="batch_name" value={formData.batch_name} onChange={handleChange} required placeholder="Enter Batch Name" className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-2 py-1.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Batch Instructor</label>
              <select name="batch_instructor_id" value={formData.batch_instructor_id} onChange={handleChange} className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-2 py-1.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600">
                <option value="">Select Instructor</option>
                {instructors.map(inst => (
                  <option key={inst._id} value={inst._id}>{inst.m_instructor_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Batch Image</label>
              <div className="flex border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded overflow-hidden">
                <input id="batch-image-upload" type="file" onChange={handleFileChange} className="text-xs w-full file:border-0 file:bg-slate-100 dark:bg-[#1f1b2e]/50 file:px-2 file:py-1.5 file:text-xs file:text-slate-700 dark:text-slate-300 hover:file:bg-slate-200" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Batch Course</label>
              <select name="batch_course" value={formData.batch_course} onChange={handleChange} className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-2 py-1.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600">
                <option value="">Select Course</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>{course.title || course.m_course_title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Date</label>
              <input type="date" name="batch_date" value={formData.batch_date} onChange={handleChange} className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-2 py-1.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Start Time</label>
              <input type="time" name="start_time" value={formData.start_time} onChange={handleChange} className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-2 py-1.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">End Time</label>
              <input type="time" name="end_time" value={formData.end_time} onChange={handleChange} className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-2 py-1.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Strength</label>
              <input type="number" name="strength" value={formData.strength} onChange={handleChange} placeholder="Enter strength" className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-2 py-1.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Notice Description</label>
              <textarea name="m_batch_notice_desc" value={formData.m_batch_notice_desc} onChange={handleChange} placeholder="Notice Description" rows={2} className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-2 py-1.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 resize-none"></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Notice Link</label>
              <input type="text" name="m_batch_notice_link" value={formData.m_batch_notice_link} onChange={handleChange} placeholder="Notice Link" className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-2 py-1.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Order</label>
              <input type="number" name="order" value={formData.order} onChange={handleChange} placeholder="Enter Order" className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-2 py-1.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Subject</label>
              <textarea name="subject" value={formData.subject} onChange={handleChange} placeholder="Enter Subject" rows={2} className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-2 py-1.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 resize-none"></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Days</label>
              <div className="flex flex-col gap-1.5 h-32 overflow-y-auto pr-2">
                {DAYS_OPTIONS.map(day => (
                  <label key={day.value} className="flex items-center gap-2 text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.m_batch_days.includes(day.value)}
                      onChange={() => handleDayChange(day.value)}
                      className="rounded border-slate-300 dark:border-slate-600 w-3 h-3" 
                    />
                    {day.label}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              {isEditing && (
                <button type="button" onClick={resetForm} className="w-full py-2 bg-slate-400 text-white text-sm rounded hover:bg-slate-500 transition-colors">
                  Cancel
                </button>
              )}
              <button disabled={submitting} type="submit" className="w-full py-2 bg-[#428bca] text-white text-sm rounded hover:bg-[#3071a9] transition-colors disabled:bg-opacity-50">
                {submitting ? 'Saving...' : (isEditing ? 'Update' : 'Submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

