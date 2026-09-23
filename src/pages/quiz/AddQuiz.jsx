import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function AddQuiz() {
  const navigate = useNavigate()
  const { packageId } = useParams()
  const location = useLocation()

  const editQuiz = location.state?.editQuiz
  const isEditing = !!editQuiz
  const packageTitle = location.state?.packageTitle || 'Package'
  const courseId = location.state?.courseId || editQuiz?.m_quiz_course_id || ''

  const [loading, setLoading] = useState(false)

  // Parse existing duration into HH, MM, SS
  const parseDuration = (dur) => {
    if (!dur) return { hh: '', mm: '', ss: '' }
    const parts = dur.split(':')
    if (parts.length === 3) return { hh: parts[0], mm: parts[1], ss: parts[2] }
    if (parts.length === 2) return { hh: '', mm: parts[0], ss: parts[1] }
    return { hh: '', mm: dur, ss: '' }
  }

  const existingDur = parseDuration(editQuiz?.m_quiz_duration)

  const [formData, setFormData] = useState({
    m_quiz_title: editQuiz?.m_quiz_title || '',
    m_quiz_keywords: editQuiz?.m_quiz_keywords || '',
    m_quiz_startdate: editQuiz?.m_quiz_startdate ? editQuiz.m_quiz_startdate.split('T')[0] : '',
    m_quiz_startTime: editQuiz?.m_quiz_startTime || '',
    m_quiz_enddate: editQuiz?.m_quiz_enddate ? editQuiz.m_quiz_enddate.split('T')[0] : '',
    m_quiz_endTime: editQuiz?.m_quiz_endTime || '',
    m_quiz_per_marks: editQuiz?.m_quiz_per_marks ?? '',
    m_quiz_pernegative_marks: editQuiz?.m_quiz_pernegative_marks ?? '',
    m_quiz_shortDesc: editQuiz?.m_quiz_shortDesc || '',
    m_quiz_description: editQuiz?.m_quiz_description || '',
    m_quiz_remark: editQuiz?.m_quiz_remark || '',
    m_quiz_status: editQuiz?.m_quiz_status !== undefined ? editQuiz.m_quiz_status.toString() : '1',
  })
  const [durationHH, setDurationHH] = useState(existingDur.hh)
  const [durationMM, setDurationMM] = useState(existingDur.mm)
  const [durationSS, setDurationSS] = useState(existingDur.ss)
  const [iconFile, setIconFile] = useState(null)
  const [bannerFile, setBannerFile] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); 

    try {
      const token = localStorage.getItem('token')

      // Build duration string
      const duration = [durationHH || '00', durationMM || '00', durationSS || '00'].join(':')

      const payload = new FormData()
      payload.append('m_quiz_title', formData.m_quiz_title)
      payload.append('m_quiz_course_id', courseId)
      payload.append('m_quiz_package', packageId)
      payload.append('m_quiz_keywords', formData.m_quiz_keywords)
      payload.append('m_quiz_duration', duration)
      payload.append('m_quiz_shortDesc', formData.m_quiz_shortDesc)
      payload.append('m_quiz_description', formData.m_quiz_description)
      payload.append('m_quiz_remark', formData.m_quiz_remark)
      payload.append('m_quiz_status', formData.m_quiz_status)

      if (formData.m_quiz_startdate) payload.append('m_quiz_startdate', formData.m_quiz_startdate)
      if (formData.m_quiz_enddate) payload.append('m_quiz_enddate', formData.m_quiz_enddate)
      if (formData.m_quiz_startTime) payload.append('m_quiz_startTime', formData.m_quiz_startTime)
      if (formData.m_quiz_endTime) payload.append('m_quiz_endTime', formData.m_quiz_endTime)
      if (formData.m_quiz_per_marks) payload.append('m_quiz_per_marks', formData.m_quiz_per_marks)
      if (formData.m_quiz_pernegative_marks) payload.append('m_quiz_pernegative_marks', formData.m_quiz_pernegative_marks)

      if (iconFile) payload.append('m_quiz_icon', iconFile)
      if (bannerFile) payload.append('m_quiz_banner', bannerFile)

      let response
      if (isEditing) {
        response = await axios.put(
          `${BASE_URL}/myadmin/quiz/update-quiz/${editQuiz._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        response = await axios.post(
          `${BASE_URL}/myadmin/quiz/add-quiz`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }

      console.log('API RESPONSE:', response.data)

      if (response.data?.status) {
        await window.customAlert(response.data.message || (isEditing ? 'Quiz updated!' : 'Quiz added successfully!'))
        navigate(`/quiz/list/${packageId}`, { state: { packageTitle, courseId } })
      } else {
        await window.customAlert(response.data.message || 'Operation failed')
      }
    } catch (error) {
      console.error('Error saving quiz:', error)
      if (error.response) {
        console.log('BACKEND ERROR:', JSON.stringify(error.response.data, null, 2))
      }
      await window.customAlert(error.response?.data?.message || 'Save failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden max-w-6xl mx-auto">
        {/* Header */}
        <div className="p-4 flex justify-between items-center bg-white border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">{isEditing ? 'Edit Quiz' : 'Add New Quiz'}</h2>
          <Link
            to={`/quiz/list/${packageId}`} state={{ packageTitle, courseId }}
            className="bg-[#144f36] hover:bg-[#0f3d2a] text-white px-4 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1"
          >
            ↩ Back
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Row 1: Quiz Title, Quiz Keywords, Quiz Start Date, Quiz Start Time */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Quiz Title<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="m_quiz_title"
                value={formData.m_quiz_title}
                onChange={handleChange}
                placeholder="Enter Quiz Title"
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Quiz Keywords</label>
              <input
                type="text"
                name="m_quiz_keywords"
                value={formData.m_quiz_keywords}
                onChange={handleChange}
                placeholder="Quiz Keywords"
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Quiz Start Date<span className="text-red-500">*</span></label>
              <input
                type="date"
                name="m_quiz_startdate"
                value={formData.m_quiz_startdate}
                onChange={handleChange}
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Quiz Start Time<span className="text-red-500">*</span></label>
              <input
                type="time"
                name="m_quiz_startTime"
                value={formData.m_quiz_startTime}
                onChange={handleChange}
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
          </div>

          {/* Row 2: Quiz End Date, Quiz End Time, Duration (HH:MM:SS), Quiz Status */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Quiz End Date<span className="text-red-500">*</span></label>
              <input
                type="date"
                name="m_quiz_enddate"
                value={formData.m_quiz_enddate}
                onChange={handleChange}
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Quiz End Time<span className="text-red-500">*</span></label>
              <input
                type="time"
                name="m_quiz_endTime"
                value={formData.m_quiz_endTime}
                onChange={handleChange}
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Duration(HH:MM:SS)<span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={durationHH}
                  onChange={(e) => setDurationHH(e.target.value)}
                  placeholder="HH"
                  maxLength={2}
                  className="w-1/3 border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] text-center"
                />
                <input
                  type="text"
                  value={durationMM}
                  onChange={(e) => setDurationMM(e.target.value)}
                  placeholder="MM"
                  maxLength={2}
                  className="w-1/3 border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] text-center"
                />
                <input
                  type="text"
                  value={durationSS}
                  onChange={(e) => setDurationSS(e.target.value)}
                  placeholder="SS"
                  maxLength={2}
                  className="w-1/3 border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] text-center"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Quiz Status</label>
              <select
                name="m_quiz_status"
                value={formData.m_quiz_status}
                onChange={handleChange}
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          </div>

          {/* Row 3: Quiz Icon, Quiz Banner, Marks, Negative Marks */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Quiz Icon ( 512px X 512px )</label>
              <div className="relative">
                <input type="file" className="hidden" id="quiz-icon-file" accept="image/*" onChange={(e) => e.target.files?.[0] && setIconFile(e.target.files[0])} />
                <label
                  htmlFor="quiz-icon-file"
                  className="w-full bg-[#144f36] hover:bg-[#0f3d2a] text-white text-sm font-medium rounded px-3 py-2 text-center cursor-pointer flex items-center justify-center gap-2 transition-colors"
                >
                  📷 {iconFile ? iconFile.name : 'Quiz Icon'}
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Quiz Banner ( 1200px X 600px )</label>
              <div className="relative">
                <input type="file" className="hidden" id="quiz-banner-file" accept="image/*" onChange={(e) => e.target.files?.[0] && setBannerFile(e.target.files[0])} />
                <label
                  htmlFor="quiz-banner-file"
                  className="w-full bg-[#144f36] hover:bg-[#0f3d2a] text-white text-sm font-medium rounded px-3 py-2 text-center cursor-pointer flex items-center justify-center gap-2 transition-colors"
                >
                  📷 {bannerFile ? bannerFile.name : 'Quiz Banner'}
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Quiz Per Question Marks<span className="text-red-500">*</span></label>
              <input
                type="number"
                name="m_quiz_per_marks"
                value={formData.m_quiz_per_marks}
                onChange={handleChange}
                placeholder=""
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Quiz (Negative) Marks</label>
              <input
                type="number"
                name="m_quiz_pernegative_marks"
                value={formData.m_quiz_pernegative_marks}
                onChange={handleChange}
                placeholder=""
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
          </div>

          {/* Row 4: Short Description, Description, Remark */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Quiz Short Description</label>
              <textarea
                name="m_quiz_shortDesc"
                value={formData.m_quiz_shortDesc}
                onChange={handleChange}
                placeholder="Enter Quiz Short Description"
                rows={4}
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] resize-y"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Quiz Description</label>
              <textarea
                name="m_quiz_description"
                value={formData.m_quiz_description}
                onChange={handleChange}
                placeholder="Enter Quiz Description"
                rows={4}
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] resize-y"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Quiz Remark</label>
              <textarea
                name="m_quiz_remark"
                value={formData.m_quiz_remark}
                onChange={handleChange}
                placeholder="Enter Quiz Remark"
                rows={4}
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] resize-y"
              ></textarea>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#144f36] text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-[#0f3d2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (isEditing ? 'Update Quiz' : 'Submit')}
            </button>
            <Link
              to={`/quiz/list/${packageId}`} state={{ packageTitle, courseId }}
              className="inline-block w-full bg-[#d87025] text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-[#b55d1f] transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
