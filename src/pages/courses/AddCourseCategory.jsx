import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import * as Icons from 'lucide-react'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function AddCourseCategory() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    categoryName: '',
    description: '',
    status: '1',
    order: '1',
    keywords: ''
  })
  const [iconFile, setIconFile] = useState(null)
  const [bannerFile, setBannerFile] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e, setFile) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    } else {
      setFile(null)
    }
  }

  const handleSubmit = async (e) => {

  e.preventDefault()

  setLoading(true); 

  try {

    console.log("API STARTED")

    const token = localStorage.getItem('token')

    console.log("TOKEN:", token)

    if (!token) {

      await window.customAlert("Please login again")

      navigate('/login')

      return
    }

    // CREATE FORM DATA
    const payload = new FormData()

    // IMPORTANT FIELD
    payload.append(
      'm_category_for',
      1
    )

    payload.append(
      'm_category_name',
      formData.categoryName
    )

    payload.append(
      'm_category_desc',
      formData.description
    )

    payload.append(
      'm_category_status',
      Number(formData.status)
    )

    payload.append(
      'm_category_order',
      Number(formData.order)
    )

    payload.append(
      'm_category_keywords',
      formData.keywords
    )

    if (iconFile) {
      payload.append(
        'category_icon',
        iconFile
      )
    }

    if (bannerFile) {
      payload.append(
        'category_banner',
        bannerFile
      )
    }

    console.log(
      `${BASE_URL}/myadmin/category/add-category`
    )

    const response = await axios.post(

      `${BASE_URL}/myadmin/category/add-category`,

      payload,

      {
        headers: {

          Authorization: `Bearer ${token}`,

        },
      }
    )

    console.log("API SUCCESS")

    console.log(response.data)

    if (response.data.status) {

      await window.customAlert("Category Added Successfully")

      navigate('/courses/categories')

    } else {

      await window.customAlert(response.data.message)
    }

  } catch (error) {

    console.log("API FAILED")

    console.log(error)

    console.log(error.response)

    if (error.response?.status === 401) {

      await window.customAlert("Session expired. Please login again.")

      localStorage.clear()

      navigate('/login')

    } else {

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      )
    }

  } finally {

    setLoading(false)
  }
}
  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md border border-slate-100 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-[#144f36] rounded-t-2xl p-5 flex justify-between items-center shadow-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white dark:bg-[#13111c]/10 rounded-full blur-2xl group-hover:bg-white dark:bg-[#13111c]/20 transition-all duration-700 pointer-events-none"></div>
          
          <div className="flex items-center relative z-10">
            <div className="w-1.5 h-7 bg-white dark:bg-[#13111c]/90 rounded-full mr-4 shadow-[0_0_12px_rgba(255,255,255,0.9)] hidden sm:block"></div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
              Add New Category
            </h2>
          </div>
          
          <Link
            to={'/courses/categories'}
            className="bg-white hover:bg-slate-50 text-[#144f36] px-5 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all flex items-center gap-2 relative z-10 hover:shadow hover:-translate-y-0.5"
          >
            <ArrowLeft size={16} />
            <span>Back to List</span>
          </Link>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category Name ( हिंदी ) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="categoryName"
                  required
                  value={formData.categoryName}
                  onChange={handleChange}
                  placeholder="Enter category name"
                  className="w-full border border-slate-300 dark:border-[#1f1b2e] rounded-md px-4 py-2 outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-slate-300 dark:border-[#1f1b2e] rounded-md px-4 py-2 outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category Icon</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setIconFile)}
                  className="w-full border border-slate-300 dark:border-[#1f1b2e] rounded-md px-4 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                />
                <p className="text-xs text-slate-500">Recommended size: 100x100 pixels</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category Banner</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setBannerFile)}
                  className="w-full border border-slate-300 dark:border-[#1f1b2e] rounded-md px-4 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                />
                <p className="text-xs text-slate-500">Recommended size: 1200x400 pixels</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Order</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  placeholder="e.g. 1"
                  className="w-full border border-slate-300 dark:border-[#1f1b2e] rounded-md px-4 py-2 outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Keywords</label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  placeholder="e.g. solid,courses"
                  className="w-full border border-slate-300 dark:border-[#1f1b2e] rounded-md px-4 py-2 outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter category description..."
                className="w-full border border-slate-300 dark:border-[#1f1b2e] rounded-md px-4 py-2 outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-[#1f1b2e] flex justify-end gap-3">
              <Link
                to={'/courses/categories'}
                className="inline-block px-6 py-2 border border-slate-300 dark:border-[#1f1b2e] text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:bg-[#1f1b2e]/50 transition-colors font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#144f36] text-white px-6 py-2 rounded-md hover:bg-[#0f3d2a] transition-colors font-medium flex items-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save Category</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

