import React from 'react'
import { Route } from 'react-router-dom'
import CareerFitList from '../pages/career-fit/CareerFitList'
import AddCareerFit from '../pages/career-fit/AddCareerFit'
import HiringDestinationsList from '../pages/career-fit/HiringDestinationsList'
import AddHiringDestination from '../pages/career-fit/AddHiringDestination'

const careerFitRoutes = [
  <Route key="career-fit" path="/career-fit" element={<CareerFitList />} />,
  <Route key="career-fit-add" path="/career-fit/add" element={<AddCareerFit />} />,
  <Route key="career-fit-edit" path="/career-fit/edit/:id" element={<AddCareerFit />} />,
  <Route key="hiring-destinations" path="/career-fit/hiring-destinations" element={<HiringDestinationsList />} />,
  <Route key="hiring-destinations-add" path="/career-fit/hiring-destinations/add" element={<AddHiringDestination />} />,
  <Route key="hiring-destinations-edit" path="/career-fit/hiring-destinations/edit/:id" element={<AddHiringDestination />} />
]

export default careerFitRoutes
