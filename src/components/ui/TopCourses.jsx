import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'

export default function TopCourses({ apiData }) {
  const navigate = useNavigate()

  const defaultCourses = [
    { name: 'React Masterclass', category: 'Development', sales: 1524, progress: 85, color: 'bg-blue-500', icon: 'Code' },
    { name: 'AI Course', category: 'Technology', sales: 1254, progress: 70, color: 'bg-emerald-500', icon: 'Cpu' },
    { name: 'Python Bootcamp', category: 'Development', sales: 1054, progress: 65, color: 'bg-amber-500', icon: 'Terminal' },
    { name: 'UI/UX Design Principles', category: 'Design', sales: 925, progress: 50, color: 'bg-purple-500', icon: 'PenTool' }
  ]

  const courses = apiData && Array.isArray(apiData) && apiData.length > 0 
    ? apiData.map((c, i) => ({
        name: c.courseName || c.name || c.course_name || c.title || defaultCourses[i]?.name || 'Unknown',
        category: c.courseCategory || c.category || c.course_category || defaultCourses[i]?.category || 'Category',
        sales: c.totalSales || c.sales || c.total_sales || c.count || c.value || defaultCourses[i]?.sales || 0,
        progress: c.progress || c.completion || defaultCourses[i]?.progress || 0,
        color: c.color || defaultCourses[i]?.color || 'bg-blue-500',
        icon: c.icon || defaultCourses[i]?.icon || 'BookOpen'
      }))
    : defaultCourses;

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
