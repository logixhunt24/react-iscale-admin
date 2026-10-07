import { useState, useEffect } from 'react'
import * as Icons from 'lucide-react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

// A course is organised Module -> Subject -> Topic. This is the top level:
// each module becomes a tab on the course page, and holds the subjects that
// are assigned to it (assigned from the subject's own add/edit form).
export default function CourseModules() {
  const { id } = useParams() // course ID
  const [searchTerm, setSearchTerm] = useState('')
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [courseTitle, setCourseTitle] = useState('')

  useEffect(() => {
    fetchModules()
    fetchCourseTitle()
  }, [id])

  const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

  const fetchCourseTitle = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/myadmin/course/course/${id}`, { headers: authHeaders() })
      if (response.data?.status && response.data.data) {
        setCourseTitle(response.data.data.title || '')
      }
    } catch (error) {
      console.error('Error fetching course details:', error)
    }
  }

  const fetchModules = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${BASE_URL}/myadmin/module/get-modules/${id}`, { headers: authHeaders() })
      setModules(response.data?.status ? response.data.data || [] : [])
    } catch (error) {
      console.error('Error fetching modules:', error)
      setModules([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (moduleId) => {
    if (!await window.customConfirm('Delete this module? Its subjects are kept, they just become ungrouped.')) return
    try {
      const response = await axios.delete(`${BASE_URL}/myadmin/module/delete-module/${moduleId}`, { headers: authHeaders() })
      await window.customAlert(response.data?.message || 'Deleted successfully')
      fetchModules()
    } catch (error) {
      console.error('Error deleting module:', error)
      await window.customAlert(error.response?.data?.message || 'Delete failed')
    }
  }

  const updateModule = async (moduleId, payload) => {
    try {
      await axios.put(`${BASE_URL}/myadmin/module/update-module/${moduleId}`, payload, { headers: authHeaders() })
    } catch (error) {
      console.error('Error updating module:', error)
      await window.customAlert(error.response?.data?.message || 'Update failed')
      fetchModules()
    }
  }

  const handleSequenceInput = (moduleId, seq) => {
    setModules(prev => prev.map(m => m._id === moduleId ? { ...m, m_module_seq: seq } : m))
  }

  const handleStatusToggle = (mod) => {
    const newStatus = mod.m_module_status === 1 ? 0 : 1
    setModules(prev => prev.map(m => m._id === mod._id ? { ...m, m_module_status: newStatus } : m))
    updateModule(mod._id, { m_module_status: newStatus })
  }

  const filtered = modules.filter(m => m.m_module_title?.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#144f36] rounded-t-2xl p-5 flex justify-between items-center shadow-md relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>

        <div className="flex items-center relative z-10">
          <div className="w-1.5 h-7 bg-white dark:bg-[#13111c]/90 rounded-full mr-4 shadow-[0_0_12px_rgba(255,255,255,0.9)] hidden sm:block"></div>
          <h2 className="text-white font-bold tracking-wide text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">Module List{courseTitle ? ` (${courseTitle})` : ''}</h2>
        </div>

        <div className="flex gap-4 relative z-10">
          <Link to={'/courses/all'} className="inline-block bg-white hover:bg-slate-50 text-[#144f36] px-5 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all hover:-translate-y-0.5">
            Back To Courses
          </Link>
          <Link to={`/courses/modules/add/${id}`} className="bg-white hover:bg-slate-50 text-[#144f36] px-5 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all flex items-center gap-2 hover:-translate-y-0.5">
            <span>+ Add New</span>
          </Link>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col min-h-0 bg-white border-x border-b border-slate-200 rounded-b-2xl">
        <p className="text-xs text-slate-500 mb-3">
          Modules are the top level of the course: each one is a tab on the course page and holds subjects, which in turn hold topics.
          Assign a subject to a module from the subject's Add/Edit form.
        </p>
        <div className="flex items-center justify-end mb-4 shrink-0">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36] w-full sm:w-64"
          />
        </div>

        <div className="overflow-auto border border-slate-200 dark:border-[#1f1b2e] flex-1 min-h-0">
          <table className="w-full text-left text-sm text-slate-800 dark:text-slate-200">
            <thead className="bg-slate-50 dark:bg-[#13111c] text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">S.No.</th>
                <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Module Title</th>
                <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap text-center">Total Subjects</th>
                <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap text-center">Subjects</th>
                <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap text-center">Sequence</th>
                <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap text-center">Status</th>
                <th className="px-3 py-3 font-bold whitespace-nowrap text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-8">Loading modules...</td></tr>
              ) : filtered.length > 0 ? (
                filtered.map((row, index) => (
                  <tr key={row._id} className="border-b border-slate-200 dark:border-gray-800/50 hover:bg-[#eaf3f8]/60 dark:hover:bg-indigo-900/20 transition-all duration-200">
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle text-[#144f36]">{index + 1}</td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle text-slate-700 dark:text-slate-300 font-semibold">{row.m_module_title}</td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">{row.total_subjects || 0}</td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                      <Link to={`/courses/subjects/${id}`} className="bg-[#144f36] text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-[#0f3d2a] transition-colors inline-flex items-center gap-1.5">
                        <Icons.Book size={12} /> Subjects
                      </Link>
                    </td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                      <input
                        type="number"
                        value={row.m_module_seq ?? 0}
                        onChange={(e) => handleSequenceInput(row._id, Number(e.target.value))}
                        onBlur={(e) => updateModule(row._id, { m_module_seq: Number(e.target.value) })}
                        className="w-16 border border-slate-300 dark:border-gray-700 rounded px-2 py-1 text-center text-sm outline-none focus:border-[#144f36] bg-transparent text-slate-800 dark:text-slate-200"
                      />
                    </td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                      <button onClick={() => handleStatusToggle(row)} className={`px-3 py-1 rounded-full text-xs font-medium text-white transition-colors whitespace-nowrap ${row.m_module_status === 1 ? 'bg-[#144f36]' : 'bg-slate-400'}`}>
                        {row.m_module_status === 1 ? 'Active' : 'In-Active'}
                      </button>
                    </td>
                    <td className="px-3 py-3 align-middle text-center">
                      <div className="flex gap-2 justify-center">
                        <Link to={`/courses/modules/add/${id}`} state={{ editModule: row }} className="inline-block bg-[#d87025] text-white p-1.5 rounded-full hover:bg-[#c2621f] transition-colors" title="Edit">
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
                <tr><td colSpan="7" className="text-center py-8 text-slate-500">No modules yet — without modules, all of this course's subjects show together on the course page.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
