import { useState, useEffect, useRef } from 'react'
import { Reorder, useDragControls } from 'framer-motion'
import { GripVertical, ChevronDown, Pencil, Trash2, X, Plus } from 'lucide-react'
import axios from 'axios'
import { BASE_URL } from '../../config/api'
import CardHeader from '../../components/ui/CardHeader'

const API = `${BASE_URL}/myadmin/popular-category`
const authCfg = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })

// Grip that starts the drag; the rest of the row stays clickable
function Grip({ controls }) {
  return (
    <button
      type="button"
      title="Drag to reorder"
      onPointerDown={(e) => controls.start(e)}
      style={{ touchAction: 'none' }}
      className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 p-1 shrink-0"
    >
      <GripVertical size={18} />
    </button>
  )
}

function CourseRow({ course, onDragEnd, onRemove }) {
  const controls = useDragControls()
  return (
    <Reorder.Item
      value={course}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDragEnd}
      className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-2 mb-2 shadow-sm"
    >
      <Grip controls={controls} />
      <span className="flex-1 text-sm text-slate-800 font-medium">{course.m_course_title}</span>
      {course.m_course_status !== 1 && (
        <span className="text-[11px] font-semibold text-red-600 bg-red-50 rounded-full px-2 py-0.5">Inactive - hidden on site</span>
      )}
      <button type="button" onClick={onRemove} title="Remove from this list" className="text-slate-400 hover:text-red-600 p-1">
        <X size={16} />
      </button>
    </Reorder.Item>
  )
}

// Ordered course list + "add a course" picker, shared by All Programs and each category
function CoursePanel({ courses, allCourses, onReorder, onDragEnd, onAdd, onRemove }) {
  const [search, setSearch] = useState('')
  const taken = new Set(courses.map((c) => c._id))
  const available = allCourses.filter(
    (c) => !taken.has(c._id) && c.m_course_title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {courses.length === 0 ? (
        <p className="text-sm text-slate-500 mb-3">No courses yet. Add some below.</p>
      ) : (
        <>
          <p className="text-xs text-slate-500 mb-2">Drag the handle to set the order courses appear in.</p>
          <Reorder.Group axis="y" values={courses} onReorder={onReorder} className="mb-3">
            {courses.map((course) => (
              <CourseRow
                key={course._id}
                course={course}
                onDragEnd={onDragEnd}
                onRemove={() => onRemove(course._id)}
              />
            ))}
          </Reorder.Group>
        </>
      )}

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search a course to add..."
        className="w-full md:w-1/2 border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] bg-white"
      />
      <div className="mt-2 max-h-48 overflow-y-auto md:w-1/2 border border-slate-200 rounded bg-white divide-y divide-slate-100">
        {available.length === 0 ? (
          <p className="text-sm text-slate-500 px-3 py-2">No more active courses to add.</p>
        ) : (
          available.map((c) => (
            <button
              key={c._id}
              type="button"
              onClick={() => onAdd(c)}
              className="w-full flex items-center justify-between text-left px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50"
            >
              {c.m_course_title}
              <Plus size={14} className="text-[#144f36]" />
            </button>
          ))
        )}
      </div>
    </>
  )
}

