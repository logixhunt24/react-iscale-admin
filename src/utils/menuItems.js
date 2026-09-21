// Sidebar menu structure for iScale Admin
export const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    path: '/',
  },
  {
    id: 'analytics',
    label: 'Data Analytics',
    icon: 'LineChart',
    path: '/analytics',
  },
  {
    id: 'leads',
    label: 'Lead Generate',
    icon: 'TrendingUp',
    path: '/leads',
  },
  {
    id: 'courses',
    label: 'Courses',
    icon: 'BookOpen',
    path: '/courses',
    children: [
      { id: 'courses-categories', label: 'Categories', path: '/courses/categories' },
      { id: 'courses-all', label: 'All Courses', path: '/courses/all' },
      { id: 'courses-popular', label: 'Popular Courses', path: '/courses/popular' },
      { id: 'courses-recommended', label: 'Recommended Courses', path: '/courses/recommended' },
    ],
  },
  {
    id: 'registrations',
    label: 'Registrations',
    icon: 'UserCheck',
    path: '/registrations',
    children: [
      { id: 'reg-course', label: 'Course Registrations', path: '/registrations/course' },
      { id: 'reg-cert', label: 'Certificate Request', path: '/registrations/certificate' },
//       { id: 'reg-test', label: 'Test Series Registration', path: '/registrations/test-series' },
//       { id: 'reg-notes', label: 'Notes Registration', path: '/registrations/notes' },
//       { id: 'reg-webinar', label: 'Webinar Registrations', path: '/registrations/webinar' },
      { id: 'reg-job', label: 'Job Registration', path: '/registrations/job' },
      { id: 'reg-event', label: 'Event Registration', path: '/registrations/event' },
    ],
  },
  {
    id: 'app-users',
    label: 'App Users',
    icon: 'Smartphone',
    path: '/app-users',
  },
  {
    id: 'lms',
    label: 'LMS',
    icon: 'GraduationCap',
    path: '/lms',
  },
  {
    id: 'live',
    label: 'Live Classes',
    icon: 'Video',
    path: '/live-classes',
  },
  {
    id: 'batch',
    label: 'Batch Management',
    icon: 'Layers',
    path: '/batch',
  },
  {
    id: 'test-series',
    label: 'Test Series',
    icon: 'ClipboardList',
    path: '/test-series',
    children: [
      { id: 'ts-category', label: 'Test Series Category', path: '/test-series/category' },
      { id: 'ts-packages', label: 'Test Series Packages', path: '/test-series/packages' },
    ],
  },
  {
    id: 'leaderboard',
    label: 'Test Series Leaderboard',
    icon: 'Trophy',
    path: '/leaderboard',
  },
  {
    id: 'wishlist',
    label: 'User Wishlist',
    icon: 'Heart',
    path: '/wishlist',
    children: [
      { id: 'wl-course', label: 'Course Wishlist', path: '/wishlist/course' },
      { id: 'wl-test', label: 'Test Series Wishlist', path: '/wishlist/test-series' },
      { id: 'wl-notes', label: 'Notes Wishlist', path: '/wishlist/notes' },
//       { id: 'wl-webinar', label: 'Webinar Wishlist', path: '/wishlist/webinar' },
    ],
  },
//   {
//     id: 'webinar',
//     label: 'Webinar',
//     icon: 'Mic2',
//     path: '/webinar',
//   },
//   {
//     id: 'notes',
//     label: 'Notes',
//     icon: 'StickyNote',
//     path: '/notes',
//     children: [
//       { id: 'notes-category', label: 'Notes Category', path: '/notes/category' },
//       { id: 'notes-sub-category', label: 'Notes Sub Category', path: '/notes/sub-category' },
//       { id: 'notes-all', label: 'All Notes', path: '/notes/all' },
//     ],
//   },
//   {
//     id: 'classes',
//     label: 'Classes',
//     icon: 'GraduationCap',
//     path: '/classes',
//   },
  {
    id: 'offers',
    label: 'Offers',
    icon: 'Tag',
    path: '/offers',
  },
  {
    id: 'banners',
    label: 'Banners',
    icon: 'Image',
    path: '/banners',
  },
  {
    id: 'phone-images',
    label: 'Phone Images',
    icon: 'Smartphone',
    path: '/marketing/phone-images',
  },
  {
    id: 'events',
    label: 'Events',
    icon: 'Calendar',
    path: '/events',
    children: [
      { id: 'event-category', label: 'Event Category', path: '/events/category' },
      { id: 'events-list', label: 'Events', path: '/events/list' }
    ]
  },
  {
    id: 'instructors',
    label: 'Instructors',
    icon: 'Users2',
    path: '/instructors',
    children: [
      { id: 'instructor-add', label: 'Add Instructor', path: '/instructors/add' },
      { id: 'instructor-all', label: 'All Instructors', path: '/instructors/all' },
    ],
  },
  {
    id: 'teams',
    label: 'Teams',
    icon: 'Users',
    path: '/teams',
    children: [
      { id: 'team-add', label: 'Add Team', path: '/teams/add' },
      { id: 'team-all', label: 'All Teams', path: '/teams/all' },
    ],
  },
