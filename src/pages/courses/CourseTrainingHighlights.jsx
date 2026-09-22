import { useState, useEffect } from 'react'
import { Eye, Edit2, Trash2 } from 'lucide-react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'
import { getImageUrl } from '../../utils/imageUtils'

export default function CourseTrainingHighlights() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const [fetchedCourseTitle, setFetchedCourseTitle] = useState('')
  const courseTitle = location.state?.courseTitle || location.state?.course_title || fetchedCourseTitle || 'Course'

  const [highlights, setHighlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    active: '1',
  })
  const [iconFile, setIconFile] = useState(null)

  useEffect(() => {
    fetchHighlights()
  }, [id])

  // location.state only carries the title when this page was reached via
  // an in-app navigate() click (e.g. the course list's Highlights button).
  // A direct URL visit, bookmark, or refresh has no state at all, so it
  // always fell back to the generic word "Course" - fetch the real course
  // record in that case instead.
  useEffect(() => {
    if (location.state?.courseTitle || location.state?.course_title) return
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${BASE_URL}/myadmin/course/course/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.data?.status && response.data.data?.title) {
          setFetchedCourseTitle(response.data.data.title)
        }
      } catch (error) {
        console.error('Error fetching course title:', error)
      }
    }
    fetchCourse()
  }, [id, location.state])

  const fetchHighlights = async () => {
    try {
      setLoading(true); 
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/myadmin/training/get-th/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status) {
        setHighlights(response.data.data || [])
      } else {
        setHighlights([])
      }
    } catch (error) {
      console.error('Error fetching training highlights:', error)
      setHighlights([])
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleIconChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setIconFile(e.target.files[0])
    }
  }

  const resetForm = () => {
    setFormData({ title: '', description: '', active: '1' })
    setIconFile(null)
    setEditingId(null)
    // Reset file input
    const fileInput = document.getElementById('th-icon-input')
    if (fileInput) fileInput.value = ''
  }

  const handleEdit = (item) => {
    setEditingId(item._id)
    setFormData({
      title: item.title || '',
      description: item.description || '',
      active: item.active !== undefined ? item.active.toString() : '1',
    })
    setIconFile(null)
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const token = localStorage.getItem('token')

      let response
      if (editingId) {
        // UPDATE
        const payload = new FormData()
        payload.append('title', formData.title)
        payload.append('description', formData.description)
        payload.append('active', formData.active)
        if (iconFile) {
          payload.append('th_icon', iconFile)
        }

        response = await axios.put(
          `${BASE_URL}/myadmin/training/update-th/${editingId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        // ADD
        const payload = new FormData()
        payload.append('title', formData.title)
        payload.append('course_id', id)
        payload.append('description', formData.description)
        payload.append('active', formData.active)
        if (iconFile) {
          payload.append('th_icon', iconFile)
        }

        response = await axios.post(
          `${BASE_URL}/myadmin/training/add-th`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }

      console.log('API RESPONSE:', response.data)

      if (response.data?.status) {
        await window.customAlert(response.data.message || (editingId ? 'Updated successfully!' : 'Training Highlight added!'))
        resetForm()
        fetchHighlights()
      } else {
        await window.customAlert(response.data.message || 'Operation failed')
      }
    } catch (error) {
      console.error('Error saving training highlight:', error)
      if (error.response) {
        console.log('BACKEND ERROR:', JSON.stringify(error.response.data, null, 2))
      }
      await window.customAlert(error.response?.data?.message || 'Save failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (thId) => {
    if (!await window.customConfirm('Are you sure you want to delete this training highlight?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await axios.delete(`${BASE_URL}/myadmin/training/delete-th/${thId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status) {
        await window.customAlert(response.data.message || 'Deleted successfully')
        fetchHighlights()
      } else {
        await window.customAlert(response.data.message || 'Failed to delete')
      }
    } catch (error) {
      console.error('Error deleting training highlight:', error)
      await window.customAlert(error.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <div className="h-full animate-fade-in-up">
      {/* Top Header */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden max-w-6xl mx-auto mb-5">
        <div className="p-4 flex justify-between items-center flex-wrap gap-4 bg-[#144f36] text-white rounded-t-2xl">
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">Course Highlights</h2>
          <button 
            onClick={() => navigate('/courses/all')}
            className="bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-1 border border-white/30"
          >
            <span>↩ Back To Course List</span>
          </button>
        </div>
        <div className="p-4 bg-white">
          <div className="mb-1 text-sm text-slate-500 font-bold">Course:</div>
          <div className="text-sm font-medium text-slate-800">{courseTitle}</div>
        </div>
      </div>

      {/* Add / Edit Form */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden max-w-6xl mx-auto mb-5">
        <div className="p-4 bg-[#144f36] rounded-t-2xl">
          <h3 className="text-lg font-bold tracking-tight text-white">
            {editingId ? 'Edit Training Highlight' : 'Add Training Highlight'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Icon Image</label>
              <input 
                type="file"
                id="th-icon-input"
                accept="image/*"
                onChange={handleIconChange}
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#144f36] file:text-white hover:file:bg-[#0f3d2a] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Title<span className="text-red-500">*</span></label>
              <input 
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter Title"
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Status</label>
              <select
                name="active"
                value={formData.active}
                onChange={handleChange}
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-800 mb-2">Description</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter Description"
              rows={4}
              className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] resize-none"
            ></textarea>
          </div>

          <div className="flex gap-4">
            <button 
              type="submit"
              disabled={submitting}
              className="bg-[#144f36] text-white px-8 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#0f3d2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : (editingId ? 'Update' : 'Submit')}
            </button>
            {editingId && (
              <button 
                type="button"
                onClick={resetForm}
                className="bg-[#d87025] text-white px-8 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#b55d1f] transition-colors"
              >
                Cancel Edit
              </button>
            )}
            <button 
              type="button"
              onClick={() => navigate('/courses/all')}
              className="bg-slate-500 text-white px-8 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-600 transition-colors"
            >
              Back
            </button>
          </div>
        </form>
      </div>

      {/* Training Highlights List Table */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden max-w-6xl mx-auto">
        <div className="p-4 bg-[#144f36] rounded-t-2xl">
          <h3 className="text-lg font-bold tracking-tight text-white">Training Highlights List</h3>
        </div>

        <div className="p-4">
          <div className="overflow-auto border border-slate-200 rounded">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-[#144f36] text-white">
                <tr>
                  <th className="px-3 py-3 font-semibold text-xs border-r border-[#0f3d2a] whitespace-nowrap">S.No.</th>
                  <th className="px-3 py-3 font-semibold text-xs border-r border-[#0f3d2a] whitespace-nowrap">Icon</th>
                  <th className="px-3 py-3 font-semibold text-xs border-r border-[#0f3d2a] whitespace-nowrap">Title</th>
                  <th className="px-3 py-3 font-semibold text-xs border-r border-[#0f3d2a] whitespace-nowrap">Status</th>
                  <th className="px-3 py-3 font-semibold text-xs whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8">Loading training highlights...</td>
                  </tr>
                ) : highlights.length > 0 ? (
                  highlights.map((item, index) => (
                    <tr key={item._id} className="border-b border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 border-r border-slate-200 align-middle text-[#144f36]">{index + 1}</td>
                      <td className="px-4 py-3 border-r border-slate-200 align-middle">
                        {item.icon ? (
                          <div className="w-10 h-10 bg-[#144f36] rounded flex items-center justify-center overflow-hidden">
                            <img src={getImageUrl(item.icon)} alt="icon" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-[#144f36] rounded flex items-center justify-center text-[10px] text-white font-bold">
                            IMG
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 border-r border-slate-200 align-middle text-slate-700">{item.title}</td>
                      <td className="px-4 py-3 border-r border-slate-200 align-middle">
                        <span className={`${item.active === 1 ? 'bg-[#144f36]' : 'bg-[#d87025]'} text-white px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap`}>
                          {item.active === 1 ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex gap-1.5">
                          <button 
                            onClick={() => handleEdit(item)}
                            className="bg-[#28a745] text-white p-1.5 rounded-full hover:bg-[#218838] transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item._id)}
                            className="bg-[#d87025] text-white p-1.5 rounded-full hover:bg-[#b55d1f] transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8">No training highlights found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

