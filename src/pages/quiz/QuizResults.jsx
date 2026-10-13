import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Eye, RotateCcw, Download } from 'lucide-react'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })
const selectCls = 'border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 bg-white min-w-[220px]'
const th = 'px-3 py-3 font-semibold text-xs border-r border-slate-200 whitespace-nowrap'
const td = 'px-3 py-2 border-r border-slate-200 align-top text-xs'

const csvCell = (v) => {
  const s = v === null || v === undefined ? '' : String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export default function QuizResults() {
  const [params, setParams] = useSearchParams()
  const packageId = params.get('package') || ''
  const quizId = params.get('quiz') || ''

  const [packages, setPackages] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [detail, setDetail] = useState(null)

  const setFilter = (next) => {
    const merged = { package: packageId, quiz: quizId, ...next }
    const clean = {}
    Object.entries(merged).forEach(([k, v]) => { if (v) clean[k] = v })
    setPage(1)
    setParams(clean, { replace: true })
  }

  useEffect(() => {
    axios.get(`${BASE_URL}/myadmin/test-package/dropdown?limit=1000`, { headers: authHeaders() })
      .then((r) => setPackages(r.data?.data || []))
      .catch((e) => console.error('Error loading packages:', e))
  }, [])

  useEffect(() => {
    if (!packageId) { setQuizzes([]); return }
    axios.get(`${BASE_URL}/myadmin/quiz/quiz-by-package/${packageId}`, { headers: authHeaders() })
      .then((r) => setQuizzes(r.data?.data || []))
      .catch(() => setQuizzes([]))
  }, [packageId])

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1) }, 350)
    return () => clearTimeout(t)
  }, [search])

  const buildParams = useCallback((extra = {}) => ({
    quiz_id: quizId || undefined,
    package_id: quizId ? undefined : packageId || undefined,
    search: debouncedSearch || undefined,
    ...extra,
  }), [quizId, packageId, debouncedSearch])

  const load = useCallback(async () => {
    if (!quizId && !packageId) { setRows([]); setTotal(0); return }
    setLoading(true)
    try {
      const res = await axios.get(`${BASE_URL}/myadmin/quiz-results/list`, {
        params: buildParams({ page, limit: 25 }),
        headers: authHeaders(),
      })
      setRows(res.data?.data || [])
      setTotalPages(res.data?.totalPages || 1)
      setTotal(res.data?.total || 0)
    } catch (error) {
      console.error('Error loading results:', error)
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [quizId, packageId, page, buildParams])

  useEffect(() => { load() }, [load])

  const exportCsv = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/myadmin/quiz-results/list`, {
        params: buildParams({ all: 1 }),
        headers: authHeaders(),
      })
      const data = res.data?.data || []
      const head = ['Rank', 'Test', 'Student', 'Email', 'Mobile', 'Questions', 'Attempted', 'Correct', 'Wrong', 'Skipped', 'Marks', 'Total Marks', 'Percentage', 'Time Taken', 'Submitted At']
      const lines = [head.map(csvCell).join(',')]
      data.forEach((r) => lines.push([
        r.rank ?? '', r.quiz_title, r.name, r.email, r.contact, r.total_questions, r.attempted, r.correct, r.wrong, r.skipped,
        r.marks_obtained, r.total_marks, `${r.percentage}%`, r.time_taken, new Date(r.submitted_at).toLocaleString(),
      ].map(csvCell).join(',')))
      const blob = new Blob([`﻿${lines.join('\n')}`], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'test-results.csv'
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      await window.customAlert(error.response?.data?.message || 'Export failed')
    }
  }

  const openDetail = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/myadmin/quiz-results/details/${id}`, { headers: authHeaders() })
      setDetail(res.data?.data || null)
    } catch (error) {
      await window.customAlert(error.response?.data?.message || 'Failed to load result')
    }
  }

  const resetAttempt = async (row) => {
    if (!(await window.customConfirm(`Reset ${row.name || 'this student'}'s attempt? Their score will be deleted and they can take the test again.`))) return
    try {
      await axios.delete(`${BASE_URL}/myadmin/quiz-results/reset/${row._id}`, { headers: authHeaders() })
      await load()
    } catch (error) {
      await window.customAlert(error.response?.data?.message || 'Failed to reset attempt')
    }
  }

  const ready = !!(quizId || packageId)

  return (
    <div className="min-h-screen bg-[#eaf3f8] p-4 font-sans animate-fade-in-up space-y-5">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-slate-800 font-bold text-xl">Test Series Results &amp; Leaderboard</h2>
        <button
          onClick={exportCsv}
          disabled={!ready || total === 0}
          className="bg-[#144f36] hover:bg-[#0f3d2a] text-white px-4 py-2 rounded text-sm font-semibold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Package</label>
          <select value={packageId} onChange={(e) => setFilter({ package: e.target.value, quiz: '' })} className={selectCls}>
            <option value="">Select package</option>
            {packages.map((p) => <option key={p._id} value={p._id}>{p.m_package_title}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Test</label>
          <select value={quizId} onChange={(e) => setFilter({ quiz: e.target.value })} disabled={!packageId} className={selectCls}>
            <option value="">All tests in package</option>
            {quizzes.map((q) => <option key={q._id} value={q._id}>{q.m_quiz_title}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-slate-700 mb-1">Search</label>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, email or mobile" className={`${selectCls} w-full`} />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden p-4">
        {!ready ? (
          <p className="text-sm text-slate-500 py-6 text-center">Select a package to see student results.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-slate-200">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {quizId && <th className={th}>Rank</th>}
                    {!quizId && <th className={th}>Test</th>}
                    <th className={th}>Student</th>
                    <th className={th}>Mobile</th>
                    <th className={th}>Attempted</th>
                    <th className={th}>Correct</th>
                    <th className={th}>Wrong</th>
                    <th className={th}>Marks</th>
                    <th className={th}>%</th>
                    <th className={th}>Time</th>
                    <th className={th}>Submitted</th>
                    <th className="px-3 py-3 font-semibold text-xs">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="12" className="text-center py-5 text-sm">Loading...</td></tr>
                  ) : rows.length === 0 ? (
                    <tr><td colSpan="12" className="text-center py-5 text-sm">No results found</td></tr>
                  ) : rows.map((r) => (
                    <tr key={r._id} className="border-b border-slate-200 hover:bg-slate-50">
                      {quizId && <td className={`${td} font-bold`}>{r.rank}</td>}
                      {!quizId && <td className={td}>{r.quiz_title}</td>}
                      <td className={td}>
                        <div className="font-semibold">{r.name || '—'}</div>
                        <div className="text-slate-500">{r.email}</div>
                      </td>
                      <td className={td}>{r.contact}</td>
                      <td className={td}>{r.attempted}/{r.total_questions}</td>
                      <td className={`${td} text-green-700 font-semibold`}>{r.correct}</td>
                      <td className={`${td} text-red-600 font-semibold`}>{r.wrong}</td>
                      <td className={`${td} font-bold`}>{r.marks_obtained}/{r.total_marks}</td>
                      <td className={td}>{r.percentage}%</td>
                      <td className={td}>{r.time_taken}</td>
                      <td className={`${td} whitespace-nowrap`}>{new Date(r.submitted_at).toLocaleString()}</td>
                      <td className="px-3 py-2 align-top">
                        <div className="flex gap-1.5">
                          <button onClick={() => openDetail(r._id)} title="View answers" className="bg-[#144f36] text-white p-1.5 rounded-full hover:bg-[#0f3d2a]"><Eye size={13} /></button>
                          <button onClick={() => resetAttempt(r)} title="Reset attempt (allow retake)" className="bg-[#d87025] text-white p-1.5 rounded-full hover:bg-[#b55d1f]"><RotateCcw size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex justify-between items-center text-xs text-slate-700">
              <div>{total} result(s)</div>
              <div className="flex items-center gap-3">
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="disabled:opacity-40">Pre</button>
                <span>Page {page} of {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="disabled:opacity-40">Next</button>
              </div>
            </div>
          </>
        )}
      </div>

      {detail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start gap-3 mb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-800">{detail.quiz_title}</h3>
                <p className="text-sm text-slate-600">{detail.student?.name} · {detail.student?.email} · {detail.student?.contact}</p>
                <p className="text-sm font-semibold mt-1">
                  Score {detail.marks_obtained}/{detail.total_marks} ({detail.percentage}%) · Correct {detail.correct} · Wrong {detail.wrong} · Skipped {detail.skipped}
                </p>
              </div>
              <button onClick={() => setDetail(null)} className="text-slate-500 hover:text-slate-800 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3">
              {detail.review.map((q) => (
                <div key={q._id} className="border border-slate-200 rounded-lg p-3 text-sm">
                  <div className="font-semibold whitespace-pre-wrap break-words">{q.number}. {q.title}</div>
                  <div className="mt-1 text-xs">
                    <span className={q.given_answer ? (q.is_correct ? 'text-green-700 font-bold' : 'text-red-600 font-bold') : 'text-slate-500'}>
                      Student: {q.given_answer || 'Not attempted'}
                    </span>
                    <span className="ml-4 text-green-700 font-bold">Correct: {q.correct_answer || '—'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