//   {
//     id: 'partners',
//     label: 'Partners',
//     icon: 'Handshake',
//     path: '/partners',
//     children: [
//       { id: 'partner-add', label: 'Add Partners', path: '/partners/add' },
//       { id: 'partner-all', label: 'All Partners', path: '/partners/all' },
//     ],
//   },
//   {
//     id: 'ratings',
//     label: 'Ratings',
//     icon: 'Star',
//     path: '/ratings',
//     children: [
//       { id: 'ratings-course', label: 'All Testimonials/Course Ratings', path: '/ratings/course' },
//       { id: 'ratings-subject', label: 'Subject Ratings', path: '/ratings/subject' },
//       { id: 'ratings-home', label: 'All Home Page Reviews', path: '/ratings/home-page' },
//     ],
//   },
  {
    id: 'news',
    label: 'News & Updates',
    icon: 'Newspaper',
    path: '/news-updates',
  },
  {
    id: 'more',
    label: 'More',
    icon: 'Menu',
    path: '/more',
    children: [
      { id: 'job-updates', label: 'Job Updates', path: '/job-updates' },
      { id: 'success-story', label: 'Success Story', path: '/success-story' },
      { id: 'placement-talks', label: 'Placement Talks', path: '/placement-talks' },
      { id: 'news-updates', label: 'News & Updates', path: '/news-updates' },
      { id: 'our-allied', label: 'Our Allied', path: '/our-allied' },
      { id: 'our-clients', label: 'Our Clients', path: '/our-clients' },
      { id: 'career-fit', label: 'Career Fit', path: '/career-fit' },
      { id: 'hiring-destinations', label: 'Hiring Destinations', path: '/career-fit/hiring-destinations' }
    ]
  },
  {
    id: 'forms',
    label: 'Form & Queries',
    icon: 'FileText',
    path: '/forms',
    children: [
      { id: 'contact-query', label: 'Contact Query', path: '/forms/contact-query' },
      { id: 'hire-with-us', label: 'Hire With Us Form', path: '/forms/hire-with-us' }
    ]
  },
  {
    id: 'master',
    label: 'Master',
    icon: 'Database',
    path: '/master',
    children: [
      { id: 'coupons', label: 'Coupons', path: '/master/coupons' },
      { id: 'module-sub-module', label: 'Module/Sub-Module', path: '/master/module-sub-module' },
      { id: 'brand-video', label: 'Brand Video', path: '/master/brand-video' },
      { id: 'student-news', label: 'Student News', path: '/master/student-news' },
      { id: 'student-testimonial', label: 'Student Testimonial', path: '/master/student-testimonial' }
    ]
  },
  {
    id: 'settings-header',
    label: 'SETTINGS',
    isHeader: true
  },
  {
    id: 'user-role',
    label: 'User Role',
    icon: 'Users',
    path: '/user-role'
  },
  {
    id: 'general-setting',
    label: 'General Setting',
    icon: 'Settings',
    path: '/general-setting',
    children: [
      { id: 'my-profile', label: 'My Profile', path: '/general-setting/my-profile' },
      { id: 'application', label: 'Application', path: '/general-setting/application' },
      { id: 'send-notification', label: 'Send Notification', path: '/general-setting/send-notification' },
      { id: 'page-setting', label: 'Page Setting', path: '/general-setting/page-setting' }
    ]
  },
  {
    id: 'location-setting',
    label: 'Location Setting',
    icon: 'Globe',
    path: '/location-setting',
    children: [
      { id: 'country', label: 'Country', path: '/location-setting/country' },
      { id: 'state', label: 'State', path: '/location-setting/state' },
      { id: 'city', label: 'City', path: '/location-setting/city' }
    ]
  },
  {
    id: 'logout',
    label: 'Logout',
    icon: 'LogOut',
    path: '/logout'
  }
]
