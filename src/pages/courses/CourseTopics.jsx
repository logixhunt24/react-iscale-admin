import { useState, useEffect, useRef } from 'react'
import { Eye, Edit2, Trash2, Copy, FileSpreadsheet, FileText, Printer } from 'lucide-react'
import * as Icons from 'lucide-react'
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function CourseTopics() {
  const navigate = useNavigate()
 const { subjectId } = useParams()
const location = useLocation()

const courseId =
  new URLSearchParams(location.search).get('course') ||
  location.state?.courseId ||
  localStorage.getItem('currentCourseId')

console.log("COURSE TOPICS COURSE ID:", courseId)
  console.log("COURSE TOPICS COURSE ID:", courseId)

  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(50)
  const [searchTerm, setSearchTerm] = useState('')
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)

  const [subjectTitle, setSubjectTitle] = useState(location.state?.subjectTitle || '')
  const [courseTitle, setCourseTitle] = useState(location.state?.courseTitle || '')
  const [categoryTitle, setCategoryTitle] = useState(location.state?.categoryTitle || '')

  const fetchMetadata = async () => {
    try {
      const token = localStorage.getItem('token')
      const targetCourseId = courseId || location.state?.courseId || localStorage.getItem('currentCourseId')
      if (targetCourseId) {
        // Fetch course details
        const courseRes = await axios.get(`${BASE_URL}/myadmin/course/course/${targetCourseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (courseRes.data?.status && courseRes.data.data) {
          setCourseTitle(courseRes.data.data.title || '')
          setCategoryTitle(courseRes.data.data.category || '')
        }

        // Fetch subjects
        const subjectsRes = await axios.get(`${BASE_URL}/myadmin/subject/get-subjects/${targetCourseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (subjectsRes.data?.status && subjectsRes.data.data) {
          const currentSubject = subjectsRes.data.data.find(s => s._id === subjectId)
          if (currentSubject) {
            setSubjectTitle(currentSubject.m_subject_title || '')
          }
        }
      }
    } catch (error) {
      console.error('Error fetching metadata:', error)
    }
  }

  useEffect(() => {
    fetchTopics()
    fetchMetadata()
  }, [subjectId])

  const fetchTopics = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/myadmin/topics/get-topics/${subjectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status && response.data.data?.length > 0) {
        savedSeq.current = Object.fromEntries(response.data.data.map(t => [t._id, t.ml_seq ?? '']))
        setTopics(response.data.data)
      } else {
        setTopics([])
      }
    } catch (error) {
      console.error('Error fetching topics:', error)
      setTopics([])
    } finally {
      setLoading(false)
    }
  }

  // Remember the saved sequence so blur only hits the API when it actually changed
  const savedSeq = useRef({})

  const handleSequenceInput = (topicId, value) => {
    setTopics(prev => prev.map(t => t._id === topicId ? { ...t, ml_seq: value === '' ? '' : Number(value) } : t))
  }

  const handleSequenceSave = async (row, value) => {
    if (value === '' || String(savedSeq.current[row._id]) === String(value)) return
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(`${BASE_URL}/myadmin/topics/update-topic/${row._id}`, {
        ml_seq: Number(value)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!response.data?.status) throw new Error(response.data?.message)
      fetchTopics(false)
    } catch (error) {
      console.error('Error updating sequence:', error)
      await window.customAlert(error.response?.data?.message || error.message || 'Failed to update sequence')
      fetchTopics(false)
    }
  }

  const handleStatusToggle = async (row) => {
    const newStatus = row.ml_status === 1 ? 0 : 1
    setTopics(prev => prev.map(t => t._id === row._id ? { ...t, ml_status: newStatus } : t))
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(`${BASE_URL}/myadmin/topics/update-topic/${row._id}`, {
        ml_status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!response.data?.status) throw new Error(response.data?.message)
    } catch (error) {
      console.error('Error updating status:', error)
      await window.customAlert(error.response?.data?.message || error.message || 'Failed to update status')
      fetchTopics(false)
    }
  }

  const handleDelete = async (topicId) => {
    if (!await window.customConfirm('Are you sure you want to delete this topic?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await axios.delete(`${BASE_URL}/myadmin/topics/delete-topic/${topicId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status) {
        await window.customAlert(response.data.message || 'Deleted successfully')
        fetchTopics()
      } else {
        await window.customAlert(response.data.message || 'Delete failed')
      }
    } catch (error) {
      console.error('Error deleting topic:', error)
      await window.customAlert(error.response?.data?.message || 'Delete failed')
    }
  }

    const filteredTopics = topics.filter(topic => 
      topic.ml_title?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const TOTAL_ENTRIES = filteredTopics.length
    const TOTAL_PAGES = Math.ceil(TOTAL_ENTRIES / entriesPerPage)

    const paginatedTopics = filteredTopics.slice(
      (currentPage - 1) * entriesPerPage,
      currentPage * entriesPerPage
    )

    const handleEntriesChange = (e) => {
      setEntriesPerPage(Number(e.target.value))
      setCurrentPage(1)
    }

    const headerData = {
      subject: subjectTitle || location.state?.subjectTitle || 'Types Of Batteries',
      category: categoryTitle && categoryTitle !== 'N/A' ? categoryTitle : (location.state?.categoryTitle || 'Cohort Courses'),
      course: courseTitle || location.state?.courseTitle || 'Free Electric Vehicle Basic Course ()'
    }

    return (
      <div className="min-h-screen bg-[#eaf3f8] p-4 font-sans">
        
        {/* Header Card */}
        <div className="bg-[#144f36] rounded-t-2xl p-5 flex justify-between items-center shadow-md relative overflow-hidden group mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white dark:bg-[#13111c]/10 rounded-full blur-2xl group-hover:bg-white dark:bg-[#13111c]/20 transition-all duration-700 pointer-events-none"></div>
          
          <div className="flex items-center relative z-10 gap-10 flex-wrap flex-1">
            <div className="flex items-center">
              <div className="w-1.5 h-7 bg-white dark:bg-[#13111c]/90 rounded-full mr-4 shadow-[0_0_12px_rgba(255,255,255,0.9)] hidden sm:block"></div>
              <h2 className="text-white font-bold tracking-wide text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">Topic List</h2>
            </div>
            
            <div className="flex gap-8 text-xs text-white/80 mt-2 sm:mt-0">
              <div className="flex flex-col">
                <span className="mb-1">Subject : <span className="text-white font-medium">{topics.length > 0 ? headerData.subject : 'N/A'}</span></span>
              </div>
              <div className="flex flex-col">
                <span className="mb-1">Category : <span className="text-white font-medium">{topics.length > 0 ? headerData.category : 'N/A'}</span></span>
              </div>
              <div className="flex flex-col">
                <span className="mb-1">Course : <span className="text-white font-medium">{topics.length > 0 ? headerData.course : 'N/A'}</span></span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 relative z-10">
            <button onClick={() => navigate(-1)} className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5">
              <span>↩ Courses</span>
            </button>
            <Link
              to={`/courses/topics/add/${subjectId}?course=${courseId}`}
              state={{ courseId, courseTitle: headerData.course, categoryTitle: headerData.category, subjectTitle: headerData.subject }}
              onClick={() => localStorage.setItem('currentCourseId', courseId)}
              className="bg-white hover:bg-slate-50 text-[#144f36] px-5 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all flex items-center gap-2 hover:shadow hover:-translate-y-0.5"
            >
              <span>+ Add New Topic</span>
            </Link>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>Show</span>
                <select 
                  value={entriesPerPage}
                  onChange={handleEntriesChange}
                  className="border border-slate-300 rounded px-2 py-1 outline-none focus:border-[#144f36] bg-white"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>Entries</span>
              </div>
              
              <div className="flex rounded border border-slate-300 overflow-hidden text-sm shadow-sm bg-white">
                <button 
                  onClick={async () => {
                    const table = document.querySelector('table');
                    if (!table) return;
                    let csv = '';
                    const rows = table.querySelectorAll('tr');
                    rows.forEach(row => {
                      const cols = row.querySelectorAll('td, th');
                      const rowData = Array.from(cols).slice(0, -1).map(c => '"' + c.innerText.replace(/"/g, '""') + '"');
                      csv += rowData.join(',') + '\n';
                    });
                    navigator.clipboard.writeText(csv);
                    await window.customAlert('Table data copied to clipboard!');
                  }}
                  className="px-3.5 py-2 hover:bg-slate-50 border-r border-slate-300 text-slate-600 flex items-center justify-center transition-colors"
                  title="Copy"
                >
                  <Copy size={15} className="text-indigo-600 animate-[pulse_1.5s_infinite]" />
                </button>
                <button 
                  onClick={() => {
                    const table = document.querySelector('table');
                    if (!table) return;
                    let csv = '';
                    const rows = table.querySelectorAll('tr');
                    rows.forEach(row => {
                      const cols = row.querySelectorAll('td, th');
                      const rowData = Array.from(cols).slice(0, -1).map(c => '"' + c.innerText.replace(/"/g, '""') + '"');
                      csv += rowData.join(',') + '\n';
                    });
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'topic_list.csv';
                    a.click();
                  }}
                  className="px-3.5 py-2 hover:bg-slate-50 border-r border-slate-300 text-slate-600 flex items-center justify-center transition-colors"
                  title="Excel"
                >
                  <FileSpreadsheet size={15} className="text-emerald-600" />
                </button>
                <button 
                  onClick={() => {
                    const table = document.querySelector('table');
                    if (!table) return;
                    let csv = '';
                    const rows = table.querySelectorAll('tr');
                    rows.forEach(row => {
                      const cols = row.querySelectorAll('td, th');
                      const rowData = Array.from(cols).slice(0, -1).map(c => '"' + c.innerText.replace(/"/g, '""') + '"');
                      csv += rowData.join(',') + '\n';
                    });
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'topic_list.csv';
                    a.click();
                  }}
                  className="px-3.5 py-2 hover:bg-slate-50 border-r border-slate-300 text-slate-600 flex items-center justify-center transition-colors"
                  title="PDF"
                >
                  <FileText size={15} className="text-rose-600" />
                </button>
                <button 
                  onClick={() => window.print()}
                  className="px-3.5 py-2 hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors"
                  title="Print"
                >
                  <Printer size={15} className="text-teal-600" />
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="border border-slate-300 rounded-full px-4 py-1.5 text-sm outline-none focus:border-[#144f36] w-64 bg-white"
              />
            </div>
          </div>

          <div className="overflow-auto border border-slate-200 rounded">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-[#144f36] text-white">
                <tr>
                  <th className="px-3 py-3 font-semibold border-r border-[#0f3d2a] whitespace-nowrap">S.No. ▼</th>
                  <th className="px-3 py-3 font-semibold border-r border-[#0f3d2a] whitespace-nowrap">Title</th>
                  <th className="px-3 py-3 font-semibold border-r border-[#0f3d2a] whitespace-nowrap">Subject</th>
                  <th className="px-3 py-3 font-semibold border-r border-[#0f3d2a] whitespace-nowrap">Type ↕</th>
                  <th className="px-3 py-3 font-semibold border-r border-[#0f3d2a] whitespace-nowrap">Questions</th>
                  <th className="px-3 py-3 font-semibold border-r border-[#0f3d2a] whitespace-nowrap">PDF</th>
                  <th className="px-3 py-3 font-semibold border-r border-[#0f3d2a] whitespace-nowrap">Status</th>
                  <th className="px-3 py-3 font-semibold border-r border-[#0f3d2a] whitespace-nowrap">Sequence</th>
                  <th className="px-3 py-3 font-semibold whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center py-8">Loading topics...</td>
                  </tr>
                ) : paginatedTopics.length > 0 ? (
                  paginatedTopics.map((row, index) => (
                    <tr key={row._id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-3 py-3 border-r border-slate-200 align-middle">{(currentPage - 1) * entriesPerPage + index + 1}</td>
                      <td className="px-3 py-3 border-r border-slate-200 align-middle font-medium text-[#144f36]">{row.ml_title}</td>
                      <td className="px-3 py-3 border-r border-slate-200 align-middle">{row.m_subject_title || row.subject_title || headerData.subject || 'N/A'}</td>
                      <td className="px-3 py-3 border-r border-slate-200 align-middle">
                        {row.ml_type === '1' || row.ml_type === 'Video' ? 'Video' : 
                         row.ml_type === '2' || row.ml_type === 'Document' || row.ml_type === 'PDF' ? 'PDF' : 
                         row.ml_type === '3' || row.ml_type === 'Link' ? 'Link' : 
                         row.ml_type || 'Topic'}
                      </td>
                      <td className="px-3 py-3 border-r border-slate-200 align-middle">{row.questions || ''}</td>
                      <td className="px-3 py-3 border-r border-slate-200 align-middle"></td>
                      <td className="px-3 py-3 border-r border-slate-200 align-middle text-center">
                        <button onClick={() => handleStatusToggle(row)} className={`text-white px-4 py-1 rounded-full text-xs transition-colors whitespace-nowrap ${row.ml_status === 1 ? 'bg-[#144f36] hover:bg-[#0f3d2a]' : 'bg-slate-400 hover:bg-slate-500'}`}>
                          {row.ml_status === 1 ? 'Active' : 'In-Active'}
                        </button>
                      </td>
                      <td className="px-3 py-3 border-r border-slate-200 align-middle">
                        <input
                          type="number"
                          value={row.ml_seq ?? ''}
                          placeholder="0"
                          onChange={(e) => handleSequenceInput(row._id, e.target.value)}
                          onBlur={(e) => handleSequenceSave(row, e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
                          className="w-16 border border-slate-300 rounded px-2 py-1 text-center bg-white outline-none focus:border-[#144f36]"
                        />
                      </td>
                      <td className="px-3 py-3 align-middle">
                        <div className="flex gap-1">
                          <Link to={`/courses/topics/add/${subjectId}`} state={{ 
                              editTopic: row, 
                              courseId,
                              courseTitle: headerData.course,
                              categoryTitle: headerData.category,
                              subjectTitle: headerData.subject
                            }} className="inline-block bg-[#d87025] text-white p-1.5 rounded-full hover:bg-[#c2621f] transition-colors">
                            <Edit2 size={12} />
                          </Link>
                          <button onClick={() => handleDelete(row._id)} className="bg-[#d9534f] text-white p-1.5 rounded-full hover:bg-[#c9302c] transition-colors">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-8 text-slate-500">No topics found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
}
