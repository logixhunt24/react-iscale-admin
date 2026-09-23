import React from 'react'
import { Route } from 'react-router-dom'
import withListRow from '../components/common/withListRow'
import WebinarRegistrations from '../pages/events-webinars/WebinarRegistrations'
import EventRegistrations from '../pages/events-webinars/EventRegistrations'
import WebinarWishlist from '../pages/events-webinars/WebinarWishlist'
import EventCategoryList from '../pages/events-webinars/EventCategoryList'
import AddEventCategory from '../pages/events-webinars/AddEventCategory'
import EditEventCategoryPage from '../pages/events-webinars/EditEventCategory'
const EditEventCategory = withListRow(EditEventCategoryPage, { endpoint: '/myadmin/event-category/get-event-categories', stateKey: 'categoryData' })
import EventList from '../pages/events-webinars/EventList'
import AddEvent from '../pages/events-webinars/AddEvent'
import EditEventPage from '../pages/events-webinars/EditEvent'
const EditEvent = withListRow(EditEventPage, { endpoint: '/myadmin/event/get-events', stateKey: 'eventData' })

const eventsWebinarsRoutes = [
  <Route key="registrations-event" path="/registrations/event" element={<EventRegistrations />} />,
  <Route key="wishlist-webinar" path="/wishlist/webinar" element={<WebinarWishlist />} />,
  <Route key="events-category" path="/events/category" element={<EventCategoryList />} />,
  <Route key="events-category-add" path="/events/category/add" element={<AddEventCategory />} />,
  <Route key="events-category-edit" path="/events/category/edit/:id" element={<EditEventCategory />} />,
  <Route key="events-list" path="/events/list" element={<EventList />} />,
  <Route key="events-list-add" path="/events/list/add" element={<AddEvent />} />,
  <Route key="events-list-edit" path="/events/list/edit/:id" element={<EditEvent />} />
]

export default eventsWebinarsRoutes
