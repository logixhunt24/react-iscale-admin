import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Edit2, Trash2 } from 'lucide-react'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function CourseFeatures() {
  const navigate = useNavigate()
  const { id } = useParams()
  
  const [features, setFeatures] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('1')
  const [image, setImage] = useState(null)
  
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchFeatures()
  }, [id])

  const fetchFeatures = async () => {
    try {
      setLoading(true); 
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/myadmin/feature/get-all-features/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status) {
        setFeatures(response.data.data || [])
      } else {
        setFeatures([])
      }
    } catch (error) {
      console.error('Error fetching features:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title) {
      await window.customAlert('Title is required')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('m_course_id', id)
      formData.append('m_feature_title', title)
      formData.append('m_feature_desc', description)
      formData.append('m_feature_status', status)
      if (image) {
        formData.append('m_feature_image', image)
      }

      let response
      if (isEditing) {
        response = await axios.put(`${BASE_URL}/myadmin/feature/update-feature/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      } else {
        response = await axios.post(`${BASE_URL}/myadmin/feature/add-feature`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      }

      if (response.data?.status) {
        await window.customAlert(response.data.message || 'Saved successfully')
        resetForm()
        fetchFeatures()
      } else {
        await window.customAlert(response.data.message || 'Operation failed')
      }
    } catch (error) {
      console.error('Error saving feature:', error)
      await window.customAlert(error.response?.data?.message || 'Something went wrong')
    }
  }

  const handleEdit = (feature) => {
    setIsEditing(true)
    setEditId(feature._id)
    setTitle(feature.m_feature_title || '')
    setDescription(feature.m_feature_desc || '')
    setStatus(feature.m_feature_status?.toString() || '1')
    setImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (featureId) => {
    if (!await window.customConfirm('Are you sure you want to delete this feature?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await axios.delete(`${BASE_URL}/myadmin/feature/delete-feature/${featureId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status) {
        await window.customAlert(response.data.message || 'Deleted successfully')
        fetchFeatures()
      } else {
        await window.customAlert(response.data.message || 'Delete failed')
      }
    } catch (error) {
      console.error('Error deleting feature:', error)
      await window.customAlert(error.response?.data?.message || 'Delete failed')
    }
  }

  const resetForm = () => {
    setIsEditing(false)
    setEditId(null)
    setTitle('')
    setDescription('')
    setStatus('1')
    setImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    const formattedPath = imagePath.replace(/\\/g, '/').replace(/^\//, '')
    const baseUrl = BASE_URL.replace(/\/api\/?$/, '')
    return `${baseUrl}/${formattedPath}`
  }

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#144f36] rounded-t-2xl p-5 flex justify-between items-center shadow-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
          
          <div className="flex items-center relative z-10">
            <div className="w-1.5 h-7 bg-white dark:bg-[#13111c]/90 rounded-full mr-4 shadow-[0_0_12px_rgba(255,255,255,0.9)] hidden sm:block"></div>
            <h2 className="text-white font-bold tracking-wide text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">Course Features</h2>
          </div>
          
          <div className="flex gap-4 relative z-10">
            <Link to={'/courses/all'} className="bg-white hover:bg-slate-50 text-[#144f36] px-5 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all hover:-translate-y-0.5 flex items-center gap-2">
              <span>Back To Courses</span>
            </Link>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col gap-4 bg-white border-x border-b border-slate-200 rounded-b-2xl">
          <div className="bg-white dark:bg-[#13111c] rounded-lg border border-slate-200 dark:border-gray-700 p-4">
             <p className="text-xs font-bold text-slate-500 mb-2 uppercase">COURSE ID:</p>
             <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{id}</p>
          </div>

          <div className="bg-white dark:bg-[#13111c] rounded-lg border border-slate-200 dark:border-gray-700">
            <div className="p-4 border-b border-slate-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">
                {isEditing ? 'Edit Feature' : 'Add Feature'}
              </h3>
              {isEditing && (
                <button onClick={resetForm} className="text-sm text-red-500 hover:text-red-700 font-medium">
                  Cancel Edit
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-slate-300 dark:border-gray-700 rounded px-3 py-2 outline-none focus:border-[#144f36] bg-transparent text-sm text-slate-800 dark:text-slate-200" 
                  placeholder="Enter feature title" 
                  required 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image {isEditing && '(Optional)'}</label>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={(e) => setImage(e.target.files[0])}
                    className="w-full border border-slate-300 dark:border-gray-700 rounded px-3 py-1.5 outline-none focus:border-[#144f36] bg-transparent text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 dark:bg-[#1f1b2e]/50 file:text-slate-700 dark:text-slate-300 hover:file:bg-slate-200 text-slate-700 dark:text-slate-300" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border border-slate-300 dark:border-gray-700 rounded px-3 py-2 outline-none focus:border-[#144f36] bg-transparent text-slate-800 dark:text-slate-200 text-sm"
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <div className="border border-slate-300 dark:border-gray-700 rounded min-h-[150px] p-2 bg-transparent text-slate-800 dark:text-slate-200 text-sm flex flex-col">
                   <div className="border-b border-slate-200 dark:border-[#1f1b2e] pb-2 mb-2 flex gap-2 text-slate-600 dark:text-slate-400">
                     <span className="font-bold cursor-pointer">B</span>
                     <span className="italic cursor-pointer">I</span>
                     <span className="underline cursor-pointer">U</span>
                   </div>
                   <textarea 
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     className="w-full flex-1 outline-none bg-transparent resize-none text-slate-800 dark:text-slate-200" 
                     placeholder="Enter description here..."
                   ></textarea>
                </div>
              </div>
              <div className="flex justify-end">
                 <button type="submit" className="bg-[#1e293b] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                   {isEditing ? 'Update Feature' : 'Save Feature'}
                 </button>
              </div>
            </form>
          </div>
          
          <div className="bg-white dark:bg-[#13111c] rounded-lg border border-slate-200 dark:border-gray-700 p-4">
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">Features List</h3>

            <div className="overflow-auto border border-slate-200 dark:border-[#1f1b2e] rounded-lg">
              <table className="w-full text-left text-sm text-slate-800 dark:text-slate-200">
                <thead className="bg-slate-50 dark:bg-[#13111c] text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-gray-800 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 w-24 whitespace-nowrap">Image</th>
                    <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Feature Info</th>
                    <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 w-24 text-center whitespace-nowrap">Status</th>
                    <th className="px-3 py-3 font-bold whitespace-nowrap text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-8">Loading...</td>
                    </tr>
                  ) : features.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-slate-500">No features found</td>
                    </tr>
                  ) : (
                    features.map((feature) => (
                      <tr key={feature._id} className="border-b border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-[#1f1b2e]/30">
                        <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">
                          {feature.m_feature_image ? (
                            <img 
                              src={getImageUrl(feature.m_feature_image)} 
                              alt={feature.m_feature_title} 
                              className="w-16 h-12 object-cover rounded shadow-sm border border-slate-200"
                              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                            />
                          ) : null}
                          <div className={`w-16 h-12 bg-slate-100 dark:bg-gray-800 border border-slate-200 rounded flex items-center justify-center text-xs text-slate-400 ${feature.m_feature_image ? 'hidden' : 'flex'}`}>
                            No Img
                          </div>
                        </td>
                        <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">
                          <p className="font-semibold mb-1 text-slate-700 dark:text-slate-300">{feature.m_feature_title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl whitespace-pre-line">{feature.m_feature_desc}</p>
                        </td>
                        <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${feature.m_feature_status === 1 ? 'bg-[#144f36]' : 'bg-[#144f36]'}`}>
                            {feature.m_feature_status === 1 ? 'Active' : 'In-Active'}
                          </span>
                        </td>
                        <td className="px-3 py-3 align-middle">
                          <div className="flex flex-col gap-2 items-center">
                            <button onClick={() => handleEdit(feature)} className="bg-[#d87025] text-white px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center gap-1 hover:bg-[#c2621f] transition-colors w-20">
                              <Edit2 size={12} /> Edit
                            </button>
                            <button onClick={() => handleDelete(feature._id)} className="bg-[#d9534f] text-white px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center gap-1 hover:bg-[#b52b27] transition-colors w-20">
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  )
}

