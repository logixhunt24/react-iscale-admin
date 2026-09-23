import { useState, useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../../config/api'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Edit2, Trash2 } from 'lucide-react'
import * as Icons from 'lucide-react'

export default function CourseFaq() {
  
  const navigate = useNavigate()
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
const [status, setStatus] = useState(1)
  const [loading, setLoading] = useState(false)
  const [faqs, setFaqs] = useState([])
  const [editId, setEditId] = useState(null)
  const [courseName, setCourseName] = useState('Loading...')

useEffect(() => {
  fetchFaqs()
  fetchCourseName()
}, [id])

const fetchCourseName = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${BASE_URL}/myadmin/course/course/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (response.data?.status) {
      setCourseName(response.data.data?.title || response.data.data?.m_course_title || 'Unknown Course')
    } else {
      setCourseName('Unknown Course')
    }
  } catch (error) {
    console.error('Error fetching course name:', error)
    setCourseName('Unknown Course')
  }
}

const fetchFaqs = async () => {
  try {
    const token = localStorage.getItem('token')

    const response = await axios.get(
      `${BASE_URL}/myadmin/faq/get-faqs/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    console.log('FAQ LIST:', response.data)

    if (response.data?.status) {
      setFaqs(response.data.data || [])
    }
  } catch (error) {
    console.error('FAQ FETCH ERROR:', error)
  }
}

const handleSaveFaq = async () => {
  if (!title.trim()) {
    await window.customAlert('Please enter a Title.')
    return
  }
  if (!description.trim()) {
    await window.customAlert('Please enter a Description.')
    return
  }

  try {
    setLoading(true); 

    const token = localStorage.getItem('token')

    let response

    if (editId) {
      response = await axios.put(
        `${BASE_URL}/myadmin/faq/update-faq/${editId}`,
        {
          title,
          description,
          status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
    } else {
      response = await axios.post(
        `${BASE_URL}/myadmin/faq/add-faq`,
        {
          course_id: id,
          title,
          description,
          status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
    }

    console.log('FAQ RESPONSE:', response.data)

    if (response.data?.status) {
      await window.customAlert(response.data.message || 'FAQ saved successfully')

      setTitle('')
      setDescription('')
      setStatus(1)
      setEditId(null)

      fetchFaqs()
    } else {
      await window.customAlert(response.data?.message || 'Failed to save FAQ')
    }
  } catch (error) {
    console.error(error)
    await window.customAlert(error.response?.data?.message || error.message || 'Error saving FAQ')
  } finally {
    setLoading(false)
  }
}

const handleDeleteFaq = async (faqId) => {
  if (!await window.customConfirm('Are you sure you want to delete this FAQ?')) {
    return
  }

  try {
    const token = localStorage.getItem('token')

    const response = await axios.delete(
      `${BASE_URL}/myadmin/faq/delete-faq/${faqId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    console.log('DELETE FAQ RESPONSE:', response.data)

    if (response.data?.status) {
      await window.customAlert(response.data.message)
      fetchFaqs()
    }
  } catch (error) {
    console.error('DELETE FAQ ERROR:', error)

    if (error.response) {
      console.log(error.response.data)
    } 
  }
}

  return (
    <div className="animate-fade-in-up">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md border border-slate-100 flex flex-col min-h-[600px]">
        <div className="p-4 flex justify-between items-center flex-wrap gap-4 bg-[#144f36] text-white rounded-t-2xl">
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">Courses FAQ</h2>
          <Link to={'/courses/all'} className="bg-white text-[#144f36] shadow-sm hover:shadow hover:bg-emerald-50 px-4 py-2 rounded-full text-sm font-medium hover:bg-[#0f3d2a] transition-colors flex items-center gap-2">
            <span>+ Back To Course List</span>
          </Link>
        </div>

        <div className="p-4 flex-1 flex flex-col gap-4">


          <div className="bg-white dark:bg-[#13111c] rounded-lg border border-slate-200 dark:border-gray-700">
            <div className="p-4 border-b border-slate-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Add FAQ</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                  <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-slate-300 dark:border-gray-700 rounded px-3 py-2 outline-none focus:border-[#144f36] bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                   value={status}
                   onChange={(e) => setStatus(Number(e.target.value))}
                   className="w-full border border-slate-300 dark:border-gray-700 rounded px-3 py-2 outline-none focus:border-[#144f36] bg-transparent"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-slate-300 dark:border-gray-700 rounded px-3 py-2 outline-none focus:border-[#144f36] bg-transparent"
                ></textarea>
              </div>
              <div className="flex justify-end">
              <button
               onClick={handleSaveFaq}
               disabled={loading}
               className="bg-[#1e293b] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
               >
               {loading ? 'Saving...' : 'Save'}
               </button>                  
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#13111c] rounded-lg border border-slate-200 dark:border-gray-700 p-4">
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">Course Features</h3>
            
            <div className="flex flex-wrap items-center gap-2 mb-4 justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-800 dark:text-slate-200">Show</span>
                <select className="border border-slate-300 dark:border-gray-700 bg-transparent rounded px-2 py-1 text-sm outline-none">
                  <option>50</option>
                </select>
                <span className="text-sm text-slate-800 dark:text-slate-200">Entries</span>
              </div>
              <input type="text" placeholder="Search..." className="border border-slate-300 dark:border-gray-700 bg-transparent rounded-full px-4 py-1.5 text-sm outline-none w-48" />
            </div>

            <div className="overflow-auto border border-slate-200 dark:border-[#1f1b2e]">
              <table className="w-full text-left text-sm text-slate-800 dark:text-slate-200">
                <thead className="bg-[#144f36] text-white">
                  <tr>
                    <th className="px-4 py-3 font-bold border-r border-slate-600/50">Title</th>
                    <th className="px-4 py-3 font-bold border-r border-slate-600/50">Description</th>
                    <th className="px-4 py-3 font-bold border-r border-slate-600/50">Status</th>
                    <th className="px-4 py-3 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
  {faqs.length > 0 ? (
    faqs.map((faq) => (
      <tr
        key={faq._id}
        className="border-b border-slate-200 dark:border-gray-700"
      >
        <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-700">
          {faq.title}
        </td>

        <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-700">
          {faq.description}
        </td>

        <td className="px-4 py-3 border-r border-slate-200 dark:border-gray-700">
          {faq.status === 1 ? 'Active' : 'Inactive'}
        </td>

        <td className="px-4 py-3">
          <div className="flex flex-col gap-1">
        <button
         onClick={async () => {
         setEditId(faq._id)
         setTitle(faq.title)
         setDescription(faq.description)
         setStatus(faq.status)
         }}
        className="bg-[#d87025] text-white px-2 py-1.5 rounded-full text-xs font-medium text-center"
        >   
        Edit
            </button>
            <button
              onClick={() => handleDeleteFaq(faq._id)}
              className="bg-[#d9534f] text-white px-2 py-1.5 rounded-full text-xs font-medium text-center"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4" className="text-center py-4">
        No FAQs Found
      </td>
    </tr>
  )}
</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

