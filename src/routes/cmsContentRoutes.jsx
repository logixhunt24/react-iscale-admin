import React from 'react'
import { Route } from 'react-router-dom'
import withListRow from '../components/common/withListRow'
import HomePageReviews from '../pages/cms-content/HomePageReviews'
import SuccessStoryList from '../pages/cms-content/SuccessStoryList'
import AddSuccessStory from '../pages/cms-content/AddSuccessStory'
import EditSuccessStoryPage from '../pages/cms-content/EditSuccessStory'
const EditSuccessStory = withListRow(EditSuccessStoryPage, { endpoint: '/myadmin/success-story/all-ss', stateKey: 'story', params: { page: 1, limit: 10000 } })
import PPTList from '../pages/cms-content/PPTList'
import AddPPT from '../pages/cms-content/AddPPT'
import EditPPT from '../pages/cms-content/EditPPT'
import NewsList from '../pages/cms-content/NewsList'
import AddNews from '../pages/cms-content/AddNews'
import EditNews from '../pages/cms-content/EditNews'
import BrandVideoList from '../pages/cms-content/BrandVideoList'
import AddBrandVideo from '../pages/cms-content/AddBrandVideo'
import EditBrandVideoPage from '../pages/cms-content/EditBrandVideo'
const EditBrandVideo = withListRow(EditBrandVideoPage, { endpoint: '/myadmin/brand-video/all', stateKey: 'videoData' })
import StudentNewsList from '../pages/cms-content/StudentNewsList'
import StudentTestimonialList from '../pages/cms-content/StudentTestimonialList'
import AddStudentTestimonial from '../pages/cms-content/AddStudentTestimonial'
import EditStudentTestimonial from '../pages/cms-content/EditStudentTestimonial'
import AddUserReview from '../pages/cms-content/AddUserReview'

const cmsContentRoutes = [
  <Route key="ratings-home-page" path="/ratings/home-page" element={<HomePageReviews />} />,
  <Route key="home-page-reviews-add" path="/home-page-reviews/add" element={<AddUserReview />} />,
  <Route key="success-story" path="/success-story" element={<SuccessStoryList />} />,
  <Route key="success-story-add" path="/success-story/add" element={<AddSuccessStory />} />,
  <Route key="success-story-edit" path="/success-story/edit/:id" element={<EditSuccessStory />} />,
  <Route key="placement-talks" path="/placement-talks" element={<PPTList />} />,
  <Route key="placement-talks-add" path="/placement-talks/add" element={<AddPPT />} />,
  <Route key="placement-talks-edit" path="/placement-talks/edit/:id" element={<EditPPT />} />,
  <Route key="news-updates" path="/news-updates" element={<NewsList />} />,
  <Route key="news-updates-add" path="/news-updates/add" element={<AddNews />} />,
  <Route key="news-updates-edit" path="/news-updates/edit/:id" element={<EditNews />} />,
  <Route key="brand-video" path="/master/brand-video" element={<BrandVideoList />} />,
  <Route key="brand-video-add" path="/master/brand-video/add" element={<AddBrandVideo />} />,
  <Route key="brand-video-edit" path="/master/brand-video/edit/:id" element={<EditBrandVideo />} />,
  <Route key="student-news" path="/master/student-news" element={<StudentNewsList />} />,
  <Route key="student-testimonial" path="/master/student-testimonial" element={<StudentTestimonialList />} />,
  <Route key="student-testimonial-add" path="/master/student-testimonial/add" element={<AddStudentTestimonial />} />,
  <Route key="student-testimonial-edit" path="/master/student-testimonial/edit/:id" element={<EditStudentTestimonial />} />
]

export default cmsContentRoutes