function CategoryRow({
  cat, open, allCourses, busyId,
  onToggleOpen, onDragEnd, onRename, onToggleStatus, onDelete,
  onCoursesReorder, onCoursesDragEnd, onAddCourse, onRemoveCourse,
}) {
  const controls = useDragControls()
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(cat.title)

  const saveTitle = () => {
    setEditing(false)
    if (title.trim() && title.trim() !== cat.title) onRename(title.trim())
    else setTitle(cat.title)
  }

  return (
    <Reorder.Item
      value={cat}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDragEnd}
      className="bg-white border border-slate-200 rounded-xl mb-3 shadow-sm"
    >
      <div className="flex items-center gap-2 px-3 py-3">
        <Grip controls={controls} />
        <button type="button" onClick={onToggleOpen} className="text-slate-500 p-1">
          <ChevronDown size={18} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {editing ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') { setTitle(cat.title); setEditing(false) } }}
            className="flex-1 border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-[#144f36]"
          />
        ) : (
          <button type="button" onClick={onToggleOpen} className="flex-1 text-left font-bold text-slate-800">
            {cat.title} <span className="text-xs font-medium text-slate-500">({cat.courses.length} courses)</span>
          </button>
        )}

        <button
          type="button"
          onClick={onToggleStatus}
          disabled={busyId === cat._id}
          title="Click to switch"
          className={`px-3 py-1 rounded-full text-xs font-medium text-white ${cat.status === 1 ? 'bg-[#144f36]' : 'bg-slate-400'}`}
        >
          {cat.status === 1 ? 'Active' : 'Inactive'}
        </button>
        <button type="button" onClick={() => setEditing(true)} title="Rename" className="text-slate-500 hover:text-[#144f36] p-1"><Pencil size={16} /></button>
        <button type="button" onClick={onDelete} title="Delete category" className="text-slate-500 hover:text-red-600 p-1"><Trash2 size={16} /></button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-slate-50 rounded-b-xl px-4 py-4">
          <CoursePanel
            courses={cat.courses}
            allCourses={allCourses}
            onReorder={onCoursesReorder}
            onDragEnd={onCoursesDragEnd}
            onAdd={onAddCourse}
            onRemove={onRemoveCourse}
          />
        </div>
      )}
    </Reorder.Item>
  )
}

