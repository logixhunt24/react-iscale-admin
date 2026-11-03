import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StatCard from '../../components/ui/StatCard'
import RegistrationChart from '../../components/charts/RegistrationChart'
import TopCourses from '../../components/ui/TopCourses'

import HeroBanner from '../../components/ui/HeroBanner'
import ActivityFeed from '../../components/ui/ActivityFeed'
import QuickActions from '../../components/ui/QuickActions'
import { topStats } from '../../utils/mockData'
import { DashboardSkeleton } from '../../components/ui/Skeleton'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [apiData, setApiData] = useState({ cards: null, topCourses: null, activities: null })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const headers = { Authorization: `Bearer ${token}` }
        
        const [cardsRes, coursesRes, activitiesRes] = await Promise.allSettled([
          axios.get(`${BASE_URL}/myadmin/dashboard/cards`, { headers }),
          axios.get(`${BASE_URL}/myadmin/dashboard/top-courses`, { headers }),
          axios.get(`${BASE_URL}/myadmin/dashboard/recent_activities`, { headers })
        ])

        setApiData({
          cards: cardsRes.status === 'fulfilled' ? (cardsRes.value?.data?.data || cardsRes.value?.data?.cards || cardsRes.value?.data || null) : null,
          topCourses: coursesRes.status === 'fulfilled' ? (coursesRes.value?.data?.data || coursesRes.value?.data || null) : null,
          activities: activitiesRes.status === 'fulfilled' ? (activitiesRes.value?.data?.data || activitiesRes.value?.data?.activities || activitiesRes.value?.data?.recent_activities || activitiesRes.value?.data || null) : null
        })
      } catch (error) {
        console.error("Error fetching dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const getDisplayCards = () => {
    let displayCards = topStats;
    if (apiData.cards) {
      if (Array.isArray(apiData.cards) && apiData.cards.length > 0) {
        displayCards = apiData.cards.map((c, i) => {
          const val = c.value ?? c.count ?? c.total ?? c.amount ?? c[Object.keys(c).find(k => typeof c[k] === 'number')] ?? 0;
          return { ...topStats[i], ...c, title: topStats[i]?.title || c?.title, value: val };
        });
      } else if (typeof apiData.cards === 'object') {
        const cardSource = apiData.cards.data || apiData.cards.cards || apiData.cards;
        displayCards = topStats.map(stat => {
          let apiValue = cardSource[stat.key];
          if (stat.key === 'totalRegistration') apiValue = cardSource.totalRegistrations ?? cardSource.registrations ?? apiValue;
          if (stat.key === 'totalQuizs') apiValue = cardSource.totalQuizzes ?? cardSource.quizzes ?? apiValue;
          if (stat.key === 'totalNotesSale') apiValue = cardSource.totalNoteSale ?? cardSource.notesSale ?? apiValue;
          
          return {
            ...stat,
            value: apiValue ?? null
          };
        });
      }
    }
    return displayCards;
  };

  const displayCards = getDisplayCards();
  const bannerCards = displayCards.slice(4, 7);
  const mainCards = displayCards.slice(0, 4);

  return (
    <div className="relative min-h-screen bg-[#f5f7fa] dark:bg-[#0b0914] px-4 md:px-6 pt-0 pb-6 overflow-hidden">
      <div className="relative z-10 max-w-[1600px] mx-auto">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <DashboardSkeleton />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              
              <HeroBanner cardsData={bannerCards} />
              
              <QuickActions />

              {/* Top Stats Grid - 4 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {mainCards.map((card, i) => (
                  <StatCard key={card?.id || i} card={card} index={i} />
                ))}
              </div>

              {/* Charts and Activity Feed Row */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                {/* Chart Area */}
                <div className="xl:col-span-2 h-[400px]">
                  <RegistrationChart />
                </div>
                
                {/* Activity Feed */}
                <div className="xl:col-span-1 h-[400px]">
                  <ActivityFeed apiData={apiData.activities} />
                </div>
              </div>

              {/* Bottom Widgets Row */}
              <div className="mb-8 h-full">
                <TopCourses apiData={apiData.topCourses} />
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
