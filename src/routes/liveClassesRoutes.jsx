import React from 'react'
import { Route } from 'react-router-dom'
import BatchManagement from '../pages/live-classes/BatchManagement'
import BatchStudents from '../pages/live-classes/BatchStudents'
import LiveClasses from '../pages/live-classes/LiveClasses'
import ClassesList from '../pages/live-classes/ClassesList'
import AddLiveClass from '../pages/live-classes/AddLiveClass'
import EditLiveClass from '../pages/live-classes/EditLiveClass'
import AddClass from '../pages/live-classes/AddClass'

const liveClassesRoutes = [
  <Route key="batch" path="/batch" element={<BatchManagement />} />,
  <Route key="batch-list" path="/batch/list" element={<BatchManagement />} />,
  <Route key="batch-create" path="/batch/create" element={<BatchManagement />} />,
  <Route key="batch-students" path="/batch/students/:id" element={<BatchStudents />} />,
  <Route key="live-classes"path="/live-classes" element={<LiveClasses />} />,
  <Route key="live-classes-add" path="/live-classes/add" element={<AddLiveClass />} />,
  <Route key="live-classes-edit" path="/live-classes/edit/:id" element={<EditLiveClass />} />
]

export default liveClassesRoutes
