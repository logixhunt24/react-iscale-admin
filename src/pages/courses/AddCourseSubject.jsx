import { useState, useEffect } from 'react'
import * as Icons from 'lucide-react'
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function AddCourseSubject() {
  const navigate = useNavigate()
  const { id } = useParams() // course id
  const location = useLocation()
  
  const editSubject = location.state?.editSubject
  const isEditing = !!editSubject

  const [title, setTitle] = useState(editSubject?.m_subject_title || '')
  const [description, setDescription] = useState(editSubject?.m_subject_desc || '')
  const [status, setStatus] = useState(editSubject?.m_subject_status ?? 1)
  const [sequence, setSequence] = useState(editSubject?.m_subject_seq ?? 0)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem('token')
      let response
      if (isEditing) {
        const updatePayload = new FormData()
        updatePayload.append('m_subject_title', title)
        updatePayload.append('m_subject_desc', description || '')
        updatePayload.append('m_subject_status', Number(status))
        updatePayload.append('m_subject_seq', Number(sequence))

        response = await axios.put(`${BASE_URL}/myadmin/subject/update-subject/${editSubject._id}`, updatePayload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      } else {
        const addPayload = new FormData()
        addPayload.append('m_subject_title', title)
        addPayload.append('m_subject_course', id)
        addPayload.append('m_subject_desc', description || '')
        addPayload.append('m_subject_status', Number(status))
        addPayload.append('m_subject_seq', Number(sequence))

        response = await axios.post(`${BASE_URL}/myadmin/subject/add-subject`, addPayload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      }

      if (response.data?.status) {
        await window.customAlert(response.data.message || 'Saved successfully')
        navigate(`/courses/subjects/${id}`)
      } else {
        await window.customAlert(response.data.message || 'Operation failed')
      }
    } catch (error) {
      console.error('Error saving subject:', error)
      await window.customAlert(error.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow border border-slate-100 transition-colors overflow-hidden max-w-6xl mx-auto">
        <div className="bg-[#144f36] rounded-t-2xl p-5 flex justify-between items-center shadow-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white dark:bg-[#13111c]/10 rounded-full blur-2xl group-hover:bg-white dark:bg-[#13111c]/20 transition-all duration-700 pointer-events-none"></div>
          
          <div className="flex items-center relative z-10">
            <div className="w-1.5 h-7 bg-white dark:bg-[#13111c]/90 rounded-full mr-4 shadow-[0_0_12px_rgba(255,255,255,0.9)] hidden sm:block"></div>
            <h2 className="text-white font-bold tracking-wide text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
              {isEditing ? 'Edit Subject' : 'Add New Subject'}
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Subject Title <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Subject Title"
                className="w-full border border-slate-300 dark:border-gray-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] bg-white dark:bg-[#13111c] text-slate-800 dark:text-slate-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Subject Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(Number(e.target.value))}
                className="w-full border border-slate-300 dark:border-gray-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] bg-white dark:bg-[#13111c] text-slate-800 dark:text-slate-200"
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Sequence</label>
              <input
                type="number"
                value={sequence}
                onChange={(e) => setSequence(e.target.value)}
                placeholder="Enter display order"
                className="w-full border border-slate-300 dark:border-gray-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] bg-white dark:bg-[#13111c] text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Subject Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Subject Description"
              rows={4}
              className="w-full border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
            ></textarea>
          </div>

          <div className="flex gap-4">
            <button 
              type="submit"
              className="flex-1 bg-[#144f36] text-white px-8 py-2 rounded-lg text-sm font-medium hover:bg-[#0f3d2a] transition-colors"
            >
              {isEditing ? 'Update Subject' : 'Submit Subject'}
            </button>
            <Link
              to={`/courses/subjects/${id}`}
              className="inline-block flex-1 bg-[#144f36] text-white px-8 py-2 rounded-lg text-sm font-medium hover:bg-[#0f3d2a] transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

