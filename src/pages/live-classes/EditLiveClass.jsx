import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function EditLiveClass() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [batches, setBatches] = useState([])
  const [teachers, setTeachers] = useState([])

  const [formData, setFormData] = useState({
    title: '',
    class_date: '',
    duration: '',
    start_time: '',
    meeting_link: '',
    batch_id: '',
    teacher_id: ''
  })

  useEffect(() => {
    const fetchDependenciesAndData = async () => {
      try {
        const token = localStorage.getItem('token')
        const headers = { Authorization: `Bearer ${token}` }
        
        // Fetch dependencies
        const [batchesRes, instructorsRes, liveClassRes] = await Promise.all([
          axios.get(`${BASE_URL}/myadmin/batch/all?limit=1000`, { headers }),
          axios.get(`${BASE_URL}/myadmin/team/all?limit=1000`, { headers }),
          axios.get(`${BASE_URL}/myadmin/live-class/single/${id}`, { headers })
        ])
        
        if (batchesRes.data.status) setBatches(batchesRes.data.data)
        if (instructorsRes.data.status) setTeachers(instructorsRes.data.data)
        
        // Populate form data
        if (liveClassRes.data.status) {
          const cls = liveClassRes.data.data
          setFormData({
            title: cls.title || '',
            class_date: cls.class_date ? cls.class_date.split('T')[0] : '',
            duration: cls.duration || '',
            start_time: cls.start_time || '',
            meeting_link: cls.meeting_link || '',
            batch_id: cls.batch_id?._id || cls.batch_id || '',
            teacher_id: cls.teacher_id?._id || cls.teacher_id || ''
          })
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setFetching(false)
      }
    }
    fetchDependenciesAndData()
  }, [id])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); 

    let formattedStartTime = formData.start_time;
    if (formattedStartTime && !formattedStartTime.includes('AM') && !formattedStartTime.includes('PM')) {
      const parts = formattedStartTime.split(':');
      if (parts.length >= 2) {
        const hours = parseInt(parts[0], 10);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedH = hours % 12 || 12;
        formattedStartTime = `${String(formattedH).padStart(2, '0')}:${parts[1]} ${ampm}`;
      }
    }

    const payload = {
      ...formData,
      duration: formData.duration ? Number(formData.duration) : 0,
      start_time: formattedStartTime
    }

    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(`${BASE_URL}/myadmin/live-class/update/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data.status) {
        navigate('/live-classes')
      } else {
        await window.customAlert(response.data.message || 'Failed to update live class')
      }
    } catch (error) {
      console.error('Error updating live class:', error)
      await window.customAlert(error.response?.data?.message || 'Error updating live class')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md border border-slate-100 overflow-hidden w-full">
        <div className="bg-[#144f36] p-5 flex justify-between items-center rounded-t-2xl shadow-md relative overflow-hidden group">
          <h2 className="text-xl font-bold text-white tracking-tight">Edit Live Class</h2>
          <Link 
            to={'/live-classes'}
            className="inline-block bg-green-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Go Back
          </Link>
        </div>

        {fetching ? (
          <div className="p-8 text-center text-slate-500 font-medium">Loading details...</div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-4 text-sm font-bold text-slate-800 dark:text-slate-200">Update Live Class</div>
            
            <div className="flex flex-col gap-5 mb-5">
              <div>
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Zoom Class Title *</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="title"
                  className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Class Date *</label>
                <input 
                  type="date" 
                  name="class_date"
                  value={formData.class_date}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Teacher</label>
                <select 
                  name="teacher_id"
                  value={formData.teacher_id}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map(t => <option key={t._id} value={t._id}>{t.member_name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Batch</label>
                <select 
                  name="batch_id"
                  value={formData.batch_id}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                >
                  <option value="">Select Batch</option>
                  {batches.map(b => <option key={b._id} value={b._id}>{b.batch_name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Duration (In Minutes)</label>
                <input 
                  type="number" 
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Duration in minute"
                  className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Start Time</label>
                <input 
                  type="time" 
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Google Meet Link *</label>
                <input 
                  type="url" 
                  name="meeting_link"
                  value={formData.meeting_link}
                  onChange={handleChange}
                  required
                  placeholder="Google Meet Link"
                  className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <button disabled={loading} type="submit" className="bg-[#eab308] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#ca8a04] transition-colors">
                {loading ? 'Updating...' : 'Update Live Class'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
