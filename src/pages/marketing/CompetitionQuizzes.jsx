import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })
const inputCls = 'w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 bg-white'

export default function CompetitionQuizzes() {
  const { id } = useParams()
  const [competition, setCompetition] = useState(null)
  const [allQuizzes, setAllQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState('')
  const [filter, setFilter] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    try {
      const [cRes, qRes] = await Promise.all([
        axios.get(`${BASE_URL}/myadmin/competition/${id}`, { headers: authHeaders() }),
        axios.get(`${BASE_URL}/myadmin/quiz/all-quiz?limit=1000`, { headers: authHeaders() }),
      ])
      setCompetition(cRes.data?.data || null)
      setAllQuizzes(qRes.data?.data || [])
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Failed to load competition')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { load() }, [load])

  const attached = competition?.m_competition_quizzes || []
  const attachedIds = useMemo(() => new Set(attached.map((q) => String(q._id))), [attached])
  const available = useMemo(() => {
    const k = filter.trim().toLowerCase()
    return allQuizzes
      .filter((q) => !attachedIds.has(String(q._id)))
      .filter((q) => !k || (q.m_quiz_title || '').toLowerCase().includes(k))
  }, [allQuizzes, attachedIds, filter])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!selected) return
    setSaving(true)
    try {
      await axios.post(`${BASE_URL}/myadmin/competition/${id}/quizzes`, { quiz_id: selected }, { headers: authHeaders() })
      setSelected('')
      await load()
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Failed to add quiz')
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async (quizId) => {
    if (!(await window.customConfirm('Remove this quiz from the competition?'))) return
    try {
      await axios.delete(`${BASE_URL}/myadmin/competition/${id}/quizzes/${quizId}`, { headers: authHeaders() })
      await load()
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Failed to remove quiz')
    }
  }

  return (
    <div className="min-h-screen bg-[#eaf3f8] p-4 font-sans animate-fade-in-up space-y-5">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 flex justify-between items-center">
        <h2 className="text-slate-800 font-bold text-xl">Competition Quizzes{competition ? ` - ${competition.m_competition_title}` : ''}</h2>
        <Link to="/competitions" className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded text-sm font-semibold shadow-sm">↩ Back</Link>
      </div>

      {loading ? <p className="text-sm">Loading...</p> : !competition ? <p className="text-sm">Competition not found.</p> : (
        <>
          <form onSubmit={handleAdd} className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">Find quiz</label>
              <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Type to filter" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">Add quiz</label>
              <select value={selected} onChange={(e) => setSelected(e.target.value)} className={inputCls}>
                <option value="">{available.length ? 'Select quiz' : 'No quizzes available'}</option>
                {available.map((q) => <option key={q._id} value={q._id}>{q.m_quiz_title}</option>)}
              </select>
            </div>
            <button type="submit" disabled={!selected || saving} className="bg-[#1f3f66] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#152c48] transition-colors disabled:opacity-50">
              {saving ? 'Adding...' : 'Add Quiz'}
            </button>
          </form>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 mb-3">Quizzes in this competition ({attached.length})</h3>
            {attached.length === 0 ? (
              <p className="text-sm text-slate-500">No quizzes added yet.</p>
            ) : (
              <table className="w-full text-left text-sm border border-slate-200">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 font-semibold border-r border-slate-200">S.No.</th>
                    <th className="px-3 py-2 font-semibold border-r border-slate-200">Quiz</th>
                    <th className="px-3 py-2 font-semibold border-r border-slate-200">Status</th>
                    <th className="px-3 py-2 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {attached.map((q, i) => (
                    <tr key={q._id} className="border-b border-slate-200">
                      <td className="px-3 py-2 border-r border-slate-200">{i + 1}</td>
                      <td className="px-3 py-2 border-r border-slate-200">{q.m_quiz_title}</td>
                      <td className="px-3 py-2 border-r border-slate-200">
                        <span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${q.m_quiz_status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {q.m_quiz_status === 1 ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <button onClick={() => handleRemove(q._id)} className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700" title="Remove"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  )
}
