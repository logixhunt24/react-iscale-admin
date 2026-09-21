import React from 'react'
import { Route } from 'react-router-dom'
import CareerFitList from '../pages/career-fit/CareerFitList'
import AddCareerFit from '../pages/career-fit/AddCareerFit'

const careerFitRoutes = [
  <Route key="career-fit" path="/career-fit" element={<CareerFitList />} />,
  <Route key="career-fit-add" path="/career-fit/add" element={<AddCareerFit />} />,
  <Route key="career-fit-edit" path="/career-fit/edit/:id" element={<AddCareerFit />} />
]

export default careerFitRoutes
