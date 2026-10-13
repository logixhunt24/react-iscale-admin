import { useState, useEffect, useCallback } from 'react'
import { Edit2, Trash2, ListChecks } from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })
const th = 'px-4 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap'
const td = 'px-4 py-3 border-r border-slate-200 dark:border-gray-800/50'

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : '—')

export default function CompetitionsList() {
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ totalRecords: 0, totalPages: 1 })

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setCurrentPage(1) }, 350)
    return () => clearTimeout(t)
  }, [search])

  const fetchCompetitions = useCallback(async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${BASE_URL}/myadmin/competition/all`, {
        params: { page: currentPage, limit: entriesPerPage, search: debouncedSearch || undefined },
        headers: authHeaders(),
      })
      if (res.data?.status) {
        setData(res.data.data)
        setPagination(res.data.pagination)
      }
    } catch (err) {
      console.error(err)
      await window.customAlert(err.response?.data?.message || 'Failed to fetch competitions')
    } finally {
      setLoading(false)
    }
  }, [currentPage, entriesPerPage, debouncedSearch])

  useEffect(() => { fetchCompetitions() }, [fetchCompetitions])

  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(`${BASE_URL}/myadmin/competition/status/${id}`, {}, { headers: authHeaders() })
      fetchCompetitions()
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Failed to update status')
    }
  }

  const handleDelete = async (id) => {
    if (!(await window.customConfirm('Are you sure you want to delete this competition?'))) return
    try {
      await axios.delete(`${BASE_URL}/myadmin/competition/delete/${id}`, { headers: authHeaders() })
      fetchCompetitions()
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Failed to delete competition')
    }
  }

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md border border-slate-100 overflow-hidden flex flex-col h-full">
        <div className="p-4 flex justify-between items-center bg-[#144f36] dark:bg-[#0f3d2a] rounded-t-2xl">
          <h2 className="text-xl font-bold tracking-tight text-white">Competitions</h2>
          <Link to="/competitions/add" className="bg-white text-[#144f36] px-4 py-2 rounded-full text-sm font-bold hover:bg-slate-100 transition-colors shadow-sm">
            + Add New
          </Link>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-800 dark:text-slate-200">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1) }}
                className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] rounded px-2 py-1 text-sm outline-none"
              >
                {[5, 10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <span className="text-sm text-slate-800 dark:text-slate-200">Entries</span>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title or company"
              className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] rounded px-3 py-1.5 text-sm outline-none focus:border-indigo-600 w-full sm:w-64"
            />
          </div>

          <div className="overflow-auto border border-slate-200 dark:border-[#1f1b2e] flex-1">
            <table className="w-full text-left text-sm text-slate-800 dark:text-slate-200">
              <thead className="bg-slate-50 dark:bg-[#13111c] border-b border-slate-200 dark:border-gray-800">
                <tr>
                  <th className={th}>S.No.</th>
                  <th className={th}>Title</th>
                  <th className={th}>Company</th>
                  <th className={th}>Dates</th>
                  <th className={th}>Priority</th>
                  <th className={th}>Image</th>
                  <th className={th}>Quizzes</th>
                  <th className={th}>Status</th>
                  <th className="px-4 py-3 font-bold whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="9" className="px-4 py-8 text-center">Loading...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan="9" className="px-4 py-8 text-center text-slate-500">No competitions found</td></tr>
                ) : data.map((item, index) => (
                  <tr key={item._id} className="border-b border-slate-200 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-[#1f1b2e]/50">
                    <td className={td}>{(currentPage - 1) * entriesPerPage + index + 1}</td>
                    <td className={`${td} font-medium`}>{item.m_competition_title}</td>
                    <td className={td}>{item.m_competition_company || '—'}</td>
                    <td className={`${td} whitespace-nowrap text-xs`}>{fmtDate(item.m_competition_started)} – {fmtDate(item.m_competition_ended)}</td>
                    <td className={td}>{item.m_competition_priority}</td>
                    <td className={td}>
                      {item.m_competition_image ? <img src={item.m_competition_image} alt="competition" className="h-10 object-cover rounded" /> : 'N/A'}
                    </td>
                    <td className={td}>
                      <Link to={`/competitions/${item._id}/quizzes`} className="inline-flex items-center gap-1 bg-[#1f3f66] text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-[#152c48]">
                        <ListChecks size={13} /> {item.quiz_count} Quizzes
                      </Link>
                    </td>
                    <td className={td}>
                      <button
                        onClick={() => handleToggleStatus(item._id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${item.m_competition_status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                      >
                        {item.m_competition_status === 1 ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link to={`/competitions/edit/${item._id}`} className="inline-block p-1.5 bg-[#d87025] text-white rounded hover:bg-[#b55d1f] shadow-sm" title="Edit"><Edit2 size={16} /></Link>
                        <button onClick={() => handleDelete(item._id)} className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700 shadow-sm" title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center text-sm text-slate-800 dark:text-slate-200">
            <div>
              Showing {data.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} to {Math.min(currentPage * entriesPerPage, pagination.totalRecords)} of {pagination.totalRecords} entries
            </div>
            <div className="flex gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50">Previous</button>
              <button disabled={currentPage >= pagination.totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
