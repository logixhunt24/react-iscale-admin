import { useNavigate, useParams, useLocation, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import axios from 'axios'
import { BASE_URL } from '../../config/api'
import { getImageUrl } from '../../utils/imageUtils'
import IconPicker from '../../components/common/IconPicker'

// Same 3 chips the section originally hardcoded - used to pre-fill new
// goals and any existing goal that hasn't set its own chips yet, so the
// form always shows what will actually render (the frontend falls back to
// these same 3 whenever a goal's m_cf_feature_chips is empty).
const DEFAULT_FEATURE_CHIPS = [
  { label: 'Live Mentor Support', icon: 'Users' },
  { label: 'Hands-on Projects', icon: 'Rocket' },
  { label: 'Certificate Included', icon: 'BadgeCheck' },
]

export default function AddCareerFit() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()

  const [loading, setLoading] = useState(false)
  const [backendError, setBackendError] = useState(null)
  const [iconFile, setIconFile] = useState(null)
  const [existingIcon, setExistingIcon] = useState('')
  const [formData, setFormData] = useState({
    m_cf_title: '',
    m_cf_desc: '',
    m_cf_keywords: '',
    m_cf_order: '',
    m_cf_status: '1'
  })

  const [allCourses, setAllCourses] = useState([])
  const [selectedCourseIds, setSelectedCourseIds] = useState([])
  const [courseSearch, setCourseSearch] = useState('')

  const [allDestinations, setAllDestinations] = useState([])
  const [selectedDestinationIds, setSelectedDestinationIds] = useState([])

  const [featureChips, setFeatureChips] = useState(DEFAULT_FEATURE_CHIPS)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${BASE_URL}/myadmin/course/dropdown`, {
          params: { limit: 500 },
          headers: { Authorization: `Bearer ${token}` }
        })
        setAllCourses(response.data?.data || [])
      } catch (err) {
        console.error('Error fetching course dropdown', err)
      }
    }
    fetchCourses()

    const fetchDestinations = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${BASE_URL}/myadmin/hiring-destination/get-all`, {
          params: { limit: 500 },
          headers: { Authorization: `Bearer ${token}` }
        })
        setAllDestinations(response.data?.data || [])
      } catch (err) {
        console.error('Error fetching hiring destinations', err)
      }
    }
    fetchDestinations()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const toggleCourse = (courseId) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    )
  }

  const toggleDestination = (destinationId) => {
    setSelectedDestinationIds((prev) =>
      prev.includes(destinationId) ? prev.filter((id) => id !== destinationId) : [...prev, destinationId]
    )
  }

  const updateChip = (index, field, value) => {
    setFeatureChips((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)))
  }

  const addChip = () => {
    setFeatureChips((prev) => [...prev, { label: '', icon: 'Sparkles' }])
  }

  const removeChip = (index) => {
    setFeatureChips((prev) => prev.filter((_, i) => i !== index))
  }

  const populate = (cf) => {
    setFormData({
      m_cf_title: cf.m_cf_title || '',
      m_cf_desc: cf.m_cf_desc || '',
      m_cf_keywords: cf.m_cf_keywords || '',
      m_cf_order: (cf.m_cf_order ?? '').toString(),
      m_cf_status: (cf.m_cf_status ?? 1).toString()
    })
    setExistingIcon(cf.m_cf_icon || '')
    // m_cf_courses / m_cf_hiring_destinations arrive populated from the API
    // - just the ids are needed here for the checkbox lists.
    setSelectedCourseIds((cf.m_cf_courses || []).map((c) => c._id || c))
    setSelectedDestinationIds((cf.m_cf_hiring_destinations || []).map((d) => d._id || d))
    setFeatureChips(cf.m_cf_feature_chips?.length > 0 ? cf.m_cf_feature_chips : DEFAULT_FEATURE_CHIPS)
  }

  useEffect(() => {
    if (!id) return

    if (location.state?.careerFit) {
      populate(location.state.careerFit)
      return
    }

    const fetchOne = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        // No single-get endpoint - the list is small, so reuse get-all and
        // find this one, same as course/subject edit pages do when their
        // list-item was passed via navigation state but a hard refresh loses it.
        const response = await axios.get(`${BASE_URL}/myadmin/career-fit/get-all`, {
          params: { limit: 500 },
          headers: { Authorization: `Bearer ${token}` }
        })
        const found = (response.data?.data || []).find((cf) => cf._id === id)
        if (found) populate(found)
      } catch (err) {
        console.error('Error fetching career fit goal', err)
        setBackendError('Error fetching career fit goal')
      } finally {
        setLoading(false)
      }
    }
    fetchOne()
  }, [id, location.state])

  const handleSubmit = async () => {
    if (!formData.m_cf_title.trim()) {
      await window.customAlert('Title is required')
      return
    }

    try {
      setLoading(true)
      setBackendError(null)
      const token = localStorage.getItem('token')

      const payload = new FormData()
      payload.append('m_cf_title', formData.m_cf_title.trim())
      payload.append('m_cf_desc', formData.m_cf_desc)
      payload.append('m_cf_keywords', formData.m_cf_keywords)
      payload.append('m_cf_courses', JSON.stringify(selectedCourseIds))
      payload.append('m_cf_hiring_destinations', JSON.stringify(selectedDestinationIds))
      payload.append('m_cf_feature_chips', JSON.stringify(featureChips.filter((c) => c.label.trim())))
      payload.append('m_cf_order', Number(formData.m_cf_order) || 0)
      payload.append('m_cf_status', formData.m_cf_status)
      if (iconFile) payload.append('m_cf_icon', iconFile)

      const url = id
        ? `${BASE_URL}/myadmin/career-fit/update/${id}`
        : `${BASE_URL}/myadmin/career-fit/add`

      const response = await axios({
        method: id ? 'put' : 'post',
        url,
        data: payload,
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data?.status) {
        await window.customAlert(id ? 'Updated successfully' : 'Added successfully')
        navigate('/career-fit')
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
              {id ? 'Edit Career Fit Goal' : 'Add Career Fit Goal'}
            </h2>
          </div>

          <Link
            to={'/career-fit'}
            className="bg-white hover:bg-slate-50 text-[#144f36] px-5 py-2 rounded-full text-sm font-bold shadow-sm transition-all flex items-center gap-2 relative z-10 hover:shadow hover:-translate-y-0.5"
          >
            « Back
          </Link>
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
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="m_cf_title"
                value={formData.m_cf_title}
                onChange={handleChange}
                placeholder="e.g. AI/ML Engineer"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Icon</label>
              <p className="text-xs text-slate-500 mb-1">Small square icon (transparent background works best) — shown in the tab and the spotlight panel on the homepage.</p>
              <div className="flex items-center gap-2 mt-1">
                {(iconFile || existingIcon) && (
                  <img
                    src={iconFile ? URL.createObjectURL(iconFile) : getImageUrl(existingIcon)}
                    alt="Icon"
                    className="w-9 h-9 rounded object-cover border border-slate-300 dark:border-gray-700 flex-shrink-0"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setIconFile(e.target.files?.[0] || null)}
                  className="text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-1 file:px-3 file:rounded file:border file:border-slate-300 dark:border-[#1f1b2e] file:bg-[#f6f6ff] file:text-slate-700 dark:text-slate-300 hover:file:bg-slate-50 dark:bg-[#1f1b2e]/50 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Description</label>
            <textarea
              name="m_cf_desc"
              value={formData.m_cf_desc}
              onChange={handleChange}
              placeholder="Shown under the title in the spotlight panel"
              rows="3"
              className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Keywords</label>
            <p className="text-xs text-slate-500 mb-1">Comma-separated. Courses whose title or category contains any of these words show under this goal (e.g. "data science, data scientist").</p>
            <input
              type="text"
              name="m_cf_keywords"
              value={formData.m_cf_keywords}
              onChange={handleChange}
              placeholder="e.g. ai, ml, machine learning"
              className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Courses</label>
            <p className="text-xs text-slate-500 mb-1">Pick specific courses to show under this goal. If none are picked, the Keywords match above is used instead.</p>
            <input
              type="text"
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
              placeholder="Search courses..."
              className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] mb-2"
            />
            <div className="border border-slate-300 dark:border-gray-700 rounded max-h-48 overflow-y-auto bg-white dark:bg-[#13111c]">
              {allCourses.length === 0 ? (
                <p className="text-xs text-slate-400 p-3">Loading courses...</p>
              ) : (
                allCourses
                  .filter((c) => c.m_course_title?.toLowerCase().includes(courseSearch.toLowerCase()))
                  .map((c) => (
                    <label key={c._id} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-gray-800 last:border-b-0 hover:bg-slate-50 dark:hover:bg-[#1f1b2e]/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCourseIds.includes(c._id)}
                        onChange={() => toggleCourse(c._id)}
                        className="accent-[#144f36]"
                      />
                      {c.m_course_title}
                    </label>
                  ))
              )}
            </div>
            {selectedCourseIds.length > 0 && (
              <p className="text-xs text-slate-500 mt-1">{selectedCourseIds.length} course(s) selected</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Prime Hiring Destinations</label>
            <p className="text-xs text-slate-500 mb-1">Pick which logos show in this goal's "Prime Hiring Destinations" strip. If none are picked, the full logo gallery is shown instead. Manage the gallery itself under <Link to={'/career-fit/hiring-destinations'} className="inline-block underline text-[#144f36] font-semibold">Hiring Destinations</Link>.</p>
            <div className="border border-slate-300 dark:border-gray-700 rounded max-h-48 overflow-y-auto bg-white dark:bg-[#13111c]">
              {allDestinations.length === 0 ? (
                <p className="text-xs text-slate-400 p-3">No logos in the gallery yet.</p>
              ) : (
                allDestinations.map((d) => (
                  <label key={d._id} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-gray-800 last:border-b-0 hover:bg-slate-50 dark:hover:bg-[#1f1b2e]/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedDestinationIds.includes(d._id)}
                      onChange={() => toggleDestination(d._id)}
                      className="accent-[#144f36]"
                    />
                    {d.m_phd_logo && (
                      <img src={getImageUrl(d.m_phd_logo)} alt="" className="w-6 h-6 object-contain rounded border border-slate-200 dark:border-gray-700 bg-white" />
                    )}
                    {d.m_phd_name || 'Untitled logo'}
                  </label>
                ))
              )}
            </div>
            {selectedDestinationIds.length > 0 && (
              <p className="text-xs text-slate-500 mt-1">{selectedDestinationIds.length} logo(s) selected</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Feature Chips</label>
            <p className="text-xs text-slate-500 mb-2">The small value-prop chips under the description (e.g. "Live Mentor Support"). Each has its own icon, picked from the icon list.</p>
            <div className="space-y-2">
              {featureChips.map((chip, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-40">
                    <IconPicker value={chip.icon} onChange={(icon) => updateChip(index, 'icon', icon)} />
                  </div>
                  <input
                    type="text"
                    value={chip.label}
                    onChange={(e) => updateChip(index, 'label', e.target.value)}
                    placeholder="Chip text"
                    className="flex-1 border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                  />
                  <button
                    type="button"
                    onClick={() => removeChip(index)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors flex-shrink-0"
                    title="Remove chip"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addChip}
              className="mt-2 flex items-center gap-1 text-sm font-semibold text-[#144f36] hover:underline"
            >
              <Plus size={14} /> Add Chip
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Order</label>
              <input
                type="number"
                name="m_cf_order"
                value={formData.m_cf_order}
                onChange={handleChange}
                placeholder="0"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Status</label>
              <select
                name="m_cf_status"
                value={formData.m_cf_status}
                onChange={handleChange}
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
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
            <Link
              to={'/career-fit'}
              className="inline-block bg-slate-50 dark:bg-[#13111c] text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-gray-800 px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#152a4a] transition-colors flex-1"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
