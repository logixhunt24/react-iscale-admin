import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Edit2, Trash2 } from 'lucide-react'
import axios from 'axios'
import { readSheet } from 'read-excel-file/browser'
import writeExcelFile from 'write-excel-file/browser'
import { BASE_URL } from '../../config/api'

const KEYS = ['A', 'B', 'C', 'D']
const inputCls = 'w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 bg-white'
const emptyQuestion = { m_ques_title_en: '', m_ques_op1_en: '', m_ques_op2_en: '', m_ques_op3_en: '', m_ques_op4_en: '', m_ques_ans: '', m_ques_solutions: '' }
const emptyInstruction = { m_instruction_key: '', m_instruction_value: '' }

const HEADER_ALIASES = {
  question: 'm_ques_title_en',
  option_a: 'm_ques_op1_en', option_b: 'm_ques_op2_en', option_c: 'm_ques_op3_en', option_d: 'm_ques_op4_en',
  correct_answer: 'm_ques_ans', answer: 'm_ques_ans',
  solution: 'm_ques_solutions', explanation: 'm_ques_solutions',
}

const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

export default function QuizQuestions() {
  const navigate = useNavigate()
  const { quizId } = useParams()
  const location = useLocation()
  const quizTitle = location.state?.quizTitle || 'Quiz'

  const [questions, setQuestions] = useState([])
  const [instructions, setInstructions] = useState([])
  const [loading, setLoading] = useState(true)

  const [qForm, setQForm] = useState(emptyQuestion)
  const [qEditId, setQEditId] = useState(null)
  const [qSaving, setQSaving] = useState(false)

  const [importRows, setImportRows] = useState([])
  const [importName, setImportName] = useState('')
  const [importing, setImporting] = useState(false)

  const [iForm, setIForm] = useState(emptyInstruction)
  const [iEditId, setIEditId] = useState(null)
  const [iSaving, setISaving] = useState(false)

  const load = useCallback(async () => {
    try {
      const [qRes, iRes] = await Promise.all([
        axios.get(`${BASE_URL}/myadmin/question/questions-by-quiz/${quizId}`, { headers: authHeaders() }),
        axios.get(`${BASE_URL}/myadmin/instructions/instructions-by-quiz/${quizId}`, { headers: authHeaders() }),
      ])
      setQuestions(qRes.data?.data || [])
      setInstructions(iRes.data?.data || [])
    } catch (error) {
      console.error('Error loading questions:', error)
    } finally {
      setLoading(false)
    }
  }, [quizId])

  useEffect(() => { load() }, [load])

  // ---------- questions ----------
  const handleQChange = (e) => setQForm({ ...qForm, [e.target.name]: e.target.value })

  const resetQ = () => { setQForm(emptyQuestion); setQEditId(null) }

  const saveQuestion = async (e) => {
    e.preventDefault()
    if (!qForm.m_ques_title_en.trim()) return window.customAlert('Question text is required')
    const filled = KEYS.filter((_, i) => qForm[`m_ques_op${i + 1}_en`].trim())
    if (filled.length < 2) return window.customAlert('Please enter at least two options')
    if (!qForm.m_ques_ans) return window.customAlert('Please select the correct answer')
    if (!filled.includes(qForm.m_ques_ans)) return window.customAlert(`Option ${qForm.m_ques_ans} is empty, so it cannot be the correct answer`)

    setQSaving(true)
    try {
      if (qEditId) {
        await axios.put(`${BASE_URL}/myadmin/question/update-question/${qEditId}`, qForm, { headers: authHeaders() })
      } else {
        await axios.post(`${BASE_URL}/myadmin/question/add-question`, { ...qForm, m_ques_quiz: quizId }, { headers: authHeaders() })
      }
      resetQ()
      await load()
    } catch (error) {
      await window.customAlert(error.response?.data?.message || 'Failed to save question')
    } finally {
      setQSaving(false)
    }
  }

  const editQuestion = (q) => {
    setQEditId(q._id)
    setQForm({
      m_ques_title_en: q.m_ques_title_en || '',
      m_ques_op1_en: q.m_ques_op1_en || '',
      m_ques_op2_en: q.m_ques_op2_en || '',
      m_ques_op3_en: q.m_ques_op3_en || '',
      m_ques_op4_en: q.m_ques_op4_en || '',
      m_ques_ans: q.m_ques_ans || '',
      m_ques_solutions: q.m_ques_solutions || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteQuestion = async (id) => {
    if (!(await window.customConfirm('Delete this question?'))) return
    try {
      await axios.delete(`${BASE_URL}/myadmin/question/delete-question/${id}`, { headers: authHeaders() })
      if (qEditId === id) resetQ()
      await load()
    } catch (error) {
      await window.customAlert(error.response?.data?.message || 'Failed to delete question')
    }
  }

  // ---------- Excel import ----------
  const downloadTemplate = async () => {
    await writeExcelFile([
      ['question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer', 'solution'],
      ['What is 2 + 2?', '3', '4', '5', '6', 'B', '2 + 2 equals 4'],
    ]).toFile('questions-template.xlsx')
  }

  const cellText = (v) => (v === null || v === undefined ? '' : String(v).trim())

  const handleExcelFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    let rows
    try {
      rows = await readSheet(file)
    } catch (error) {
      console.error('Excel read error:', error)
      setImportRows([]); setImportName('')
      return window.customAlert('Could not read this file. Please upload a valid .xlsx file.')
    }
    rows = rows.filter((r) => r.some((c) => cellText(c) !== ''))
    if (rows.length < 2) { setImportRows([]); setImportName(''); return window.customAlert('The file has no question rows') }
    const keys = rows[0].map((h) => HEADER_ALIASES[cellText(h).toLowerCase().replace(/[\s-]+/g, '_')] || null)
    if (!keys.includes('m_ques_title_en') || !keys.includes('m_ques_ans')) {
      setImportRows([]); setImportName('')
      return window.customAlert('Missing columns. The first row must contain at least: question, option_a, option_b, correct_answer')
    }
    setImportRows(rows.slice(1).map((cells) => {
      const obj = {}
      keys.forEach((k, i) => { if (k) obj[k] = cellText(cells[i]) })
      return obj
    }))
    setImportName(file.name)
  }

  const runImport = async () => {
    setImporting(true)
    try {
      const res = await axios.post(`${BASE_URL}/myadmin/question/bulk-add`, { m_ques_quiz: quizId, questions: importRows }, { headers: authHeaders() })
      await window.customAlert(res.data?.message || 'Imported')
      setImportRows([]); setImportName('')
      await load()
    } catch (error) {
      const errs = error.response?.data?.errors
      const detail = Array.isArray(errs)
        ? '\n' + errs.slice(0, 10).map((x) => `Row ${x.row}: ${x.message}`).join('\n') + (errs.length > 10 ? `\n...and ${errs.length - 10} more` : '')
        : ''
      await window.customAlert((error.response?.data?.message || 'Import failed') + detail)
    } finally {
      setImporting(false)
    }
  }

  // ---------- instructions ----------
  const saveInstruction = async (e) => {
    e.preventDefault()
    if (!iForm.m_instruction_key.trim()) return window.customAlert('Instruction title is required')
    setISaving(true)
    try {
      if (iEditId) {
        await axios.put(`${BASE_URL}/myadmin/instructions/update-instruction/${iEditId}`, iForm, { headers: authHeaders() })
      } else {
        await axios.post(`${BASE_URL}/myadmin/instructions/add-instruction`, { ...iForm, m_instruction_quiz: [quizId] }, { headers: authHeaders() })
      }
      setIForm(emptyInstruction)
      setIEditId(null)
      await load()
    } catch (error) {
      await window.customAlert(error.response?.data?.message || 'Failed to save instruction')
    } finally {
      setISaving(false)
    }
  }

  const deleteInstruction = async (id) => {
    if (!(await window.customConfirm('Delete this instruction?'))) return
    try {
      await axios.delete(`${BASE_URL}/myadmin/instructions/delete-instruction/${id}`, { headers: authHeaders() })
      await load()
    } catch (error) {
      await window.customAlert(error.response?.data?.message || 'Failed to delete instruction')
    }
  }

  return (
    <div className="min-h-screen bg-[#eaf3f8] p-4 font-sans animate-fade-in-up space-y-5">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 flex justify-between items-center">
        <h2 className="text-slate-800 font-bold text-xl">Questions - {quizTitle}</h2>
        <button onClick={() => navigate(-1)} className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded text-sm font-semibold shadow-sm transition-colors">
          ↩ Back
        </button>
      </div>

      {/* Question form */}
      <form onSubmit={saveQuestion} className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 space-y-4">
        <h3 className="font-bold text-slate-800">{qEditId ? 'Edit Question' : 'Add Question'}</h3>
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1">Question *</label>
          <textarea name="m_ques_title_en" value={qForm.m_ques_title_en} onChange={handleQChange} rows={3} className={inputCls} placeholder="Type the question" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {KEYS.map((k, i) => (
            <div key={k}>
              <label className="block text-sm font-bold text-slate-800 mb-1">Option {k}{i < 2 ? ' *' : ''}</label>
              <input name={`m_ques_op${i + 1}_en`} value={qForm[`m_ques_op${i + 1}_en`]} onChange={handleQChange} className={inputCls} placeholder={`Option ${k}`} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Correct Answer *</label>
            <select name="m_ques_ans" value={qForm.m_ques_ans} onChange={handleQChange} className={inputCls}>
              <option value="">Select</option>
              {KEYS.map((k) => <option key={k} value={k}>Option {k}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-800 mb-1">Solution / Explanation</label>
            <textarea name="m_ques_solutions" value={qForm.m_ques_solutions} onChange={handleQChange} rows={2} className={inputCls} placeholder="Shown to the student after the test" />
          </div>
        </div>
        <div className="flex gap-3">
          <button disabled={qSaving} type="submit" className="bg-[#1f3f66] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#152c48] transition-colors disabled:opacity-60">
            {qSaving ? 'Saving...' : qEditId ? 'Update Question' : 'Add Question'}
          </button>
          {qEditId && <button type="button" onClick={resetQ} className="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-300 transition-colors">Cancel</button>}
        </div>
      </form>

      {/* Excel import */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 space-y-3">
        <h3 className="font-bold text-slate-800">Import Questions from Excel</h3>
        <p className="text-sm text-slate-600">
          Upload an .xlsx file whose first row has the columns: question, option_a, option_b, option_c, option_d, correct_answer (A/B/C/D), solution.
          If any row has a problem nothing is imported.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={downloadTemplate} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-300">Download template</button>
          <label className="bg-[#1f3f66] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#152c48] cursor-pointer">
            Choose Excel file
            <input type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" className="hidden" onChange={handleExcelFile} />
          </label>
          {importRows.length > 0 && (
            <>
              <span className="text-sm text-slate-700">{importName}: <b>{importRows.length}</b> question(s) ready</span>
              <button type="button" disabled={importing} onClick={runImport} className="bg-[#144f36] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0f3d2a] disabled:opacity-60">
                {importing ? 'Importing...' : 'Import'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Question list */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
        <h3 className="font-bold text-slate-800 mb-3">All Questions ({questions.length})</h3>
        {loading ? <p className="text-sm">Loading...</p> : questions.length === 0 ? (
          <p className="text-sm text-slate-500">No questions added yet.</p>
        ) : (
          <div className="space-y-3">
            {questions.map((q, i) => (
              <div key={q._id} className="border border-slate-200 rounded-lg p-3 flex gap-3 justify-between">
                <div className="text-sm min-w-0">
                  <div className="font-semibold text-slate-800 whitespace-pre-wrap break-words">{i + 1}. {q.m_ques_title_en}</div>
                  <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                    {KEYS.map((k, n) => q[`m_ques_op${n + 1}_en`] ? (
                      <li key={k} className={q.m_ques_ans === k ? 'text-green-700 font-bold' : 'text-slate-600'}>
                        {k}. {q[`m_ques_op${n + 1}_en`]}{q.m_ques_ans === k ? '  ✓' : ''}
                      </li>
                    ) : null)}
                  </ul>
                  {!q.m_ques_ans && <p className="text-red-600 text-xs mt-1 font-semibold">No correct answer set — students cannot score on this question.</p>}
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => editQuestion(q)} className="bg-orange-500 text-white p-1.5 rounded hover:bg-orange-600 h-fit" title="Edit"><Edit2 size={13} /></button>
                  <button onClick={() => deleteQuestion(q._id)} className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600 h-fit" title="Delete"><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 space-y-4">
        <h3 className="font-bold text-slate-800">Test Instructions</h3>
        <form onSubmit={saveInstruction} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Title *</label>
            <input value={iForm.m_instruction_key} onChange={(e) => setIForm({ ...iForm, m_instruction_key: e.target.value })} className={inputCls} placeholder="e.g. Marking scheme" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Details</label>
            <input value={iForm.m_instruction_value} onChange={(e) => setIForm({ ...iForm, m_instruction_value: e.target.value })} className={inputCls} placeholder="e.g. +1 for every correct answer" />
          </div>
          <div className="flex gap-2">
            <button disabled={iSaving} type="submit" className="bg-[#1f3f66] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#152c48] disabled:opacity-60">
              {iEditId ? 'Update' : 'Add'}
            </button>
            {iEditId && <button type="button" onClick={() => { setIEditId(null); setIForm(emptyInstruction) }} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm">Cancel</button>}
          </div>
        </form>
        {instructions.length === 0 ? <p className="text-sm text-slate-500">No instructions added.</p> : (
          <ul className="divide-y divide-slate-100">
            {instructions.map((ins) => (
              <li key={ins._id} className="py-2 flex justify-between gap-3 text-sm">
                <span><b>{ins.m_instruction_key}</b>{ins.m_instruction_value ? ` — ${ins.m_instruction_value}` : ''}</span>
                <span className="flex gap-1.5 shrink-0">
                  <button onClick={() => { setIEditId(ins._id); setIForm({ m_instruction_key: ins.m_instruction_key || '', m_instruction_value: ins.m_instruction_value || '' }) }} className="bg-orange-500 text-white p-1.5 rounded hover:bg-orange-600"><Edit2 size={13} /></button>
                  <button onClick={() => deleteInstruction(ins._id)} className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600"><Trash2 size={13} /></button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
