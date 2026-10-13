import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

const cell = 'px-3 py-2 border-r border-slate-200 dark:border-gray-800/50 align-top'

export default function BatchStudents() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [batch, setBatch] = useState(null)
  const [assigned, setAssigned] = useState([])
  const [eligible, setEligible] = useState([])
  const [selected, setSelected] = useState('')
  const [saving, setSaving] = useState(false)

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

  const load = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/myadmin/batch/students/${id}`, { headers: headers() })
      if (res.data.status) {
        setBatch(res.data.batch)
        setAssigned(res.data.assigned)
        setEligible(res.data.eligible)
      }
    } catch (error) {
      console.error('Error loading batch students:', error)
      await window.customAlert(error.response?.data?.message || 'Failed to load batch students')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { load() }, [load])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!selected) return
    setSaving(true)
    try {
      await axios.post(`${BASE_URL}/myadmin/batch/assign-student`, { batch_id: id, enrollment_id: selected }, { headers: headers() })
      setSelected('')
      await load()
    } catch (error) {
      await window.customAlert(error.response?.data?.message || 'Failed to add student')
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async (enrollmentId) => {
    if (!(await window.customConfirm('Remove this student from the batch?'))) return
    try {
      await axios.delete(`${BASE_URL}/myadmin/batch/remove-student/${enrollmentId}`, { headers: headers() })
      await load()
    } catch (error) {
      await window.customAlert(error.response?.data?.message || 'Failed to remove student')
    }
  }

  const full = batch && batch.strength > 0 && assigned.length >= batch.strength

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md border border-slate-100 overflow-hidden w-full">
        <div className="bg-[#144f36] p-5 flex justify-between items-center rounded-t-2xl shadow-md">
          <h2 className="text-xl font-bold text-white tracking-tight">Batch Students</h2>
          <Link to="/batch" className="inline-block bg-green-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-green-700 transition-colors">
            Go Back
          </Link>
        </div>

        {loading ? (
          <div className="p-6 text-sm">Loading...</div>
        ) : !batch ? (
          <div className="p-6 text-sm">Batch not found</div>
        ) : (
          <div className="p-6 space-y-6 text-slate-800 dark:text-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
              <div><span className="font-bold">Batch:</span> {batch.batch_name}</div>
              <div><span className="font-bold">Course:</span> {batch.course_title || 'N/A'}</div>
              <div><span className="font-bold">Timing:</span> {batch.start_time || '-'} / {batch.end_time || '-'}</div>
              <div><span className="font-bold">Students:</span> {assigned.length}{batch.strength > 0 ? ` / ${batch.strength}` : ''}</div>
            </div>

            <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 sm:items-end">
              <div className="flex-1 max-w-md">
                <label className="block text-sm font-bold mb-2">Add Student</label>
                <select
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                >
                  <option value="">{eligible.length ? 'Select Student' : 'No enrolled students available'}</option>
                  {eligible.map((s) => (
                    <option key={s.enrollment_id} value={s.enrollment_id}>
                      {s.name || s.email || s.contact}{s.contact ? ` (${s.contact})` : ''}{s.current_batch_name ? ` - currently in ${s.current_batch_name}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={!selected || saving || full}
                className="bg-[#1f3f66] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#152c48] transition-colors disabled:opacity-50"
              >
                {saving ? 'Adding...' : full ? 'Batch Full' : 'Add Student'}
              </button>
            </form>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 dark:border-[#1f1b2e]">
                <thead className="bg-slate-50 dark:bg-[#13111c] border-b border-slate-200 dark:border-gray-800">
                  <tr>
                    <th className={`${cell} font-bold`}>S.No.</th>
                    <th className={`${cell} font-bold`}>Student Name</th>
                    <th className={`${cell} font-bold`}>Mobile</th>
                    <th className={`${cell} font-bold`}>Email</th>
                    <th className={`${cell} font-bold`}>Gender</th>
                    <th className="px-3 py-2 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assigned.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-4">No students in this batch yet</td></tr>
                  ) : assigned.map((s, i) => (
                    <tr key={s.enrollment_id} className="border-b border-slate-200 dark:border-gray-800/50 bg-[#f6f6ff] dark:bg-[#1f1b2e]">
                      <td className={cell}>{i + 1}</td>
                      <td className={cell}>{s.name}</td>
                      <td className={cell}>{s.contact}</td>
                      <td className={cell}>{s.email}</td>
                      <td className={cell}>{s.gender}</td>
                      <td className="px-3 py-2">
                        <button onClick={() => handleRemove(s.enrollment_id)} className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600 transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
