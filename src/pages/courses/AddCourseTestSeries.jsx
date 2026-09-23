import { useNavigate, useParams, useLocation, Link } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function AddCourseTestSeries() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()

  const editPackage = location.state?.editPackage
  const courseTitle = location.state?.courseTitle || 'Course'
  const isEditing = !!editPackage

  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    m_package_title: editPackage?.m_package_title || '',
    m_package_language: editPackage?.m_package_language || '',
    m_package_status: editPackage?.m_package_status !== undefined ? editPackage.m_package_status.toString() : '1',
    m_package_order: editPackage?.m_package_order || '',
    m_package_intro: editPackage?.m_package_intro || '',
    m_package_description: editPackage?.m_package_description || '',
    m_package_total_enrolled: editPackage?.m_package_total_enrolled || '',
    m_package_total_reviews: editPackage?.m_package_total_reviews || '',
    m_package_ratings: editPackage?.m_package_ratings || '',
  })
  
  const [imageFile, setImageFile] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); 

    try {
      const token = localStorage.getItem('token')

      const payload = new FormData()
      payload.append('m_package_course', id)
      payload.append('m_package_title', formData.m_package_title)
      payload.append('m_package_language', formData.m_package_language)
      payload.append('m_package_status', formData.m_package_status)
      if (formData.m_package_order) payload.append('m_package_order', formData.m_package_order)
      if (formData.m_package_intro) payload.append('m_package_intro', formData.m_package_intro)
      if (formData.m_package_description) payload.append('m_package_description', formData.m_package_description)
      if (formData.m_package_total_enrolled) payload.append('m_package_total_enrolled', formData.m_package_total_enrolled)
      if (formData.m_package_total_reviews) payload.append('m_package_total_reviews', formData.m_package_total_reviews)
      if (formData.m_package_ratings) payload.append('m_package_ratings', formData.m_package_ratings)
      
      if (imageFile) {
        payload.append('m_package_image', imageFile)
      }

      let response
      if (isEditing) {
        response = await axios.put(
          `${BASE_URL}/myadmin/test-package/update-package/${editPackage._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        response = await axios.post(
          `${BASE_URL}/myadmin/test-package/add-package`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }

      if (response.data?.status) {
        await window.customAlert(response.data.message || (isEditing ? 'Updated successfully!' : 'Package added successfully!'))
        navigate(`/courses/test-series/${id}`)
      } else {
        await window.customAlert(response.data.message || 'Operation failed')
      }
    } catch (error) {
      console.error('Error saving package:', error)
      await window.customAlert(error.response?.data?.message || 'Save failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow border border-slate-100 transition-colors overflow-hidden w-full flex flex-col h-full">
        <div className="p-4 bg-[#144f36] dark:bg-[#0f3d2a] rounded-t-2xl flex justify-between items-center">
          <h2 className="text-xl font-bold tracking-tight text-white">
            {isEditing ? 'Edit Package' : 'Add New Package'} - {courseTitle}
          </h2>
          <Link
            to={`/courses/test-series/${id}`}
            className="bg-white text-[#144f36] px-4 py-1.5 rounded-full text-sm font-bold hover:bg-slate-100 transition-colors shadow-sm flex items-center gap-1"
          >
            ↩ Back
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                Package Title<span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="m_package_title"
                value={formData.m_package_title}
                onChange={handleChange}
                placeholder="Package Title"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                Language<span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="m_package_language"
                value={formData.m_package_language}
                onChange={handleChange}
                placeholder="Enter Language"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Package Status</label>
              <select 
                name="m_package_status"
                value={formData.m_package_status}
                onChange={handleChange}
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                Package Image(512px X 512px)<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type="file" 
                  className="hidden" 
                  id="package-image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <label 
                  htmlFor="package-image"
                  className="w-full bg-[#144f36] hover:bg-[#0f3d2a] text-white text-sm font-bold rounded-lg px-3 py-2 text-center cursor-pointer flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>📷</span> {imageFile ? imageFile.name : 'Package Image'}
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Order</label>
              <input 
                type="number" 
                name="m_package_order"
                value={formData.m_package_order}
                onChange={handleChange}
                placeholder="Enter Package Order"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Package Intro</label>
              <textarea 
                name="m_package_intro"
                value={formData.m_package_intro}
                onChange={handleChange}
                placeholder="Enter Package Intro"
                rows={4}
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] resize-none"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Package Description</label>
              <textarea 
                name="m_package_description"
                value={formData.m_package_description}
                onChange={handleChange}
                placeholder="Enter Package Description"
                rows={4}
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] resize-none"
              ></textarea>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Total Student Enrolled</label>
              <input 
                type="text" 
                name="m_package_total_enrolled"
                value={formData.m_package_total_enrolled}
                onChange={handleChange}
                placeholder="Total Student Enrolled"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Total Review</label>
              <input 
                type="text" 
                name="m_package_total_reviews"
                value={formData.m_package_total_reviews}
                onChange={handleChange}
                placeholder="Reviews"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Ratings</label>
              <input 
                type="text" 
                name="m_package_ratings"
                value={formData.m_package_ratings}
                onChange={handleChange}
                placeholder="Ratings"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-gray-800">
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#144f36] text-white px-8 py-2.5 rounded-lg text-sm font-bold hover:bg-[#0f3d2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? 'Saving...' : 'Submit'}
            </button>
            <Link
              to={`/courses/test-series/${id}`}
              className="inline-block flex-1 bg-[#d87025] text-white px-8 py-2.5 rounded-lg text-sm font-bold hover:bg-[#b55d1f] transition-colors shadow-md"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