export default function MostPopular() {
  const [cats, setCats] = useState([])
  const [allCourses, setAllCourses] = useState([])
  const [allList, setAllList] = useState([])
  const [allConfigured, setAllConfigured] = useState(false)
  const [allOpen, setAllOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [busyId, setBusyId] = useState(null)

  // Drag handlers run after the state update, so read the latest lists from refs
  const catsRef = useRef(cats)
  catsRef.current = cats
  const allRef = useRef(allList)
  allRef.current = allList

  const fetchAll = async () => {
    try {
      const [catRes, courseRes] = await Promise.all([
        axios.get(API, authCfg()),
        axios.get(`${BASE_URL}/myadmin/course/dropdown?limit=1000`, authCfg()),
      ])
      setCats((catRes.data?.data || []).map((c) => ({ ...c, courses: (c.courses || []).filter(Boolean) })))
      setAllCourses(courseRes.data?.data || [])
      setAllList((catRes.data?.all?.courses || []).filter(Boolean))
      setAllConfigured(!!catRes.data?.all?.configured)
    } catch (err) {
      console.error('Error loading most popular:', err)
      await window.customAlert(err.response?.data?.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const fail = async (err) => {
    console.error(err)
    await window.customAlert(err.response?.data?.message || 'Something went wrong')
    fetchAll()
  }

  const replaceCat = (updated) =>
    setCats((prev) => prev.map((c) => (c._id === updated._id ? { ...updated, courses: (updated.courses || []).filter(Boolean) } : c)))

  const saveCat = async (id, patch) => {
    try {
      setBusyId(id)
      const res = await axios.put(`${API}/${id}`, patch, authCfg())
      replaceCat(res.data.data)
    } catch (err) { await fail(err) } finally { setBusyId(null) }
  }

  const saveAllPrograms = async (courses) => {
    try {
      const res = await axios.put(`${API}/all`, { courses: courses.map((c) => c._id) }, authCfg())
      setAllList((res.data.all.courses || []).filter(Boolean))
      setAllConfigured(true)
    } catch (err) { await fail(err) }
  }

  const addCategory = async () => {
    const title = newTitle.trim()
    if (!title) return
    try {
      const res = await axios.post(API, { title }, authCfg())
      setCats((prev) => [...prev, { ...res.data.data, courses: [] }])
      setOpenId(res.data.data._id)
      setNewTitle('')
    } catch (err) { await fail(err) }
  }

  const deleteCategory = async (cat) => {
    if (!await window.customConfirm(`Delete the category "${cat.title}"? The courses themselves are not deleted.`)) return
    try {
      await axios.delete(`${API}/${cat._id}`, authCfg())
      setCats((prev) => prev.filter((c) => c._id !== cat._id))
    } catch (err) { await fail(err) }
  }

  const saveCategoryOrder = async () => {
    try {
      await axios.put(`${API}/reorder`, { ids: catsRef.current.map((c) => c._id) }, authCfg())
    } catch (err) { await fail(err) }
  }

  const setCourses = (catId, courses) =>
    setCats((prev) => prev.map((c) => (c._id === catId ? { ...c, courses } : c)))

  const saveCourseOrder = (catId) =>
    saveCat(catId, { courses: catsRef.current.find((c) => c._id === catId).courses.map((c) => c._id) })

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md border border-slate-100 overflow-hidden flex flex-col h-full">
        <CardHeader title="Most Popular Courses" />

        <div className="p-4 flex-1 overflow-y-auto">
          <p className="text-sm text-slate-600 mb-4">
            These are the tabs and courses shown in the website's "Most Popular Courses" section. "All Programs" is
            the first tab. Below it, add your own category tabs. Drag the handle to change the order of
            categories, and open a category to choose and order its courses.
          </p>

          {!loading && (
            <div className="bg-white border border-emerald-200 rounded-xl mb-5 shadow-sm">
              <button type="button" onClick={() => setAllOpen((o) => !o)} className="w-full flex items-center gap-2 px-4 py-3 text-left">
                <ChevronDown size={18} className={`text-slate-500 transition-transform ${allOpen ? 'rotate-180' : ''}`} />
                <span className="font-bold text-slate-800">All Programs</span>
                <span className="text-xs font-medium text-slate-500">({allList.length} courses)</span>
                {!allConfigured && (
                  <span className="ml-2 text-[11px] font-semibold text-amber-700 bg-amber-50 rounded-full px-2 py-0.5">
                    Not customised yet - showing every active course
                  </span>
                )}
              </button>
              {allOpen && (
                <div className="border-t border-slate-100 bg-slate-50 rounded-b-xl px-4 py-4">
                  <p className="text-xs text-slate-500 mb-3">
                    Removing a course here only hides it from All Programs. A new course you create is added
                    here automatically, at the top.
                  </p>
                  <CoursePanel
                    courses={allList}
                    allCourses={allCourses}
                    onReorder={setAllList}
                    onDragEnd={() => saveAllPrograms(allRef.current)}
                    onAdd={(c) => saveAllPrograms([...allList, c])}
                    onRemove={(id) => saveAllPrograms(allList.filter((c) => c._id !== id))}
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 mb-5">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addCategory() }}
              placeholder="New category name, e.g. Data Science"
              className="w-full md:w-96 border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] bg-white"
            />
            <button onClick={addCategory} className="bg-[#144f36] hover:bg-[#0f3d2a] text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-1.5">
              <Plus size={16} /> Add Category
            </button>
          </div>

          {loading ? (
            <p className="text-slate-500 text-sm">Loading...</p>
          ) : cats.length === 0 ? (
            <p className="text-slate-500 text-sm">
              No categories yet. Until you add one, the website falls back to showing every course grouped by its normal category.
            </p>
          ) : (
            <Reorder.Group axis="y" values={cats} onReorder={setCats}>
              {cats.map((cat) => (
                <CategoryRow
                  key={cat._id}
                  cat={cat}
                  open={openId === cat._id}
                  allCourses={allCourses}
                  busyId={busyId}
                  onToggleOpen={() => setOpenId(openId === cat._id ? null : cat._id)}
                  onDragEnd={saveCategoryOrder}
                  onRename={(title) => saveCat(cat._id, { title })}
                  onToggleStatus={() => saveCat(cat._id, { status: cat.status === 1 ? 0 : 1 })}
                  onDelete={() => deleteCategory(cat)}
                  onCoursesReorder={(courses) => setCourses(cat._id, courses)}
                  onCoursesDragEnd={() => saveCourseOrder(cat._id)}
                  onAddCourse={(c) => saveCat(cat._id, { courses: [...cat.courses.map((x) => x._id), c._id] })}
                  onRemoveCourse={(courseId) => saveCat(cat._id, { courses: cat.courses.filter((x) => x._id !== courseId).map((x) => x._id) })}
                />
              ))}
            </Reorder.Group>
          )}
        </div>
      </div>
    </div>
  )
}
