import React from 'react'
import { Route } from 'react-router-dom'
import Dashboard from '../pages/dashboard/Dashboard'
import Registrations from '../pages/misc/Registrations'
import Analytics from '../pages/dashboard/Analytics'
import AnalyticsList from '../pages/dashboard/AnalyticsList'
import AnalyticsDetails from '../pages/dashboard/AnalyticsDetails'
import PlaceholderPage from '../pages/misc/PlaceholderPage'
import QuizResults from '../pages/quiz/QuizResults'
import CertificateRequests from '../pages/misc/CertificateRequests'
import SubjectRatings from '../pages/misc/SubjectRatings'
import AddSubjectRating from '../pages/misc/AddSubjectRating'
import SendNotification from '../pages/misc/SendNotification'
import ContactQueriesList from '../pages/misc/ContactQueriesList'
import PhoneImages from '../pages/marketing/PhoneImages'

const miscRoutes = [
  <Route key="dashboard" path="/" element={<Dashboard />} />,
  <Route key="registrations" path="/registrations" element={<Registrations />} />,
  <Route key="registrations-course" path="/registrations/course" element={<Registrations />} />,
  <Route key="registrations-certificate" path="/registrations/certificate" element={<CertificateRequests />} />,
  <Route key="leaderboard" path="/leaderboard" element={<QuizResults />} />,
  <Route key="wishlist" path="/wishlist" element={<PlaceholderPage title="User Wishlist" subtitle="Courses saved by students" icon="❤️" />} />,
  <Route key="subject-ratings-add" path="/subject-ratings/add" element={<AddSubjectRating />} />,
  <Route key="send-notification" path="/general-setting/send-notification" element={<SendNotification />} />,
  <Route key="contact-query" path="/forms/contact-query" element={<ContactQueriesList />} />,
  <Route key="analytics" path="/analytics" element={<AnalyticsList />} />,
  <Route key="analytics-details" path="/analytics/details/:id" element={<AnalyticsDetails />} />,
  <Route key="phone-images" path="/marketing/phone-images" element={<PhoneImages />} />
]

export default miscRoutes
export { PlaceholderPage }
