import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import axios from 'axios'
import { BASE_URL } from '../../config/api'
import { getImageUrl } from '../../utils/imageUtils'

export default function AddCourseRating() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()

  const [loading, setLoading] = useState(false)
  const [backendError, setBackendError] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [existingImage, setExistingImage] = useState('')
  const [formData, setFormData] = useState({
    user_name: '',
    user_designation: '',
    user_review: '',
    rating: '5',
    status: 'active'
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const populate = (r) => {
    setFormData({
      user_name: r.user_name || '',
      user_designation: r.user_designation || '',
      user_review: r.user_review || '',
      rating: (r.rating ?? 5).toString(),
      status: r.status || 'active'
    })
    setExistingImage(r.user_image || '')
  }

  useEffect(() => {
    if (!id) return

    if (location.state?.review) {
      populate(location.state.review)
      return
    }

    const fetchOne = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        const response = await axios.get(`${BASE_URL}/myadmin/user-reviews/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.data?.status && response.data.data) populate(response.data.data)
      } catch (err) {
        console.error('Error fetching review', err)
        setBackendError('Error fetching review')
      } finally {
        setLoading(false)
      }
    }
    fetchOne()
  }, [id, location.state])

  const handleSubmit = async () => {
    if (!formData.user_name.trim()) {
      await window.customAlert('Name is required')
      return
    }

    try {
      setLoading(true)
      setBackendError(null)
      const token = localStorage.getItem('token')

      const payload = new FormData()
      payload.append('user_name', formData.user_name.trim())
      payload.append('user_designation', formData.user_designation)
      payload.append('user_review', formData.user_review)
      payload.append('rating', formData.rating)
      payload.append('status', formData.status)
      if (imageFile) payload.append('user_image', imageFile)

      const url = id
        ? `${BASE_URL}/myadmin/user-reviews/update/${id}`
        : `${BASE_URL}/myadmin/user-reviews/add`

      const response = await axios({
        method: id ? 'put' : 'post',
        url,
        data: payload,
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data?.status) {
        await window.customAlert(id ? 'Updated successfully' : 'Added successfully')
        navigate('/courses/ratings')
      } else {
        setBackendError(response.data?.message || 'Failed to save')
      }
    } catch (error) {
      console.error(error)
      setBackendError(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full animate-fade-in-up flex flex-col min-h-0">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow border border-slate-100 transition-colors overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="bg-[#144f36] rounded-t-2xl p-5 flex justify-between items-center shadow-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white dark:bg-[#13111c]/10 rounded-full blur-2xl group-hover:bg-white dark:bg-[#13111c]/20 transition-all duration-700 pointer-events-none"></div>

          <div className="flex items-center relative z-10">
            <div className="w-1.5 h-7 bg-white dark:bg-[#13111c]/90 rounded-full mr-4 shadow-[0_0_12px_rgba(255,255,255,0.9)] hidden sm:block"></div>
            <h2 className="text-white font-bold tracking-wide text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
              {id ? 'Edit Testimonial' : 'Add Testimonial'}
            </h2>
          </div>

          <button
            onClick={() => navigate('/courses/ratings')}
            className="bg-white hover:bg-slate-50 text-[#144f36] px-5 py-2 rounded-full text-sm font-bold shadow-sm transition-all flex items-center gap-2 relative z-10 hover:shadow hover:-translate-y-0.5"
          >
            « Back
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {backendError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg whitespace-pre-wrap font-mono text-sm shadow-sm">
              <strong className="font-bold">Error:</strong><br />
              {backendError}
            </div>
          )}

          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                placeholder="Reviewer Name"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Designation</label>
              <p className="text-xs text-slate-500 mb-1">Shown under the name (e.g. "Data Analyst at TCS").</p>
              <input
                type="text"
                name="user_designation"
                value={formData.user_designation}
                onChange={handleChange}
                placeholder="e.g. Data Analyst at TCS"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Review</label>
            <textarea
              name="user_review"
              value={formData.user_review}
              onChange={handleChange}
              placeholder="What the reviewer said"
              rows="4"
              className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: n.toString() })}
                    className="p-1"
                    title={`${n} star${n > 1 ? 's' : ''}`}
                  >
                    <Star size={22} className={n <= Number(formData.rating) ? 'text-amber-500' : 'text-slate-300'} fill={n <= Number(formData.rating) ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Photo</label>
              <div className="flex items-center gap-2 mt-1">
                {(imageFile || existingImage) && (
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : getImageUrl(existingImage)}
                    alt="Reviewer"
                    className="w-9 h-9 rounded-full object-cover border border-slate-300 dark:border-gray-700 flex-shrink-0"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-1 file:px-3 file:rounded file:border file:border-slate-300 dark:border-[#1f1b2e] file:bg-[#f6f6ff] file:text-slate-700 dark:text-slate-300 hover:file:bg-slate-50 dark:bg-[#1f1b2e]/50 cursor-pointer"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#144f36] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#0f3d2a] transition-colors flex-1 shadow-sm disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            <button
              onClick={() => navigate('/courses/ratings')}
              className="bg-slate-50 dark:bg-[#13111c] text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-gray-800 px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#152a4a] transition-colors flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
