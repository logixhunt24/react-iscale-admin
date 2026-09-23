import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function AddTestSeriesPackage() {
  const navigate = useNavigate()
  const location = useLocation()

  const editPackage = location.state?.editPackage
  const isEditing = !!editPackage

  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])

  const [formData, setFormData] = useState({
    m_package_course: editPackage?.m_package_course || '',
    m_package_title: editPackage?.m_package_title || '',
    m_package_language: editPackage?.m_package_language || '',
    m_package_status: editPackage?.m_package_status !== undefined ? editPackage.m_package_status.toString() : '1',
    m_package_order: editPackage?.m_package_order || '',
    m_package_intro: editPackage?.m_package_intro || '',
    m_package_description: editPackage?.m_package_description || '',
    m_package_test_category: editPackage?.m_package_test_category || '',
    m_package_type: editPackage?.m_package_type || '',
    m_package_price: editPackage?.m_package_price || '',
    m_package_offer_price: editPackage?.m_package_offer_price || '',
  })
  const [imageFile, setImageFile] = useState(null)

  useEffect(() => {
    fetchCourses()
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/myadmin/test-category/dropdown`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status) {
        setCategories(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching test categories:', error)
    }
  }

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/myadmin/course/all-courses?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status) {
        setCourses(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

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
      payload.append('m_package_course', formData.m_package_course)
      payload.append('m_package_title', formData.m_package_title)
      payload.append('m_package_language', formData.m_package_language)
      payload.append('m_package_status', formData.m_package_status)
      if (formData.m_package_order) {
        payload.append('m_package_order', formData.m_package_order)
      }
      if (formData.m_package_intro) {
        payload.append('m_package_intro', formData.m_package_intro)
      }
      if (formData.m_package_description) {
        payload.append('m_package_description', formData.m_package_description)
      }
      if (formData.m_package_test_category) {
        payload.append('m_package_test_category', formData.m_package_test_category)
      }
      if (formData.m_package_type) {
        payload.append('m_package_type', formData.m_package_type)
      }
      if (formData.m_package_price) {
        payload.append('m_package_price', formData.m_package_price)
      }
      if (formData.m_package_offer_price) {
        payload.append('m_package_offer_price', formData.m_package_offer_price)
      }
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

      console.log('API RESPONSE:', response.data)

      if (response.data?.status) {
        await window.customAlert(response.data.message || (isEditing ? 'Updated successfully!' : 'Package added successfully!'))
        navigate('/test-series/packages')
      } else {
        await window.customAlert(response.data.message || 'Operation failed')
      }
    } catch (error) {
      console.error('Error saving package:', error)
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
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden w-full">
        <div className="p-4 flex justify-between items-center flex-wrap gap-4 bg-[#144f36] text-white rounded-t-2xl">
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            {isEditing ? 'Edit Package' : 'Add New Package'}
          </h2>
          <Link 
            to={'/test-series/packages'}
            className="bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-1 border border-white/30"
          >
            <span>↩ Back</span>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Test Category (Course)<span className="text-red-500">*</span>
              </label>
              <select 
                name="m_package_course"
                value={formData.m_package_course}
                onChange={handleChange}
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                required
              >
                <option value="">- - - Select - - -</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>{course.title || course.m_course_title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Package Title<span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="m_package_title"
                value={formData.m_package_title}
                onChange={handleChange}
                placeholder="Package Title"
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Language<span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="m_package_language"
                value={formData.m_package_language}
                onChange={handleChange}
                placeholder="Enter Language"
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Package Status</label>
              <select 
                name="m_package_status"
                value={formData.m_package_status}
                onChange={handleChange}
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Package Image (512px X 512px)</label>
              <div className="relative">
                <input 
                  type="file" 
                  className="hidden" 
                  id="package-image-ts"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <label 
                  htmlFor="package-image-ts"
                  className="w-full bg-[#144f36] hover:bg-[#0f3d2a] text-white text-sm font-medium rounded px-3 py-2 text-center cursor-pointer flex items-center justify-center gap-2 transition-colors"
                >
                  <span>📷</span> {imageFile ? imageFile.name : 'Choose Image'}
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Test Category</label>
              <select 
                name="m_package_test_category"
                value={formData.m_package_test_category}
                onChange={handleChange}
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              >
                <option value="">- - - Select - - -</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Package Type</label>
              <input 
                type="text" 
                name="m_package_type"
                value={formData.m_package_type}
                onChange={handleChange}
                placeholder="e.g. Free, Paid, etc."
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Price</label>
              <input 
                type="number" 
                name="m_package_price"
                value={formData.m_package_price}
                onChange={handleChange}
                placeholder="Enter Price"
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Offer Price</label>
              <input 
                type="number" 
                name="m_package_offer_price"
                value={formData.m_package_offer_price}
                onChange={handleChange}
                placeholder="Enter Offer Price"
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Package Intro</label>
              <textarea 
                name="m_package_intro"
                value={formData.m_package_intro}
                onChange={handleChange}
                placeholder="Enter Package Intro"
                rows={4}
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] resize-none"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Package Description</label>
              <textarea 
                name="m_package_description"
                value={formData.m_package_description}
                onChange={handleChange}
                placeholder="Enter Package Description"
                rows={4}
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] resize-none"
              ></textarea>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#144f36] text-white px-8 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#0f3d2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (isEditing ? 'Update Package' : 'Submit')}
            </button>
            <Link
              to={'/test-series/packages'}
              className="inline-block flex-1 bg-[#d87025] text-white px-8 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#b55d1f] transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
