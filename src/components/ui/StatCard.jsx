import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { Link } from 'react-router-dom'

const MotionLink = motion.create(Link)

function AnimatedCounter({ value, duration = 1500 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const numericValue = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, ''), 10) : value
    if (isNaN(numericValue) || numericValue === 0) {
      setCount(0)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const startTime = performance.now()
          const animate = (currentTime) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * numericValue))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, duration])

  const prefix = typeof value === 'string' && value.startsWith('$') ? '$' : ''
  const suffix = typeof value === 'string' ? value.replace(/[0-9$,]/g, '').trim() : ''
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

export default function StatCard({ card, index }) {
  const LucideIcon = Icons[card?.icon] || Icons.Activity
  
  const getCardPath = (key) => {
    if (['totalRegistration', 'totalNotesSale', 'totalPackageSale', 'totalCourseSale', 'totalEarnings'].includes(key)) return '/registrations';
    if (key === 'totalCourses') return '/courses/all';
    if (key === 'totalQuizs') return '/quiz/list/all';
    return null;
  };
  const cardPathTo = getCardPath(card?.key);
  

  return (
    <MotionLink
      to={cardPathTo || '#'}
      onClick={(e) => { if (!cardPathTo) e.preventDefault() }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.4, delay: index * 0.08, type: 'spring', stiffness: 300 }}
      className="block cursor-pointer bg-gradient-to-b from-white to-[#fcfcfd] rounded-2xl p-4 border-t-4 border-t-[#22c55e] border-x border-b border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.12)] transition-all duration-300 relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-3 relative z-10">
        <div className="flex flex-col">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center mb-2 shadow-inner">
            <LucideIcon size={18} className="text-[#144f36]" strokeWidth={2.5} />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{String(card?.title || 'Stat')}</span>
        </div>
        <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
          {card?.value == null ? '—' : <AnimatedCounter value={card.value} />}
        </h3>
      </div>

    </MotionLink>
  )
}
