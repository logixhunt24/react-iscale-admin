import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { Link } from 'react-router-dom'

const MotionLink = motion.create(Link)

export default function QuickActions() {

  const actions = [
    { label: 'Create Course', icon: 'PlusCircle', color: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-500 hover:text-white hover:border-emerald-500', path: '/courses/all/add' },
    { label: 'Create Quiz', icon: 'HelpCircle', color: 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-500 hover:text-white hover:border-blue-500', path: '/quiz/list/all' },
    { label: 'Create Event', icon: 'Video', color: 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-500 hover:text-white hover:border-purple-500', path: '/events/list/add' },
    { label: 'Create Live Class', icon: 'Monitor', color: 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-500 hover:text-white hover:border-orange-500', path: '/live-classes/add' }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {actions.map((action, index) => {
        const Icon = Icons[action.icon]
        return (
          <MotionLink
            key={action.label}
            to={action.path}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`flex items-center justify-center gap-2 p-4 rounded-xl border ${action.color} transition-all duration-75 ease-out font-bold text-[13px] shadow-sm hover:-translate-y-[2px] hover:scale-[1.02] active:scale-[0.98]`}
          >
            <Icon size={18} strokeWidth={2.5} />
            {action.label}
          </MotionLink>
        )
      })}
    </div>
  )
}
