import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Star, Trash2, Eye, EyeOff, Pencil } from 'lucide-react'
import axios from 'axios'
import { BASE_URL } from '../../config/api'
import { getImageUrl } from '../../utils/imageUtils'

const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })
const selectCls = 'border border-slate-300 bg-white rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
const th = 'px-4 py-3 font-bold border-r border-slate-200 whitespace-nowrap'
const td = 'px-4 py-4 border-r border-slate-200 align-top'

export default function AppReviews() {
  const [rows, setRows] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [courseId, setCourseId] = useState('')
  const [published, setPublished] = useState('all')
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [busyId, setBusyId] = useState('')

  useEffect(() => {
    axios.get(`${BASE_URL}/myadmin/course/all-courses?limit=1000`, { headers: authHeaders() })
      .then((r) => setCourses(r.data?.data || []))
      .catch((e) => console.error('Error loading courses', e))
  }, [])

  useEffect(() => {
    const t = setTimeout(() => { setDebounced(search); setPage(1) }, 350)
    return () => clearTimeout(t)
  }, [search])

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${BASE_URL}/myadmin/course-reviews/list`, {
        params: { page, limit: 10, course_id: courseId || undefined, published, search: debounced || undefined },
        headers: authHeaders(),
      })
      setRows(res.data?.data || [])
      setTotal(res.data?.pagination?.totalRecords || 0)
      setTotalPages(res.data?.pagination?.totalPages || 1)
    } catch (err) {
      console.error(err)
      await window.customAlert(err.response?.data?.message || 'Failed to load app reviews')
    } finally {
      setLoading(false)
    }
  }, [page, courseId, published, debounced])

  useEffect(() => { load() }, [load])

  const act = async (row, action) => {
    setBusyId(row._id)
    try {
      await axios.post(`${BASE_URL}/myadmin/course-reviews/${action}/${row._id}`, {}, { headers: authHeaders() })
      await load()
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Action failed')
    } finally {
      setBusyId('')
    }
  }

  const remove = async (row) => {
    if (!(await window.customConfirm('Delete this review from the app data? If it is shown on a course page it will be removed from there too.'))) return
    try {
      await axios.delete(`${BASE_URL}/myadmin/course-reviews/delete/${row._id}`, { headers: authHeaders() })
      await load()
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Failed to delete review')
    }
  }

  return (
    <div className="h-full animate-fade-in-up flex flex-col min-h-0">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md border border-slate-100 overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="bg-[#144f36] rounded-t-2xl p-5 shadow-md">
          <h2 className="text-white font-bold tracking-wide text-2xl">Mobile App Reviews</h2>
          <p className="text-white/80 text-sm mt-1">
            Ratings and comments students submitted in the app. Nothing here appears on the website until you click <b>Show on website</b>.
          </p>
        </div>

        <div className="p-6 flex-1 flex flex-col min-h-0">
          <div className="flex flex-wrap gap-3 mb-4">
            <select value={courseId} onChange={(e) => { setCourseId(e.target.value); setPage(1) }} className={selectCls}>
              <option value="">All courses</option>
              {courses.map((c) => <option key={c._id} value={c._id}>{c.title || c.m_course_title}</option>)}
            </select>
            <select value={published} onChange={(e) => { setPublished(e.target.value); setPage(1) }} className={selectCls}>
              <option value="all">All reviews</option>
              <option value="no">Not shown yet</option>
              <option value="yes">Shown on website</option>
            </select>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search student or review text" className={`${selectCls} flex-1 min-w-[200px]`} />
          </div>

          <div className="overflow-auto border border-slate-200 flex-1">
            <table className="w-full text-left text-sm text-slate-800">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className={th}>Student</th>
                  <th className={th}>Course</th>
                  <th className={th}>Rating</th>
                  <th className={th}>Review</th>
                  <th className={th}>Date</th>
                  <th className={`${th} text-center`}>On website</th>
                  <th className="px-4 py-3 font-bold whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-8 text-slate-500">Loading...</td></tr>
                ) : rows.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-8 text-slate-500">No app reviews found</td></tr>
                ) : rows.map((r) => (
                  <tr key={r._id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className={td}>
                      <div className="flex items-center gap-2">
                        {r.student_image
                          ? <img src={getImageUrl(r.student_image)} alt="" className="w-9 h-9 rounded-full object-cover" />
                          : <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-500">{r.student_name.charAt(0).toUpperCase()}</div>}
                        <div>
                          <div className="font-medium">{r.student_name}</div>
                          {r.student_contact && <div className="text-xs text-slate-500">{r.student_contact}</div>}
                        </div>
                      </div>
                    </td>
                    <td className={td}>{r.course_title || <span className="text-slate-400">—</span>}</td>
                    <td className={`${td} whitespace-nowrap`}>
                      <span className="flex items-center gap-1 text-amber-500"><Star size={14} fill="currentColor" /> {r.rating}</span>
                    </td>
                    <td className={`${td} max-w-sm`}>
                      {r.remark ? r.remark : <span className="text-slate-400 italic">Rating only, no written review</span>}
                    </td>
                    <td className={`${td} whitespace-nowrap text-xs`}>{new Date(r.submitted_at).toLocaleDateString()}</td>
                    <td className={`${td} text-center`}>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${r.published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                        {r.published ? 'Shown' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-center gap-2 flex-wrap">
                        {r.published ? (
                          <button disabled={busyId === r._id} onClick={() => act(r, 'unpublish')} className="inline-flex items-center gap-1 bg-slate-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-slate-700 disabled:opacity-60" title="Hide from the website">
                            <EyeOff size={13} /> Hide
                          </button>
                        ) : (
                          <button
                            disabled={busyId === r._id || !r.remark}
                            onClick={() => act(r, 'publish')}
                            className="inline-flex items-center gap-1 bg-[#144f36] text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-[#0f3d2a] disabled:opacity-50 disabled:cursor-not-allowed"
                            title={r.remark ? 'Show on the course page' : 'This review has no written text'}
                          >
                            <Eye size={13} /> Show on website
                          </button>
                        )}
                        {r.published_copy_id && (
                          <Link to={`/courses/ratings/edit/${r.published_copy_id}`} className="inline-flex items-center bg-orange-500 text-white p-1.5 rounded hover:bg-orange-600" title="Edit the version shown on the website">
                            <Pencil size={13} />
                          </Link>
                        )}
                        <button onClick={() => remove(r)} className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600" title="Delete"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex justify-between items-center text-sm text-slate-700">
            <div>{total} review(s)</div>
            <div className="flex items-center gap-3">
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 border border-slate-300 rounded disabled:opacity-40">Previous</button>
              <span>Page {page} of {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 border border-slate-300 rounded disabled:opacity-40">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
