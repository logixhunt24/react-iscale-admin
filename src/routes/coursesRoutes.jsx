import React from 'react'
import { Route } from 'react-router-dom'
import CourseWishlist from '../pages/courses/CourseWishlist'
import CourseCategories from '../pages/courses/CourseCategories'
import AllCourses from '../pages/courses/AllCourses'
import PopularCourses from '../pages/courses/PopularCourses'
import RecommendedCourses from '../pages/courses/RecommendedCourses'
import CourseView from '../pages/courses/CourseView'
import CourseFaq from '../pages/courses/CourseFaq'
import CourseFeatures from '../pages/courses/CourseFeatures'
import CourseTools from '../pages/courses/CourseTools'
import CourseSubjects from '../pages/courses/CourseSubjects'
import AddCourseSubject from '../pages/courses/AddCourseSubject'
import CourseTopics from '../pages/courses/CourseTopics'
import AddCourseTopic from '../pages/courses/AddCourseTopic'
import CourseTestSeries from '../pages/courses/CourseTestSeries'
import AddCourseTestSeries from '../pages/courses/AddCourseTestSeries'
import CourseTrainingHighlights from '../pages/courses/CourseTrainingHighlights'
import CourseRatings from '../pages/courses/CourseRatings'
import AddCourseRating from '../pages/courses/AddCourseRating'
import AddCourseCategory from '../pages/courses/AddCourseCategory'
import EditCourseCategory from '../pages/courses/EditCourseCategory'
import AddCourse from '../pages/courses/AddCourse'
import EditCourse from '../pages/courses/EditCourse'

const coursesRoutes = [
  <Route key="wishlist-course" path="/wishlist/course" element={<CourseWishlist />} />,
  <Route key="courses" path="/courses" element={<AllCourses />} />,
  <Route key="courses-categories" path="/courses/categories" element={<CourseCategories />} />,
  <Route key="courses-categories-add" path="/courses/categories/add" element={<AddCourseCategory />} />,
  <Route key="courses-categories-edit" path="/courses/categories/edit/:id" element={<EditCourseCategory />} />,
  <Route key="courses-all" path="/courses/all" element={<AllCourses />} />,
  <Route key="courses-all-add" path="/courses/all/add" element={<AddCourse />} />,
  <Route key="courses-all-edit" path="/courses/all/edit/:id" element={<EditCourse />} />,
  <Route key="courses-view" path="/courses/view/:id" element={<CourseView />} />,
  <Route key="courses-popular" path="/courses/popular" element={<PopularCourses />} />,
  <Route key="courses-recommended" path="/courses/recommended" element={<RecommendedCourses />} />,
  <Route key="courses-faq" path="/courses/faq/:id" element={<CourseFaq />} />,
  <Route key="courses-features" path="/courses/features/:id" element={<CourseFeatures />} />,
  <Route key="courses-tools" path="/courses/tools/:id" element={<CourseTools />} />,
  <Route key="courses-subjects" path="/courses/subjects/:id" element={<CourseSubjects />} />,
  <Route key="courses-subjects-add" path="/courses/subjects/add/:id" element={<AddCourseSubject />} />,
  <Route key="courses-topics" path="/courses/topics/:subjectId" element={<CourseTopics />} />,
  <Route key="courses-topics-add" path="/courses/topics/add/:subjectId" element={<AddCourseTopic />} />,
  <Route key="courses-test-series" path="/courses/test-series/:id" element={<CourseTestSeries />} />,
  <Route key="courses-test-series-add" path="/courses/test-series/add/:id" element={<AddCourseTestSeries />} />,
  <Route key="courses-training-highlights" path="/courses/training-highlights/:id" element={<CourseTrainingHighlights />} />,
  <Route key="courses-ratings" path="/courses/ratings" element={<CourseRatings />} />,
  <Route key="courses-ratings-add" path="/courses/ratings/add" element={<AddCourseRating />} />,
  <Route key="courses-ratings-edit" path="/courses/ratings/edit/:id" element={<AddCourseRating />} />
]

export default coursesRoutes
