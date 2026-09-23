import { useState, useEffect } from 'react'
import * as Icons from 'lucide-react'
import { Copy, FileSpreadsheet, FileText, Printer } from 'lucide-react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function CourseSubjects() {
  const navigate = useNavigate()
  const { id } = useParams() // course ID
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(50)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [courseTitle, setCourseTitle] = useState('')

  useEffect(() => {
    fetchSubjects()
    fetchCourseTitle()
  }, [id])

  const fetchCourseTitle = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/myadmin/course/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status && response.data.data) {
        setCourseTitle(response.data.data.title || '')
      }
    } catch (error) {
      console.error('Error fetching course details:', error)
    }
  }

  const fetchSubjects = async () => {
    try {
      setLoading(true); 
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/myadmin/subject/get-subjects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status) {
        setSubjects(response.data.data || [])
      } else {
        setSubjects([])
      }
    } catch (error) {
      console.error('Error fetching subjects:', error)
      setSubjects([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (subjectId) => {
    if (!await window.customConfirm('Are you sure you want to delete this subject?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await axios.delete(`${BASE_URL}/myadmin/subject/delete-subject/${subjectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status) {
        await window.customAlert(response.data.message || 'Deleted successfully')
        fetchSubjects()
      } else {
        await window.customAlert(response.data.message || 'Delete failed')
      }
    } catch (error) {
      console.error('Error deleting subject:', error)
      await window.customAlert(error.response?.data?.message || 'Delete failed')
    }
  }

  const handleSequenceInput = (subjectId, newSeq) => {
    setSubjects(prev => prev.map(s => s._id === subjectId ? { ...s, m_subject_seq: newSeq } : s))
  }

  const handleSequenceSave = async (subjectId, newSeq) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${BASE_URL}/myadmin/subject/update-subject/${subjectId}`, {
        m_subject_seq: newSeq
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (error) {
      console.error('Error updating sequence:', error)
      await window.customAlert(error.response?.data?.message || 'Failed to update sequence')
      fetchSubjects()
    }
  }

  const handleStatusToggle = async (subject) => {
    const newStatus = subject.m_subject_status === 1 ? 0 : 1
    setSubjects(prev => prev.map(s => s._id === subject._id ? { ...s, m_subject_status: newStatus } : s))
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${BASE_URL}/myadmin/subject/update-subject/${subject._id}`, {
        m_subject_status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (error) {
      console.error('Error updating status:', error)
      await window.customAlert(error.response?.data?.message || 'Failed to update status')
      fetchSubjects()
    }
  }

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  const filteredSubjects = subjects.filter(subject => 
    subject.m_subject_title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#144f36] rounded-t-2xl p-5 flex justify-between items-center shadow-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
          
          <div className="flex items-center relative z-10">
            <div className="w-1.5 h-7 bg-white dark:bg-[#13111c]/90 rounded-full mr-4 shadow-[0_0_12px_rgba(255,255,255,0.9)] hidden sm:block"></div>
            <h2 className="text-white font-bold tracking-wide text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">Subject List{courseTitle ? ` (${courseTitle})` : ''}</h2>
          </div>
          
          <div className="flex gap-4 relative z-10">
            <Link to={'/courses/all'} className="inline-block bg-white hover:bg-slate-50 text-[#144f36] px-5 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all hover:-translate-y-0.5">
              Back To Courses
            </Link>
            <Link to={`/courses/subjects/add/${id}`} className="bg-white hover:bg-slate-50 text-[#144f36] px-5 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all flex items-center gap-2 hover:-translate-y-0.5">
              <span>+ Add New</span>
            </Link>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col min-h-0 bg-white border-x border-b border-slate-200 rounded-b-2xl">
          <div className="flex flex-col xl:flex-row justify-between xl:items-center mb-4 shrink-0 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-[#333333]">
              <span>Show</span>
              <select 
                value={entriesPerPage}
                onChange={handleEntriesChange}
                className="border border-slate-300 rounded px-2 py-1 outline-none focus:border-[#144f36]"
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
                  a.download = 'subject_list.csv';
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
                  a.download = 'subject_list.csv';
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
              className="border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36] w-full sm:w-64"
            />
          </div>
        </div>

          <div className="overflow-auto border border-slate-200 dark:border-[#1f1b2e] flex-1 min-h-0">
            <table className="w-full text-left text-sm text-slate-800 dark:text-slate-200">
              <thead className="bg-slate-50 dark:bg-[#13111c] text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">S.No.</th>
                <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Subject Title</th>
                <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Icon</th>
                <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap text-center">Total Topics</th>
                <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap text-center">Topic</th>
                <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap text-center">Rating</th>
                <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap text-center">Sequence</th>
                <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap text-center">Status</th>
                <th className="px-3 py-3 font-bold whitespace-nowrap text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-8">Loading subjects...</td>
                </tr>
              ) : filteredSubjects.length > 0 ? (
                filteredSubjects.slice(0, entriesPerPage).map((row, index) => (
                  <tr key={row._id} className="border-b border-slate-200 dark:border-gray-800/50 hover:bg-[#eaf3f8]/60 dark:hover:bg-indigo-900/20 transition-all duration-200 group">
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle text-[#144f36]">{index + 1}</td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle text-slate-700 dark:text-slate-300 font-semibold">{row.m_subject_title}</td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle"></td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center text-slate-700 dark:text-slate-300 text-sm">
                      {row.total_topics || 0}
                    </td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                      <Link to={`/courses/topics/${row._id}?course=${id}`} state={{ courseId: id }} onClick={() => localStorage.setItem('currentCourseId', id)} className="bg-[#144f36] text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-[#0f3d2a] transition-colors inline-flex items-center gap-1.5">
                        <Icons.Monitor size={12} /> Topic
                      </Link>
                    </td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                      <button className="bg-[#144f36] text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-[#0f3d2a] transition-colors inline-flex items-center gap-1">
                        ★ Ratings
                      </button>
                    </td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                      <input
                        type="number"
                        value={row.m_subject_seq ?? 0}
                        onChange={(e) => handleSequenceInput(row._id, Number(e.target.value))}
                        onBlur={(e) => handleSequenceSave(row._id, Number(e.target.value))}
                        className="w-16 border border-slate-300 dark:border-gray-700 rounded px-2 py-1 text-center text-sm outline-none focus:border-[#144f36] bg-transparent text-slate-800 dark:text-slate-200"
                      />
                    </td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                      <button onClick={() => handleStatusToggle(row)} className={`px-3 py-1 rounded-full text-xs font-medium text-white transition-colors whitespace-nowrap ${row.m_subject_status === 1 ? 'bg-[#144f36]' : 'bg-slate-400'}`}>
                        {row.m_subject_status === 1 ? 'Active' : 'In-Active'}
                      </button>
                    </td>
                    <td className="px-3 py-3 align-middle text-center">
                      <div className="flex gap-2 justify-center">
                        <Link to={`/courses/subjects/add/${id}`} state={{ editSubject: row }} className="inline-block bg-[#d87025] text-white p-1.5 rounded-full hover:bg-[#c2621f] transition-colors" title="Edit">
                          <Icons.Edit2 size={12} />
                        </Link>
                        <button onClick={() => handleDelete(row._id)} className="bg-[#d9534f] text-white rounded-full p-1.5 hover:bg-[#b52b27] transition-colors" title="Delete">
                          <Icons.Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-slate-500">No subjects found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

