import { useState } from 'react'
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function AddCourseModule() {
  const navigate = useNavigate()
  const { id } = useParams() // course id
  const location = useLocation()

  const editModule = location.state?.editModule
  const isEditing = !!editModule

  const [title, setTitle] = useState(editModule?.m_module_title || '')
  const [description, setDescription] = useState(editModule?.m_module_desc || '')
  const [status, setStatus] = useState(editModule?.m_module_status ?? 1)
  const [sequence, setSequence] = useState(editModule?.m_module_seq ?? 0)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` }
      const payload = {
        m_module_title: title,
        m_module_desc: description,
        m_module_status: Number(status),
        m_module_seq: Number(sequence),
      }

      const response = isEditing
        ? await axios.put(`${BASE_URL}/myadmin/module/update-module/${editModule._id}`, payload, { headers })
        : await axios.post(`${BASE_URL}/myadmin/module/add-module`, { ...payload, m_module_course: id }, { headers })

      if (response.data?.status) {
        await window.customAlert(response.data.message || 'Saved successfully')
        navigate(`/courses/modules/${id}`)
      } else {
        await window.customAlert(response.data?.message || 'Operation failed')
      }
    } catch (error) {
      console.error('Error saving module:', error)
      await window.customAlert(error.response?.data?.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = 'w-full border border-slate-300 dark:border-gray-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] bg-white dark:bg-[#13111c] text-slate-800 dark:text-slate-200'

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow border border-slate-100 overflow-hidden max-w-6xl mx-auto">
        <div className="bg-[#144f36] rounded-t-2xl p-5 flex justify-between items-center shadow-md relative overflow-hidden">
          <div className="flex items-center relative z-10">
            <div className="w-1.5 h-7 bg-white rounded-full mr-4 shadow-[0_0_12px_rgba(255,255,255,0.9)] hidden sm:block"></div>
            <h2 className="text-white font-bold tracking-wide text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
              {isEditing ? 'Edit Module' : 'Add New Module'}
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Module Title <span className="text-red-500">*</span></label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Module 1 - Python" className={inputClass} required />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Module Status</label>
              <select value={status} onChange={(e) => setStatus(Number(e.target.value))} className={inputClass}>
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Sequence</label>
              <input type="number" value={sequence} onChange={(e) => setSequence(e.target.value)} placeholder="Display order (lowest first)" className={inputClass} />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Module Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" rows={4} className={inputClass}></textarea>
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={saving} className="flex-1 bg-[#144f36] text-white px-8 py-2 rounded-lg text-sm font-medium hover:bg-[#0f3d2a] transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : isEditing ? 'Update Module' : 'Submit Module'}
            </button>
            <Link to={`/courses/modules/${id}`} className="inline-block flex-1 bg-[#144f36] text-white px-8 py-2 rounded-lg text-sm font-medium hover:bg-[#0f3d2a] transition-colors text-center">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
