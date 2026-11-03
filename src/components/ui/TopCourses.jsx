import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'

export default function TopCourses({ apiData }) {
  const navigate = useNavigate()

  // API rows: { course_name, category: { name }, total_registrations }
  const rows = Array.isArray(apiData) ? apiData.slice(0, 5) : []
  const best = Math.max(...rows.map(r => r.total_registrations || 0), 1)
  const courses = rows.map(r => ({
    name: r.course_name,
    category: r.category?.name || '',
    sales: r.total_registrations || 0,
    progress: Math.round(((r.total_registrations || 0) / best) * 100),
    color: 'bg-emerald-500',
    icon: 'BookOpen'
  }))

  return (
    <div className="bg-gradient-to-b from-white to-[#fcfcfd] rounded-2xl border border-white ring-1 ring-black/[0.02] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-800 text-[15px]">Top Selling Courses</h3>
        <Link 
          to={'/courses/all'}
          className="inline-block text-[#22c55e] hover:text-[#16a34a] text-xs font-bold transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        {courses.length === 0 && (
          <p className="text-sm text-slate-400 py-4 text-center">No course sales yet.</p>
        )}
        {courses.map((course, i) => {
          const Icon = Icons[course?.icon] || Icons.BookOpen
          return (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col gap-2 group"
            >
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-white ring-1 ring-black/[0.02] group-hover:scale-105 transition-transform`}>
                    <Icon size={18} className="text-slate-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-[13px]">{String(course?.name || 'Course')}</h4>
                    <p className="text-[11px] font-bold text-slate-400">{String(course?.category || 'Category')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-800 text-[14px]">{String(course?.sales || 0)}</span>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Sales</p>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden ml-[52px] w-[calc(100%-52px)]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${course?.progress || 0}%` }}
                  transition={{ duration: 1, delay: i * 0.2 }}
                  className={`h-full rounded-full ${course?.color || 'bg-blue-500'}`}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
