import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import MainLayout from '../layouts/MainLayout'

// Import split route arrays
import authRoutes from './authRoutes'
import careerFitRoutes from './careerFitRoutes'
import cmsContentRoutes from './cmsContentRoutes'
import coursesRoutes from './coursesRoutes'
import eventsWebinarsRoutes from './eventsWebinarsRoutes'
import instructorsRoutes from './instructorsRoutes'
import jobsCareersRoutes from './jobsCareersRoutes'
import liveClassesRoutes from './liveClassesRoutes'
import locationsRoutes from './locationsRoutes'
import marketingRoutes from './marketingRoutes'
import miscRoutes, { PlaceholderPage } from './miscRoutes'
import notesRoutes from './notesRoutes'
import partnersClientsRoutes from './partnersClientsRoutes'
import quizRoutes from './quizRoutes'
import settingsRoutes from './settingsRoutes'
import testSeriesRoutes from './testSeriesRoutes'
import usersTeamsRoutes from './usersTeamsRoutes'

export default function AppRoutes() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-[#f5f7fa] dark:bg-[#0b0914] text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium tracking-wide">Loading...</span>
        </div>
      </div>
    }>
      <Routes>
        {/* Public Routes */}
        {authRoutes.public}
        {marketingRoutes.public}

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Spread protected routes */}
          {miscRoutes}
          {coursesRoutes}
          {liveClassesRoutes}
          {testSeriesRoutes}
          {notesRoutes}
          {eventsWebinarsRoutes}
          {jobsCareersRoutes}
          {usersTeamsRoutes}
          {marketingRoutes.protected}
          {instructorsRoutes}
          {partnersClientsRoutes}
          {careerFitRoutes}
          {cmsContentRoutes}
          {locationsRoutes}
          {settingsRoutes}
          {quizRoutes}
          {authRoutes.protected}

          {/* Catch-all Not Found Route */}
          <Route path="*" element={<PlaceholderPage title="404 — Not Found" subtitle="The page you're looking for doesn't exist." icon="🔍" />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
