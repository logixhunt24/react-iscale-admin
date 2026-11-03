// Mock analytics data for the iScale Admin Dashboard

export const topStats = [
  {
    id: 1,
    key: 'totalRegistration',
    title: 'Total Registration',
    icon: 'Users',
  },
  {
    id: 2,
    key: 'totalCourses',
    title: 'Total Courses',
    icon: 'BookOpen',
  },
  {
    id: 3,
    key: 'totalQuizs',
    title: 'Total Quizs',
    icon: 'Puzzle',
  },
  {
    id: 4,
    key: 'totalEarnings',
    title: 'Total Earnings',
    icon: 'Banknote',
  },
  {
    id: 5,
    key: 'totalCourseSale',
    title: 'Total Course Sale',
    icon: 'LineChart',
  },
  {
    id: 6,
    key: 'totalPackageSale',
    title: 'Total Package Sale',
    icon: 'Package',
  },
  {
    id: 7,
    key: 'totalNotesSale',
    title: 'Total Notes Sale',
    icon: 'FileText',
  },
]

export const sideStats = [
  {
    id: 5,
    title: 'Total Course Sale',
    value: '25674942',
    icon: 'LineChart',
    bg: 'bg-[#10b981]', // green
  },
  {
    id: 6,
    title: 'Total Package Sale',
    value: '1513',
    icon: 'LibraryBig', // closest to books stack
    bg: 'bg-[#1e3a8a]', // dark blue
  },
  {
    id: 7,
    title: 'Total Notes Sale',
    value: '608',
    icon: 'FileEdit', // closest to notes icon
    bg: 'bg-[#2563eb]', // blue
  },
]

export const monthlyRegistrations = [
  { month: 'January - 2026', registrations: 1120, color: '#fbcfe8' }, // pink
  { month: 'February - 2026', registrations: 580, color: '#bfdbfe' }, // light blue
  { month: 'March - 2026', registrations: 650, color: '#fef08a' }, // yellow
  { month: 'April - 2026', registrations: 780, color: '#99f6e4' }, // teal
  { month: 'May - 2026', registrations: 510, color: '#e9d5ff' }, // purple
]

export const topCourses = [
  { sno: 2, name: 'Free Data Analytics Course ()', category: 'Free Category', registrations: 32840 },
  { sno: 6, name: 'Free Data Science Course ()', category: 'Free Category', registrations: 19453, highlight: true },
  { sno: 1, name: 'Free Electric Vehicle Basic Course ()', category: 'Cohort Courses', registrations: 809 },
  { sno: 3, name: 'Master Of Data Analytics Program ()', category: 'Data Analyst Courses', registrations: 482 },
  { sno: 16, name: 'AI Cohort Course ()', category: 'Foundation Courses', registrations: 376 },
  { sno: 8, name: 'Data Science With Generative AI Course ()', category: 'Data Science Courses', registrations: 232 },
  { sno: 9, name: 'Data Science Bootcamp ()', category: 'Foundation Courses', registrations: 75 },
  { sno: 10, name: 'The Complete AI Guide : Zero To Hero ()', category: 'Foundation Courses', registrations: 49 },
  { sno: 7, name: 'Master Of Data Analytics Program (Recorded) ()', category: 'Data Analyst Courses', registrations: 22 },
  { sno: 17, name: 'AI For Everyone : Complete Guide ()', category: 'Cohort Courses', registrations: 17 },
  { sno: 5, name: 'Data Analytics- Beginner To Advance ()', category: 'Data Analyst Courses', registrations: 4 },
  { sno: 11, name: 'Advance Python With AI Tools ()', category: 'Foundation Courses', registrations: 4 },
  { sno: 4, name: 'Advance Programme In Electric Vehicle Technology ()', category: 'Electric Vehicle Courses', registrations: 1 },
  { sno: 15, name: 'Power BI & Tableau For Data Visualization ()', category: 'Foundation Courses', registrations: 1 },
  { sno: 12, name: 'AI Powered Excel Full Course ()', category: 'Foundation Courses', registrations: 0 },
  { sno: 13, name: 'Mastering SQL ()', category: 'Foundation Courses', registrations: 0, highlight: true },
  { sno: 14, name: 'Statistics & EDA ()', category: 'Foundation Courses', registrations: 0 },
  { sno: 18, name: 'Machine Learning With Agentic AI ()', category: 'Foundation Courses', registrations: 0 },
  { sno: 19, name: 'AI Engineer Advance Program ()', category: 'Data Science Courses', registrations: 0 },
]

export const recentRegistrations = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com', course: 'Web Dev', date: '2026-05-20', status: 'active', avatar: 'AS' },
  { id: 2, name: 'Bob Jones', email: 'bob@example.com', course: 'Data Science', date: '2026-05-21', status: 'pending', avatar: 'BJ' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', course: 'Design', date: '2026-05-22', status: 'active', avatar: 'CB' },
]

export const revenueData = [{ month: 'Jan', revenue: 100 }, { month: 'Feb', revenue: 200 }]
export const userGrowthData = [{ name: 'A', users: 10 }]
export const courseDistribution = [{ name: 'C1', value: 100, fill: '#000' }]

const page1Data = [
  { id: 101, quiz: 'Data Science 101', student: 'Amit Kumar', phone: '9876543210', email: 'amit@example.com', totalQ: 20, attemptQ: 20, correct: 18, wrong: 2, marks: 36, duration: '00:15:20', date: '21-05-2026' },
  { id: 102, quiz: 'React Basics', student: 'Priya Singh', phone: '8765432109', email: 'priya@example.com', totalQ: 15, attemptQ: 14, correct: 12, wrong: 2, marks: 24, duration: '00:10:05', date: '21-05-2026' },
  { id: 103, quiz: 'Python Advanced', student: 'Rahul Sharma', phone: '7654321098', email: 'rahul@example.com', totalQ: 25, attemptQ: 20, correct: 15, wrong: 5, marks: 30, duration: '00:20:12', date: '20-05-2026' },
  { id: 104, quiz: 'UI/UX Fundamentals', student: 'Neha Gupta', phone: '6543210987', email: 'neha@example.com', totalQ: 10, attemptQ: 10, correct: 9, wrong: 1, marks: 18, duration: '00:08:45', date: '20-05-2026' },
  { id: 105, quiz: 'Machine Learning', student: 'Vikram Singh', phone: '5432109876', email: 'vikram@example.com', totalQ: 30, attemptQ: 28, correct: 25, wrong: 3, marks: 50, duration: '00:25:30', date: '19-05-2026' },
]

const page2Data = [
  { id: 1, quiz: 'Statistics 4', student: 'Ravinder', phone: '9468457760', email: 'Ravinderkumar0802@Gmail.Com', totalQ: 10, attemptQ: 0, correct: 0, wrong: 0, marks: 0, duration: '00:00:03', date: '19-05-2026' },
  { id: 2, quiz: 'Statistics 8', student: 'Rakesh Kumar', phone: '7903987839', email: 'Rai.Rakesh99@Gmail.Com', totalQ: 10, attemptQ: 10, correct: 6, wrong: 4, marks: 12, duration: '00:05:38', date: '19-05-2026' },
  { id: 3, quiz: 'Statistics 7', student: 'Rakesh Kumar', phone: '7903987839', email: 'Rai.Rakesh99@Gmail.Com', totalQ: 10, attemptQ: 10, correct: 4, wrong: 6, marks: 8, duration: '00:06:13', date: '19-05-2026' },
  { id: 4, quiz: 'SQL Basics', student: 'Abhishek', phone: '7083406056', email: 'Abhishek.Rishikesh@Proton.Me', totalQ: 14, attemptQ: 14, correct: 5, wrong: 9, marks: 5, duration: '00:03:41', date: '19-05-2026' },
  { id: 5, quiz: 'Statistics 6', student: 'Rakesh Kumar', phone: '7903987839', email: 'Rai.Rakesh99@Gmail.Com', totalQ: 10, attemptQ: 10, correct: 5, wrong: 5, marks: 10, duration: '00:06:42', date: '18-05-2026' },
  { id: 6, quiz: 'Statistics 5', student: 'Rakesh Kumar', phone: '7903987839', email: 'Rai.Rakesh99@Gmail.Com', totalQ: 10, attemptQ: 10, correct: 2, wrong: 8, marks: 4, duration: '00:06:43', date: '18-05-2026', highlight: true },
  { id: 7, quiz: 'Statistics 4', student: 'Rakesh Kumar', phone: '7903987839', email: 'Rai.Rakesh99@Gmail.Com', totalQ: 10, attemptQ: 9, correct: 6, wrong: 3, marks: 12, duration: '00:06:34', date: '18-05-2026' },
  { id: 8, quiz: 'Statistics 3', student: 'Rakesh Kumar', phone: '7903987839', email: 'Rai.Rakesh99@Gmail.Com', totalQ: 10, attemptQ: 10, correct: 4, wrong: 6, marks: 8, duration: '00:07:15', date: '18-05-2026' },
]

export const allLeaderBoardData = Array.from({ length: 2926 }, (_, index) => {
  if (index < page1Data.length) return page1Data[index]
  if (index >= 100 && index < 100 + page2Data.length) return page2Data[index - 100]
  
  return {
    id: 1000 + index,
    quiz: `Quiz ${index + 1}`,
    student: `Student ${index + 1}`,
    phone: `999${index.toString().padStart(7, '0')}`,
    email: `student${index + 1}@example.com`,
    totalQ: 20,
    attemptQ: 15,
    correct: 10,
    wrong: 5,
    marks: 20,
    duration: '00:15:00',
    date: '20-05-2026',
  }
})
const courseRegPage1Data = [
  { id: 1, sno: 1, student: 'Vijay', phone: '8092324072', email: 'Vijaymishra1572003@Gmail.Com', course: 'Free Data Science Course', date: '22-05-2026', amount: 0, payable: 0, discount: 0, coupon: '', appDuration: '15 Days (15 Days Left)', webDuration: '15 Days (15 Days Left)', batchName: '' },
  { id: 3, sno: 3, student: 'Aditya Shelke', phone: '8999094818', email: 'Letsmailaditya10@Gmail.Com', course: 'Free Data Science Course', date: '22-05-2026', amount: 0, payable: 0, discount: 0, coupon: '', appDuration: '15 Days (15 Days Left)', webDuration: '15 Days (15 Days Left)', batchName: '' },
  { id: 4, sno: 4, student: 'Satish Ahirwar', phone: '7827395375', email: 'Satishahirwar570@Gmail.Com', course: 'Free Data Science Course', date: '22-05-2026', amount: 0, payable: 0, discount: 0, coupon: '', appDuration: '15 Days (15 Days Left)', webDuration: '15 Days (15 Days Left)', batchName: '' },
  { id: 5, sno: 5, student: 'Rohit Parihar', phone: '8824001801', email: 'Rohitparihar858@Gmail.Com', course: 'Free Data Analytics Course', date: '22-05-2026', amount: 0, payable: 0, discount: 0, coupon: '', appDuration: '15 Days (15 Days Left)', webDuration: '15 Days (15 Days Left)', batchName: '' },
  { id: 6, sno: 6, student: 'SHIVAM', phone: '7505093238', email: 'Ssbmessi29@Gmail.Com', course: 'Free Data Analytics Course', date: '22-05-2026', amount: 0, payable: 0, discount: 0, coupon: '', appDuration: '15 Days (15 Days Left)', webDuration: '15 Days (15 Days Left)', batchName: '' },
  { id: 7, sno: 7, student: 'PANKAJ VISHWAKARMA', phone: '6201263924', email: 'Pankajraja5130@Gmail.Com', course: 'Free Data Analytics Course', date: '22-05-2026', amount: 0, payable: 0, discount: 0, coupon: '', appDuration: '15 Days (15 Days Left)', webDuration: '15 Days (15 Days Left)', batchName: '' },
  { id: 8, sno: 8, student: 'PANKAJ VISHWAKARMA', phone: '6201263924', email: 'Pankajraja5130@Gmail.Com', course: 'Free Data Science Course', date: '22-05-2026', amount: 0, payable: 0, discount: 0, coupon: '', appDuration: '15 Days (15 Days Left)', webDuration: '15 Days (15 Days Left)', batchName: '', highlight: true },
  { id: 9, sno: 9, student: 'Pragya Mishra', phone: '8188800369', email: 'Pragyamishra772003@Gmail.Com', course: 'Free Data Science Course', date: '22-05-2026', amount: 0, payable: 0, discount: 0, coupon: '', appDuration: '15 Days (15 Days Left)', webDuration: '15 Days (15 Days Left)', batchName: '' },
  { id: 10, sno: 10, student: 'Aman', phone: '8709446910', email: 'Mehrak271205@Gmail.Com', course: 'Free Data Analytics Course', date: '22-05-2026', amount: 0, payable: 0, discount: 0, coupon: '', appDuration: '15 Days (15 Days Left)', webDuration: '15 Days (15 Days Left)', batchName: '' },
  { id: 11, sno: 11, student: 'Ashay Pensalwar', phone: '8857851513', email: 'Ashaypensalwar@Gmail.Com', course: 'AI For Everyone : Complete Guide', date: '22-05-2026', amount: 4999, payable: 3499, discount: 1500.0, coupon: 'SWATI30', appDuration: '120 Days (120 Days Left)', webDuration: '120 Days (120 Days Left)', batchName: '' },
  { id: 12, sno: 12, student: 'Bablu Kumar', phone: '7466984495', email: 'Ssfgd2021@Gmail.Com', course: 'Free Data Analytics Course', date: '22-05-2026', amount: 0, payable: 0, discount: 0, coupon: '', appDuration: '15 Days (15 Days Left)', webDuration: '15 Days (15 Days Left)', batchName: '' },
  { id: 13, sno: 13, student: 'Bablu Kumar', phone: '7466984495', email: 'Ssfgd2021@Gmail.Com', course: 'Free Data Science Course', date: '22-05-2026', amount: 0, payable: 0, discount: 0, coupon: '', appDuration: '15 Days (15 Days Left)', webDuration: '15 Days (15 Days Left)', batchName: '' },
  { id: 14, sno: 14, student: 'Pranav', phone: '7558784720', email: 'Hudekarpranav8@Gmail.Com', course: 'Free Data Analytics Course', date: '22-05-2026', amount: 0, payable: 0, discount: 0, coupon: '', appDuration: '15 Days (15 Days Left)', webDuration: '15 Days (15 Days Left)', batchName: '', highlight: true },
]

export const allCourseRegistrationData = Array.from({ length: 65570 }, (_, index) => {
  if (index < courseRegPage1Data.length) return courseRegPage1Data[index]
  
  return {
    id: index + 1000,
    sno: index + 1,
    student: `Student ${index + 1}`,
    phone: `999${index.toString().padStart(7, '0')}`,
    email: `student${index + 1}@example.com`,
    course: index % 2 === 0 ? 'Free Data Science Course' : 'AI For Everyone : Complete Guide',
    date: '22-05-2026',
    amount: index % 2 === 0 ? 0 : 4999,
    payable: index % 2 === 0 ? 0 : 3499,
    discount: index % 2 === 0 ? 0 : 1500,
    coupon: index % 2 === 0 ? '' : 'SWATI30',
    appDuration: index % 2 === 0 ? '15 Days (15 Days Left)' : '120 Days (120 Days Left)',
    webDuration: index % 2 === 0 ? '15 Days (15 Days Left)' : '120 Days (120 Days Left)',
    batchName: '',
  }
})

const certReqPage1Data = [
  { id: 1, sno: 1, student: 'Ashay Pensalwar', course: 'AI For Everyone : Complete Guide', date: '22-05-2026', progress: 28.33, certNumber: '', certPdf: '', status: 'Pending' },
  { id: 2, sno: 2, student: 'Hitesh', course: 'AI Cohort Course', date: '06-05-2026', progress: 1.41, certNumber: '', certPdf: '', status: 'Pending' },
  { id: 3, sno: 3, student: 'Dhiraj', course: 'AI Cohort Course', date: '04-05-2026', progress: 5.63, certNumber: '', certPdf: '', status: 'Pending' },
  { id: 4, sno: 4, student: 'Shakir', course: 'AI Cohort Course', date: '04-05-2026', progress: 19.72, certNumber: '', certPdf: '', status: 'Pending' },
  { id: 5, sno: 5, student: 'Mehebub Alam', course: 'AI Cohort Course', date: '04-05-2026', progress: 0, certNumber: '', certPdf: '', status: 'Pending' },
  { id: 6, sno: 6, student: 'HEMRAJ GUPTA', course: 'AI Cohort Course', date: '04-05-2026', progress: 9.86, certNumber: '', certPdf: '', status: 'Pending' },
  { id: 7, sno: 7, student: 'Amit', course: 'AI Cohort Course', date: '01-05-2026', progress: 35.21, certNumber: '', certPdf: '', status: 'Pending' },
  { id: 8, sno: 8, student: 'ASHISH KUMAR', course: 'AI Cohort Course', date: '29-04-2026', progress: 2.82, certNumber: '', certPdf: '', status: 'Pending' },
  { id: 9, sno: 9, student: 'UTKARSH', course: 'AI Cohort Course', date: '04-05-2026', progress: 0, certNumber: '', certPdf: '', status: 'Pending' },
  { id: 10, sno: 10, student: 'Kritika', course: 'AI Cohort Course', date: '28-04-2026', progress: 0, certNumber: '', certPdf: '', status: 'Pending' },
]

export const allCertificateRequestData = Array.from({ length: 565 }, (_, index) => {
  if (index < certReqPage1Data.length) return certReqPage1Data[index]
  
  return {
    id: index + 1000,
    sno: index + 1,
    student: `Student ${index + 1}`,
    course: 'AI Cohort Course',
    date: '28-04-2026',
    progress: Math.floor(Math.random() * 10000) / 100, // random progress 0-100 with 2 decimals
    certNumber: '',
    certPdf: '',
    status: 'Pending',
  }
})

const testSeriesRegPage1Data = [
  { id: 1, sno: 1, student: 'Vishal Mahajan', package: '', date: '21-03-2025', regFrom: 'App', amount: 0, payable: 0, discount: 0, coupon: '', payMode: 'Online', status: 'Active' },
  { id: 2, sno: 2, student: 'AKHILESH RAI', package: '', date: '01-02-2024', regFrom: 'App', amount: 0, payable: 0, discount: 0, coupon: '', payMode: 'Online', status: 'Active', highlight: true },
  { id: 3, sno: 3, student: 'Sahitya Patel', package: '', date: '31-01-2024', regFrom: 'App', amount: 0, payable: 0, discount: 0, coupon: '', payMode: 'Online', status: 'Active' },
  { id: 4, sno: 4, student: 'Testing', package: '', date: '31-01-2024', regFrom: 'App', amount: 0, payable: 0, discount: 0, coupon: '', payMode: 'Online', status: 'Active' },
  { id: 5, sno: 5, student: 'Sahil Raikwar', package: '', date: '31-01-2024', regFrom: 'App', amount: 0, payable: 0, discount: 0, coupon: '', payMode: 'Online', status: 'Active' },
  { id: 6, sno: 6, student: 'Manoj', package: '', date: '31-01-2024', regFrom: 'App', amount: 0, payable: 0, discount: 0, coupon: '', payMode: 'Online', status: 'Active' },
  { id: 7, sno: 7, student: 'Koyale Priyanka Nanasaheb', package: '', date: '31-01-2024', regFrom: 'App', amount: 0, payable: 0, discount: 0, coupon: '', payMode: 'Online', status: 'Active' },
  { id: 8, sno: 8, student: 'Niranjan Kumar', package: '', date: '31-01-2024', regFrom: 'App', amount: 0, payable: 0, discount: 0, coupon: '', payMode: 'Online', status: 'Active' },
  { id: 9, sno: 9, student: 'Om Shiva Shankar Reddy Enugala', package: '', date: '08-04-2023', regFrom: 'App', amount: 0, payable: 0, discount: 0, coupon: '', payMode: 'Online', status: 'Active' },
  { id: 10, sno: 10, student: 'Mohammed Ismail Shaikh', package: '', date: '06-04-2023', regFrom: 'App', amount: 0, payable: 0, discount: 0, coupon: '', payMode: 'Online', status: 'Active' },
]

export const allTestSeriesRegistrationData = Array.from({ length: 126 }, (_, index) => {
  if (index < testSeriesRegPage1Data.length) return testSeriesRegPage1Data[index]
  
  return {
    id: index + 1000,
    sno: index + 1,
    student: `Student ${index + 1}`,
    package: '',
    date: '06-04-2023',
    regFrom: 'App',
    amount: 0,
    payable: 0,
    discount: 0,
    coupon: '',
    payMode: 'Online',
    status: 'Active',
  }
})

const notesRegPage1Data = [
  { id: 1, sno: 1, student: 'Rishikesh Lahu Anbhule', noteTitle: '', date: '27-03-2023', regFrom: 'App', amount: 0, payable: 0, discount: 0, coupon: '', payMode: 'Online', status: 'Active' },
  { id: 2, sno: 2, student: 'Pawan', noteTitle: '', date: '08-03-2023', regFrom: 'App', amount: 0, payable: 0, discount: 0, coupon: '', payMode: 'Online', status: 'Active' },
  { id: 4, sno: 4, student: 'Atul Khairnar', noteTitle: '', date: '30-01-2023', regFrom: 'App', amount: 0, payable: 0, discount: 0, coupon: '', payMode: 'Online', status: 'Active' },
  { id: 5, sno: 5, student: 'Anuj Singh', noteTitle: '', date: '29-01-2023', regFrom: 'App', amount: 0, payable: 0, discount: 0, coupon: '', payMode: 'Online', status: 'Active' },
  { id: 6, sno: 6, student: 'Mukul Agrawal', noteTitle: '', date: '19-01-2023', regFrom: 'App', amount: 0, payable: 0, discount: 0, coupon: '', payMode: 'Online', status: 'Active' },
  { id: 7, sno: 7, student: 'ANJUM', noteTitle: '', date: '17-01-2023', regFrom: 'App', amount: 0, payable: 0, discount: 0, coupon: '', payMode: 'Online', status: 'Active' },
  { id: 8, sno: 8, student: 'Gaurav', noteTitle: '', date: '14-01-2023', regFrom: 'App', amount: 0, payable: 0, discount: 0, coupon: '', payMode: 'Online', status: 'Active' },
  { id: 9, sno: 9, student: 'ANAND KUMAR', noteTitle: '', date: '02-01-2023', regFrom: 'App', amount: 0, payable: 0, discount: 0, coupon: '', payMode: 'Online', status: 'Active' },
  { id: 10, sno: 10, student: 'Lalit Singh', noteTitle: '', date: '02-01-2023', regFrom: 'App', amount: 0, payable: 0, discount: 0, coupon: '', payMode: 'Online', status: 'Active' },
]

export const allNotesRegistrationData = Array.from({ length: 113 }, (_, index) => {
  if (index < notesRegPage1Data.length) return notesRegPage1Data[index]
  
  return {
    id: index + 2000,
    sno: index + 1,
    student: `Student ${index + 1}`,
    noteTitle: '',
    date: '02-01-2023',
    regFrom: 'App',
    amount: 0,
    payable: 0,
    discount: 0,
    coupon: '',
    payMode: 'Online',
    status: 'Active',
  }
})

const webinarRegPage1Data = [
  { id: 1, sno: 1, student: 'Vibhaw', phone: '6201414215', email: 'Vibhawarav000@Gmail.Com', webinar: '', date: '30-11--0001', amount: 0, payable: 0, discount: 0, coupon: '', status: 'Active' },
  { id: 2, sno: 2, student: 'Vibhaw', phone: '6201414215', email: 'Vibhawarav000@Gmail.Com', webinar: '', date: '30-11--0001', amount: 0, payable: 0, discount: 0, coupon: '', status: 'Active' },
  { id: 3, sno: 3, student: 'Devanand Yadav', phone: '9302311791', email: 'D66233764@Gmail.Com', webinar: '', date: '30-11--0001', amount: 0, payable: 0, discount: 0, coupon: '', status: 'Active' },
  { id: 4, sno: 4, student: 'Devanand Yadav', phone: '9302311791', email: 'D66233764@Gmail.Com', webinar: '', date: '30-11--0001', amount: 0, payable: 0, discount: 0, coupon: '', status: 'Active' },
  { id: 5, sno: 5, student: 'Devanand Yadav', phone: '9302311791', email: 'D66233764@Gmail.Com', webinar: '', date: '30-11--0001', amount: 0, payable: 0, discount: 0, coupon: '', status: 'Active' },
  { id: 6, sno: 6, student: 'Sachin Kumar', phone: '8010822258', email: 'Sachink32891@Gmail.Com', webinar: '', date: '30-11--0001', amount: 0, payable: 0, discount: 0, coupon: '', status: 'Active' },
  { id: 7, sno: 7, student: 'Sachin Kumar', phone: '8010822258', email: 'Sachink32891@Gmail.Com', webinar: '', date: '30-11--0001', amount: 0, payable: 0, discount: 0, coupon: '', status: 'Active' },
  { id: 8, sno: 8, student: 'Sahil', phone: '7008017899', email: 'Yogisahilprusty@Gmail.Com', webinar: '', date: '30-11--0001', amount: 0, payable: 0, discount: 0, coupon: '', status: 'Active' },
]

export const allWebinarRegistrationData = Array.from({ length: 6367 }, (_, index) => {
  if (index < webinarRegPage1Data.length) return webinarRegPage1Data[index]
  
  return {
    id: index + 3000,
    sno: index + 1,
    student: `Student ${index + 1}`,
    phone: `999${index.toString().padStart(7, '0')}`,
    email: `student${index + 1}@example.com`,
    webinar: '',
    date: '30-11--0001',
    amount: 0,
    payable: 0,
    discount: 0,
    coupon: '',
    status: 'Active',
  }
})

const jobRegPage1Data = [
  { id: 1, sno: 1, candidateName: 'Vijay Kumar', mobile: '8092324072', email: 'Vijaymishra1572003@Gmail.Com', job: 'Business Analyst [Fresher] - AddWeb', company: 'AddWeb Solution Pvt Ltd', date: '22-05-2026' },
  { id: 2, sno: 2, candidateName: 'Kartik Sarode', mobile: '9313716571', email: 'Kartiksarode.Sit.Entc@Gmail.Com', job: 'Business Analyst [Fresher] - AddWeb', company: 'AddWeb Solution Pvt Ltd', date: '22-05-2026', highlight: true },
  { id: 3, sno: 3, candidateName: 'Mahendra Rajurkar', mobile: '7805983984', email: 'Mahendrarajurkar111@Gmail.Com', job: 'Business Analyst Intern-Pin Blooms', company: 'Pin Blooms', date: '21-05-2026' },
]

export const allJobRegistrationData = Array.from({ length: 267 }, (_, index) => {
  if (index < jobRegPage1Data.length) return jobRegPage1Data[index]
  
  return {
    id: index + 4000,
    sno: index + 1,
    candidateName: `Candidate ${index + 1}`,
    mobile: `999${index.toString().padStart(7, '0')}`,
    email: `candidate${index + 1}@example.com`,
    job: 'Data Analyst-EXL',
    company: 'EXL',
    date: '06-04-2026',
  }
})

const eventRegPage1Data = [
  { id: 1, sno: 1, candidateName: 'Shraddha Pawar', mobile: '9422007506', email: 'Shraddhapawar709@Gmail.Com', event: 'NEW COHORT BATCH START | DATA ANALYTICS', date: '25-04-2026' },
  { id: 2, sno: 2, candidateName: 'Gaurav', mobile: '8604531631', email: 'Vishuvivek227@Gmail.Com', event: 'NEW COHORT BATCH START | DATA ANALYTICS', date: '25-04-2026' },
  { id: 3, sno: 3, candidateName: 'CHANDRABHUSAN KAIWART', mobile: '7224983732', email: 'Kaiwartsubhash2@Gmail.Com', event: 'NEW COHORT BATCH START | DATA ANALYTICS', date: '25-04-2026' },
  { id: 4, sno: 4, candidateName: 'Anish Kumar Singh', mobile: '9798550054', email: 'Anishkumarsingh1234519@Gmail.Com', event: 'NEW COHORT BATCH START | DATA ANALYTICS', date: '23-04-2026' },
  { id: 5, sno: 5, candidateName: 'Kuldeep Meena', mobile: '7878385224', email: 'Soniya9311159@Gmail.Com', event: 'NEW COHORT BATCH START | DATA SCIENCE', date: '19-04-2026' },
  { id: 6, sno: 6, candidateName: 'Pranali Talewar', mobile: '9579028449', email: 'Pranalitalewar086@Gmail.Com', event: 'NEW COHORT BATCH START | DATA SCIENCE', date: '18-04-2026' },
  { id: 7, sno: 7, candidateName: 'KVSSRAMA KRISHNA', mobile: '9963903911', email: 'Ksai.Mb@Gmail.Com', event: 'NEW COHORT BATCH START | DATA SCIENCE', date: '18-04-2026' },
  { id: 8, sno: 8, candidateName: 'RAHUL AMBANI', mobile: '7898204022', email: 'Ambani.Contact@Gmail.Com', event: 'NEW COHORT BATCH START | DATA SCIENCE', date: '18-04-2026' },
  { id: 9, sno: 9, candidateName: 'Rohit Kumar', mobile: '6207794109', email: 'Rohitkumar09122000@Gmail.Com', event: 'NEW COHORT BATCH START | DATA SCIENCE', date: '18-04-2026' },
  { id: 10, sno: 10, candidateName: 'Sohel Khan', mobile: '6203907693', email: 'Ruhi64648@Gmail.Com', event: 'NEW COHORT BATCH START | DATA SCIENCE', date: '18-04-2026' },
]

export const allEventRegistrationData = Array.from({ length: 1185 }, (_, index) => {
  if (index < eventRegPage1Data.length) return eventRegPage1Data[index]
  
  return {
    id: index + 5000,
    sno: index + 1,
    candidateName: `Candidate ${index + 1}`,
    mobile: `999${index.toString().padStart(7, '0')}`,
    email: `candidate${index + 1}@example.com`,
    event: 'NEW COHORT BATCH START | DATA SCIENCE',
    date: '18-04-2026',
  }
})

const courseWishlistPage1Data = [
  { id: 1, sno: 1, studentId: '98307', student: 'MOHNEESH PARATE', contact: '8928912039', email: 'Mohneesh30.Hp@Gmail.Com', course: 'Free Data Analytics Course', date: '22-05-2026 5:53 Am' },
  { id: 2, sno: 2, studentId: '110763', student: 'Mallanagoud R', contact: '9611163380', email: 'Mallanagoudr61@Gmail.Com', course: 'Free Data Analytics Course', date: '22-05-2026 2:00 Am' },
  { id: 3, sno: 3, studentId: '110763', student: 'Mallanagoud R', contact: '9611163380', email: 'Mallanagoudr61@Gmail.Com', course: 'Free Data Science Course', date: '22-05-2026 1:54 Am' },
]

export const allCourseWishlistData = Array.from({ length: 9674 }, (_, index) => {
  if (index < courseWishlistPage1Data.length) return courseWishlistPage1Data[index]
  return {
    id: index + 6000,
    sno: index + 1,
    studentId: `${100000 + index}`,
    student: `Student ${index + 1}`,
    contact: `999${index.toString().padStart(7, '0')}`,
    email: `student${index + 1}@example.com`,
    course: 'Free Data Analytics Course',
    date: '21-05-2026 9:16 Am',
  }
})

const testWishlistPage1Data = [
  { id: 1, sno: 1, studentId: '24009', student: 'Kuldeep', package: 'Testing', date: '06-11-2025 1:38 Pm' },
  { id: 2, sno: 2, studentId: '24005', student: 'Kuldeep', package: 'Testing', date: '06-11-2025 1:36 Pm' },
  { id: 3, sno: 3, studentId: '23423', student: 'Anmol Pandey', package: 'Testing', date: '21-08-2025 6:38 Am' },
  { id: 4, sno: 4, studentId: '22175', student: 'Vishal Mahajan', package: 'SQL TEST', date: '21-03-2025 5:46 Am' },
  { id: 5, sno: 5, studentId: '21165', student: 'Prashant Rokde', package: 'SQL TEST', date: '04-12-2024 4:42 Am' },
]

export const allTestSeriesWishlistData = Array.from({ length: 121 }, (_, index) => {
  if (index < testWishlistPage1Data.length) return testWishlistPage1Data[index]
  return {
    id: index + 7000,
    sno: index + 1,
    studentId: `${20000 + index}`,
    student: `Student ${index + 1}`,
    package: 'SQL TEST',
    date: '04-12-2024 4:42 Am',
  }
})

const notesWishlistPage1Data = [
  { id: 1, sno: 1, student: 'Hariom', notesTitle: '', date: '31-08-2022 11:36 Am' },
  { id: 2, sno: 2, student: 'Hariom', notesTitle: '', date: '30-07-2022 10:59 Am' },
  { id: 3, sno: 3, student: 'Kiran', notesTitle: '', date: '27-07-2022 8:07 Am' },
  { id: 4, sno: 4, student: 'Amit', notesTitle: '', date: '21-07-2022 12:13 Pm' },
  { id: 5, sno: 5, student: 'Sumit', notesTitle: '', date: '21-07-2022 12:13 Pm' },
]

export const allNotesWishlistData = Array.from({ length: 120 }, (_, index) => {
  if (index < notesWishlistPage1Data.length) return notesWishlistPage1Data[index]
  return {
    id: index + 8000,
    sno: index + 1,
    student: `Student ${index + 1}`,
    notesTitle: 'Data Science Notes',
    date: '21-07-2022 12:13 Pm',
  }
})

export const allWebinarWishlistData = Array.from({ length: 4810 }, (_, index) => {
  return {
    id: index + 9000,
    sno: index + 1,
    studentId: `${30000 + index}`,
    student: `Student ${index + 1}`,
    webinar: 'Career Guidance Session',
    date: '22-05-2026 10:00 Am',
  }
})

export const allBatchManagementData = Array.from({ length: 20 }, (_, index) => {
  return {
    id: index + 10000,
    sno: index + 1,
    batchName: index === 0 ? 'DATA SCIENCE REGULAR BATCH | LIVE DOUBT CLASS' : index === 1 ? 'Master Of Data Analytics Program' : 'EV',
    batchInstructor: 'The iScale Team',
    course: index === 0 ? 'Data Science With Generative AI Course' : index === 1 ? 'Master Of Data Analytics Program' : '-',
    date: index === 2 ? '16-10-2024' : '15-10-2024',
    startTime: index === 2 ? '3:00 Pm' : '6:00 Pm',
    endTime: index === 2 ? '4:00 Pm' : '7:00 Pm',
    strength: index === 0 ? 14 : index === 1 ? 15 : 5,
    subject: index === 0 ? 'Python, SQL, Power BI, Machine Learning, Deep Learning, Computer Vision, NLP, Generative AI' : index === 1 ? 'Python, SQL, Power BI, Tableau, Advanced Analytics' : 'EV BMS Basics',
  }
})

export const allLiveClassesData = Array.from({ length: 20 }, (_, index) => {
  return {
    id: index + 11000,
    sno: index + 1,
    title: 'Thursday 6:00 PM || Resume Buliding Class',
    date: '28-05-2026',
    duration: 50,
    joinUrl: '#',
    hostUrl: '#',
    batchName: index % 2 === 0 ? 'DATA SCIENCE REGULAR BATCH | LIVE DOUBT CLASS' : 'Data Analyst Regular Batch | Live Doubt Class',
    teacher: 'Priyanshu Sir',
  }
})

export const allCourseCategoriesData = Array.from({ length: 9 }, (_, index) => {
  return {
    id: index + 10000,
    sno: index + 1,
    categoryName: index === 0 ? 'Electric Vehicle Courses' : index === 1 ? 'Data Science Courses' : index === 2 ? 'Data Analyst Courses' : 'Foundation',
    description: index === 0 ? '"Electric Vehicle Design & Development" Course Is A Full-Fledged Online Program Which Is Designed For All The EV Enthusiast Who Want To Learn The Technology Behind The Electric Vehicle Including All Necessary Software\'s Knowledge. This Program Consists Of 8 Modules Which Is Built By Focusing On The Inputs Provided By Industry Experts.' : index === 2 ? 'Data Will Change The World, And Becoming Data-Literate Will Pay Dividends For Your Career. Data Analytics Is A Fast-Growing Field And It Will Continue To Grow Over The Next Decade. Since Many Companies Are Now Working Based On Data, Its Analysis Is Crucial. This Is Why The Demand For Data Analysts Will Grow More And More In The Future.' : index === 3 ? 'Foundation Course In Data Science & AI This Comprehensive Foundation Course Is Designed To Take You From The Basics To Advanced Proficiency In' : '',
    status: index === 0 ? 'Inactive' : 'Active',
  }
})

export const allCoursesData = Array.from({ length: 20 }, (_, index) => {
  return {
    id: index + 10000,
    sno: index + 1,
    title: index === 0 ? 'Free Electric Vehicle Basic Course' : index === 1 ? 'Free Data Analytics Course' : index === 2 ? 'Master Of Data Analytics Program' : 'Advance Programme In Electric Vehicle',
    code: '',
    category: index === 0 ? 'Cohort Courses' : index === 1 ? 'Free Category' : index === 2 ? 'Data Analyst Courses' : 'Electric Vehicle Courses',
    courseType: index < 2 ? 'Free' : 'Paid',
    coursePrice: index < 2 ? 'N/A' : index === 2 ? '23999' : '19990',
    offerPrice: index < 2 ? 'N/A' : index === 2 ? '16999' : '18999',
    status: (index === 0 || index === 3) ? 'In-Active' : 'Active',
  }
})

export const popularCoursesData = Array.from({ length: 17 }, (_, index) => {
  return {
    id: index + 10000,
    sno: index + 1,
    title: index === 0 ? 'Free Electric Vehicle Basic Course' : index === 1 ? 'Free Data Analytics Course' : index === 2 ? 'Master Of Data Analytics Program' : 'Advance Programme In Electric Vehicle',
    code: '',
    category: index === 0 ? 'Cohort Courses' : index === 1 ? 'Free Category' : index === 2 ? 'Data Analyst Courses' : 'Electric Vehicle Courses',
    courseType: index < 2 ? 'Free' : 'Paid',
    coursePrice: index < 2 ? 'N/A' : index === 2 ? '23999' : '19990',
    offerPrice: index < 2 ? 'N/A' : index === 2 ? '16999' : '18999',
    status: (index === 0 || index === 3) ? 'In-Active' : 'Active',
  }
})

export const recommendedCoursesData = Array.from({ length: 13 }, (_, index) => {
  return {
    id: index + 10000,
    sno: index + 1,
    title: index === 0 ? 'Free Electric Vehicle Basic Course' : index === 1 ? 'Free Data Analytics Course' : index === 2 ? 'Master Of Data Analytics Program' : 'Advance Programme In Electric Vehicle',
    code: '',
    category: index === 0 ? 'Cohort Courses' : index === 1 ? 'Free Category' : index === 2 ? 'Data Analyst Courses' : 'Electric Vehicle Courses',
    courseType: index < 2 ? 'Free' : 'Paid',
    coursePrice: index < 2 ? 'N/A' : index === 2 ? '23999' : '19990',
    offerPrice: index < 2 ? 'N/A' : index === 2 ? '16999' : '18999',
    status: (index === 0 || index === 3) ? 'In-Active' : 'Active',
  }
})

export const notesCategoryData = [
  {
    id: 1,
    sno: 1,
    categoryName: 'Electric Vehicle Course',
    description: 'Electric Vehicles Can Play A Vital Role In Combating Climate Change Across The Globe By Helping To Cut Down The Emissions And Reducing Dependence On Fossil Fuels. This Notes Section Throws Light On The Different Types Of Electric Vehicles, Environmental Advantages, Various Initiatives Of Government And The Future Impact Of Electric Vehicles On Employment And Economy.',
    status: 'Inactive'
  },
  {
    id: 2,
    sno: 2,
    categoryName: 'Solidworks',
    description: 'We, Dassault Systems, Together With Our Trusted 3DS Business Stakeholders, Use Cookies To Give You The Best Experience On Our Websites By : Measuring Their Audience And Improving Their Performance, By Providing You With Content And Proposals That Correspond To Your Interactions.',
    status: 'Inactive'
  }
];

export const notesSubCategoryData = [
  {
    id: 1,
    sno: 1,
    categoryName: 'Electric Vehicle Course',
    subCategoryName: 'Chassis & Design',
    description: 'Based On Detailed Study Analysis, Future Requirements And Regulations, A Chassis Will Be Designed For An Autonomous Road Vehicle. The Vehicle Is Intended To Be Used At An Airport With The Purpose Of Transporting People With Their Luggage Between Different Gates And Terminals.',
    status: 'In-Active'
  },
  {
    id: 2,
    sno: 2,
    categoryName: 'Electric Vehicle Course',
    subCategoryName: 'Power Train',
    description: 'The Latest Powertrain Innovations For Cars And Commercial Vehicles Are Featured In This Special Report, A Compendium Of Recent Articles From The Editors Of Automotive Engineering And Truck & Off-Highway Engineering.',
    status: 'In-Active'
  }
];

export const allTestSeriesPackagesData = Array.from({ length: 10 }, (_, index) => {
  return {
    id: index + 12000,
    sno: index + 1,
    title: index === 2 || index === 3 ? 'Monthly Live Test' : index === 4 ? 'SQL TEST' : 'Testing',
    category: '',
    banner: index === 0 ? '' : 'image.jpg',
    packageType: 'Free',
    packagePrice: 'N/A',
    offerPrice: 'N/A',
    test: 'View',
    trainingHighlights: 'Training Highlights',
    status: index === 0 ? 'In-Active' : 'Active',
  }
})

export const teamsData = [
  {
    id: 1,
    sno: 1,
    name: 'Bhavesh Sir',
    position: 'Placement Head',
    expertise: 'Placement Cordinator',
    experience: '8',
    linkedin: 'Https://Www.Linkedin.Com/In/Bhavesh-Kumar-Patil-909742154/',
    type: 'Team Member',
    status: 'Active'
  },
  {
    id: 2,
    sno: 2,
    name: 'Mr. Jenendra Anand',
    position: 'Group CEO Of Baxy Group',
    expertise: '',
    experience: '0',
    linkedin: '',
    type: 'Team Member',
    status: 'Active'
  }
];

export const courseRatingsData = [
  { id: 1, sno: 1, name: '', course: '', rating: '5', review: '', addedOn: '07-02-2024', status: 'In-Active' },
  { id: 2, sno: 2, name: 'Anil Singh', course: '', rating: '4.5', review: 'Please Provide Some More Raw Data So That We Can Practice It.', addedOn: '07-02-2024', status: 'In-Active' },
  { id: 3, sno: 3, name: '', course: '', rating: '5', review: 'Course Is Good.', addedOn: '07-02-2024', status: 'In-Active' },
  { id: 4, sno: 4, name: 'Venkat', course: '', rating: '4.5', review: 'Course Is Up To The Mark.', addedOn: '07-02-2024', status: 'In-Active' },
  { id: 5, sno: 5, name: '', course: '', rating: '5.0', review: 'Best Course Material', addedOn: '07-02-2024', status: 'In-Active' }
];

export const subjectRatingsData = [
  { id: 1, sno: 1, name: 'Testing', subject: 'WhatsApp Chat Analysis | Python Project', rating: '4.5', review: 'This Course Has To Very Clear And Basic To Advanced Term For Newly Whatsapp User1234', addedOn: '07-02-2024', status: 'In-Active' }
];

export const bannersData = [
  { id: 1, sno: 1, title: 'Banner1', status: 'Pending' },
  { id: 2, sno: 2, title: 'Banner 2', status: 'Pending' },
  { id: 3, sno: 3, title: 'Banner 3', status: 'Pending' },
  { id: 4, sno: 4, title: 'Banner 1 DS', status: 'Running' },
  { id: 5, sno: 5, title: 'Banner 2 DA', status: 'Running' },
  { id: 6, sno: 6, title: 'Banner 3', status: 'Running' },
  { id: 7, sno: 7, title: 'Banner 4', status: 'Running' },
  { id: 8, sno: 8, title: 'Banner 5', status: 'Running' }
];

export const leadsData = [
  { id: 1, sno: 1, title: 'A.I. Full Course (Free) | Master AI Tools & Core Concepts Notes', addedOn: '02/02/2026', status: 'Active' },
  { id: 2, sno: 2, title: 'Advanced AI Full Course (100% FREE) 2026 | Download PDF', addedOn: '23/03/2026', status: 'Active' },
  { id: 3, sno: 3, title: 'AI Masterclass | Tools & Prompt Notes', addedOn: '11/04/2026', status: 'Active' },
  { id: 4, sno: 4, title: 'Antigravity | Claude Code Notes', addedOn: '14/03/2026', status: 'Active' },
  { id: 5, sno: 5, title: 'Claude Basics | Swati Mam | The IScale', addedOn: '12/05/2026', status: 'Active' },
  { id: 6, sno: 6, title: 'Data Analyst Course Form', addedOn: '29/10/2023', status: 'Active' }
];

export const jobUpdatesData = [
  { id: 1, sno: 1, title: 'Business Analyst [Fresher] - AddWeb', image: 'A', company: 'AddWeb Solution Pvt Ltd', location: 'Jaipur, India', experience: 'Fresher', salary: '₹ 2,00,000 - ₹ 2,50,000 PA', order: '347', status: 'Open' },
  { id: 2, sno: 2, title: 'Business Analyst (Product Owner)', image: 'N', company: 'Neurealm', location: 'Chennai, Tamil Nadu, India (CHN)', experience: '0-2 Years', salary: '₹ 5,00,000 - ₹ 10,00,000 PA', order: '348', status: 'Open' },
  { id: 3, sno: 3, title: 'Business Analyst - Viralchilly', image: 'V', company: 'ViralChilly', location: 'Jaipur, India', experience: '1-2 Years', salary: '₹ 3,00,000 - ₹ 6,00,000 PA', order: '349', status: 'Open' },
  { id: 4, sno: 47, title: 'Pro*C Developer', image: 'G', company: 'Gainwell Technologies', location: 'Bangalore, KA, IN', experience: '2+', salary: 'Disclosed - ₹ Not Disclosed PM', order: '405', status: 'Open' },
  { id: 5, sno: 48, title: 'DISCO Desk Analyst- India', image: 'D', company: 'DISCO', location: 'Gurugram, Haryana, India', experience: '1+', salary: '₹ Not Disclosed - ₹ Not Disclosed PM', order: '407', status: 'Open' },
  { id: 6, sno: 49, title: 'Lease Analyst I (3 - 11 Months)', image: 'M', company: 'MRI Software', location: 'Gurgaon, Haryana, India', experience: '3 Months - 1 Year', salary: '₹ Not Disclosed - ₹ Not Disclosed PM', order: '406', status: 'Open' },
  { id: 7, sno: 50, title: 'Business Analyst- Unique Biotech', image: 'U', company: 'Unique Biotech', location: 'Hyderabad, Telangana, India', experience: '1-2 Years', salary: '₹ 2,86,000 - ₹ 3,20,000 PA', order: '407', status: 'Open' },
];

export const successStoriesData = [
  { id: 1, sno: 1, name: 'Amit Jaiswal', designation: 'Data Analyst', placedAt: 'INFOCRATS', package: 'Non-Disclosed', order: '1', status: 'Active', hasImage: true },
  { id: 2, sno: 2, name: 'Aditya Singh', designation: 'Data Analyst', placedAt: 'Network Zone', package: 'Non-Disclosed', order: '1', status: 'Active', hasImage: true },
  { id: 3, sno: 3, name: 'Kishan', designation: 'Data Analyst', placedAt: 'Itron', package: '13.7', order: '19', status: 'Active', hasImage: true },
  { id: 4, sno: 4, name: 'Ankush', designation: '', placedAt: 'Tiger Analytics', package: '14 LPA', order: '18', status: 'Active', hasImage: true },
  { id: 5, sno: 36, name: 'Mr Abhishek Jain', designation: '', placedAt: 'AMDOCS', package: '4.0 LPA', order: '95', status: 'Active', hasImage: false },
  { id: 6, sno: 37, name: 'Ms Charmaine Richardson', designation: '', placedAt: 'COGNIZANT', package: 'Not Disclosed', order: '96', status: 'In-Active', hasImage: true },
  { id: 7, sno: 38, name: 'Nishita', designation: 'Data Analyst', placedAt: '', package: 'Non-Disclosed', order: '15', status: 'Active', hasImage: true },
  { id: 8, sno: 39, name: 'Mr Kritik', designation: 'Data Analyst', placedAt: '', package: '', order: '17', status: 'Active', hasImage: true },
  { id: 9, sno: 40, name: 'Mr Hemant Manjhi', designation: '', placedAt: 'Capgemini', package: '8+ LPA', order: '99', status: 'Active', hasImage: false },
];

export const placementTalksData = [
  { id: 1, sno: 1, name: 'Ashay Krishna', designation: 'Director Of Engg', company: 'Microsoft', order: '9', status: 'Active', companyColor: 'text-[#f25022]' },
  { id: 2, sno: 2, name: 'Shweta Shandilya', designation: 'Executive Director', company: 'IBM', order: '10', status: 'Active', companyColor: 'text-[#0f62fe]' },
  { id: 3, sno: 3, name: 'Harjeet Khanduja', designation: 'Vice President', company: 'Reliance Jio', order: '14', status: 'Active', companyColor: 'text-[#0f30ac]' },
  { id: 4, sno: 4, name: 'Prasad Menon', designation: 'CHRO', company: 'Amagi, Flipkart', order: '12', status: 'Active', companyColor: 'text-[#ff6600]' },
];

export const alliedData = [
  { id: 1, sno: 1, title: "BVB's Sardar Patel College Of Engineering", inr: '', order: '9', status: 'Active' },
  { id: 2, sno: 2, title: 'Adamas University', inr: '', order: '10', status: 'Active' },
  { id: 3, sno: 3, title: 'HRIT Group Of Institutions', inr: '', order: '6', status: 'Active' },
  { id: 4, sno: 4, title: 'Rajkiya Engineering College', inr: '', order: '4', status: 'Active' },
  { id: 5, sno: 45, title: 'Chaitanya Bharathi Institute Of Technology', inr: '-', order: '47', status: 'Active' },
  { id: 6, sno: 46, title: 'Megha & Omega Group Of Institutions', inr: '-', order: '22', status: 'Active' },
  { id: 7, sno: 47, title: 'Deccan Group Of Institutions', inr: '-', order: '23', status: 'Active' },
  { id: 8, sno: 48, title: 'RBMI Group Of Institutions', inr: '-', order: '33', status: 'Active' },
  { id: 9, sno: 49, title: 'Indraprastha Institute Of Management & Technology', inr: '-', order: '52', status: 'Active' },
  { id: 10, sno: 50, title: 'Samrat Ashok Technological Institute', inr: '-', order: '14', status: 'Active' },
];

export const clientsData = [
  { id: 1, sno: 1, clientName: 'Planet Spark', companyName: 'Planet Spark', order: '10', status: 'Active' },
  { id: 2, sno: 2, clientName: 'Paisa Bazar', companyName: 'Paisa Bazar', order: '5', status: 'Active' },
  { id: 3, sno: 3, clientName: 'PhonePe', companyName: 'PhonePe', order: '1', status: 'Active' },
  { id: 4, sno: 4, clientName: 'Cultsports', companyName: 'Cultsports', order: '3', status: 'Active' },
  { id: 5, sno: 5, clientName: 'Good Glamm Group', companyName: 'Good Glamm Group', order: '2', status: 'Active' },
  { id: 6, sno: 6, clientName: 'TATA 1mg', companyName: 'TATA 1mg', order: '4', status: 'Active' },
];

export const newsData = [
  { id: 1, sno: 1, title: 'Test 1', image: '', createdAt: '17-03-2026', order: '6', status: 'In-Active' },
  { id: 2, sno: 2, title: 'AiPrompts – Get The Latest & Trending AI Prompts For Gemini, ChatGPT, And All AI Tools', image: '', createdAt: '15-03-2026', order: '7', status: 'In-Active' },
  { id: 3, sno: 3, title: 'Get The Latest & Trending AI Prompts For Gemini, ChatGPT, And All AI Tools-GeminiAiPrompt', image: 'gemini', createdAt: '16-02-2026', order: '7', status: 'In-Active' },
  { id: 4, sno: 4, title: 'The Complete Google Gemini AI Prompt Library For Photo Editing, AI Art & Creative Inspiration', image: 'gemini', createdAt: '09-02-2026', order: '7', status: 'In-Active' },
  { id: 5, sno: 5, title: 'Top 10 AI Tools to Boost Your Productivity in 2026', image: '', createdAt: '05-02-2026', order: '8', status: 'Active' },
  { id: 6, sno: 6, title: 'New Machine Learning Updates Released by Google', image: 'gemini', createdAt: '01-02-2026', order: '9', status: 'Active' },
  { id: 7, sno: 7, title: 'ChatGPT-5 Features: What You Need to Know', image: '', createdAt: '28-01-2026', order: '10', status: 'Active' },
  { id: 8, sno: 8, title: 'Prompt Engineering Guide for Beginners', image: 'gemini', createdAt: '25-01-2026', order: '11', status: 'In-Active' },
  { id: 9, sno: 9, title: 'How to Build an App with AI in 10 Minutes', image: '', createdAt: '20-01-2026', order: '12', status: 'Active' },
  { id: 10, sno: 10, title: 'The Future of Deep Learning and Neural Networks', image: 'gemini', createdAt: '15-01-2026', order: '13', status: 'Active' },
  { id: 11, sno: 11, title: 'Understanding OpenAI\'s New Sora Model', image: '', createdAt: '10-01-2026', order: '14', status: 'Active' },
  { id: 12, sno: 12, title: 'Top AI Innovations in Healthcare', image: 'gemini', createdAt: '05-01-2026', order: '15', status: 'In-Active' },
  { id: 13, sno: 13, title: 'Can AI Replace Software Engineers?', image: '', createdAt: '01-01-2026', order: '16', status: 'Active' },
  { id: 14, sno: 14, title: 'Using Midjourney for Web Design', image: 'gemini', createdAt: '28-12-2025', order: '17', status: 'Active' },
  { id: 15, sno: 15, title: 'The Ultimate Guide to Claude 3.5 Sonnet', image: '', createdAt: '20-12-2025', order: '18', status: 'Active' },
  { id: 16, sno: 16, title: 'Building Voice Agents with ElevenLabs', image: 'gemini', createdAt: '15-12-2025', order: '19', status: 'In-Active' },
  { id: 17, sno: 17, title: 'Exploring the Rise of Open Source AI', image: '', createdAt: '10-12-2025', order: '20', status: 'Active' },
  { id: 18, sno: 18, title: 'Why Prompt Engineering is the Job of the Future', image: 'gemini', createdAt: '05-12-2025', order: '21', status: 'Active' },
  { id: 19, sno: 19, title: 'Understanding LangChain and LlamaIndex', image: '', createdAt: '01-12-2025', order: '22', status: 'In-Active' },
];

export const contactQueriesData = [
  { id: 1, sno: 1, name: 'Karabi Bora', mobile: '9613606876', email: 'Karabiaei@Gmail.Com', subject: 'I Have Taken Cohor...', date: '21-05-2026', status: 'New' },
  { id: 2, sno: 2, name: 'Shivendra Chaurasia', mobile: '9793621087', email: 'Shivendrachaurasia111...', subject: 'Payment Debited B...', date: '20-05-2026', status: 'New' },
  { id: 3, sno: 3, name: 'Aman', mobile: '9654494750', email: 'Amantiger079@Gmail.C...', subject: 'My Enrolled Ai Cou...', date: '20-05-2026', status: 'New' },
  { id: 4, sno: 4, name: 'Manoj Bhave', mobile: '9930170693', email: 'Manojbhave14@Gmail....', subject: "Notes Can't Be Do...", date: '17-05-2026', status: 'New' },
  { id: 5, sno: 5, name: 'Shivendra Chaurasia', mobile: '9793621087', email: 'Shivendrachaurasia111...', subject: 'Payment Debited B...', date: '15-05-2026', status: 'New' },
  { id: 6, sno: 6, name: 'Shubham Upadhyay', mobile: '8539882553', email: 'Theeshubhamm@Gmail...', subject: 'About Subscription', date: '10-05-2026', status: 'New' },
  { id: 7, sno: 7, name: 'Shivkumar', mobile: '9769195602', email: 'Vshivkumar78@Gmail.C...', subject: 'Cohort Course Pay...', date: '06-05-2026', status: 'New' },
  { id: 8, sno: 1485, name: 'POORTI MAHESHW...', mobile: '07906423009', email: 'Poortimaheshwari0299...', subject: 'Email Support', date: '06-08-2021', status: 'New' },
  { id: 9, sno: 1486, name: 'Akash Sharma', mobile: '9756389304', email: 'Akashsharmagbn@Gma...', subject: 'Call Support', date: '06-08-2021', status: 'New' },
  { id: 10, sno: 1487, name: 'VEDULA SUBHA SRI', mobile: '9030275815', email: 'Subhasreevedula2000@...', subject: 'Query', date: '02-08-2021', status: 'New' },
  { id: 11, sno: 1488, name: 'Shamkumar Tulshir...', mobile: '9975265747', email: 'Shamlilhare007@Gmail....', subject: 'To Complaint Abou...', date: '02-08-2021', status: 'New' },
  { id: 12, sno: 1489, name: 'Nisha Sahu', mobile: '6260359022', email: 'Nishasahubwn@Gmail....', subject: 'MBA', date: '02-08-2021', status: 'New' },
  { id: 13, sno: 1490, name: 'Rushikesh Sharad D...', mobile: '08268785772', email: 'Rishideshmukh840@G...', subject: 'Regarding To Bloo...', date: '01-08-2021', status: 'New' },
  { id: 14, sno: 1491, name: 'Manognya', mobile: '9502601769', email: 'Samantakamanognya8...', subject: 'About Registering', date: '31-07-2021', status: 'New' },
  { id: 15, sno: 1492, name: 'Sowbhagya Gudala', mobile: '07702233712sr', email: 'Sowbhagya1108@Gmai...', subject: 'Email Support', date: '19-06-2021', status: 'New' },
  { id: 16, sno: 1493, name: 'Mahankali Sweety', mobile: '8179990988', email: 'Sweetysmiley006@Gma...', subject: 'Email Support', date: '18-06-2021', status: 'New' },
];

export const hireWithUsData = [
  { id: 1, sno: 1, orgType: 'Limited Liability Company', orgName: 'Org Name', hrEmail: 'Jhjkkjhkk@Wedas.Dfsg', contactNo: '+91 99999999999999999999', altContactNo: '+91', date: '17-04-2026' },
  { id: 2, sno: 2, orgType: 'One Person Company', orgName: 'Org Name', hrEmail: 'Solutionfronta1@Gmail.Com', contactNo: '+91 7984435013', altContactNo: '+91', date: '27-03-2026' },
  { id: 3, sno: 3, orgType: 'Proprietorship Firm', orgName: 'Org Name', hrEmail: 'Yogibhugra@Gmail.Com', contactNo: '+91 8178849721', altContactNo: '+91', date: '14-12-2025' },
  { id: 4, sno: 4, orgType: 'Private Limited Company', orgName: 'Org Name', hrEmail: 'Aabhyd16b@Gmail.Com', contactNo: '+91 8466816650', altContactNo: '+91 8466816650', date: '29-03-2025' },
  { id: 5, sno: 5, orgType: 'Proprietorship Firm', orgName: 'Org Name', hrEmail: 'Hr@Ssitm.Com Hr.Contact@Ssitm.Com', contactNo: '+91 7898204022', altContactNo: '+91 7898204022', date: '22-09-2024' },
  { id: 6, sno: 6, orgType: 'Proprietorship Firm', orgName: 'Org Name', hrEmail: 'Ravindra@Gmail.Com Ravindra1@Gmail.Com', contactNo: '+91 423532525', altContactNo: '+91 3532532525', date: '18-09-2024' },
];

export const couponsData = [
  { id: 1, sno: 1, code: 'MAYOFFERDA', title: '', type: 'Course', typeName: 'Master Of Data Analytics Program', total: '16', used: '1', minMax: '0 - 0', discount: '1500 ( Flat )', date: '02-05-2026 - 31-05-2026', isVisible: 'Visisble', status: 'Active' },
  { id: 2, sno: 2, code: 'MAYOFFERDS', title: '', type: 'Course', typeName: 'Data Science With Generative AI Course', total: '19', used: '1', minMax: '0 - 0', discount: '3000 ( Flat )', date: '02-05-2026 - 31-05-2026', isVisible: 'Visisble', status: 'Active' },
  { id: 3, sno: 3, code: 'SWATI30', title: 'SWATI30', type: 'Course', typeName: 'AI For Everyone : Complete Guide', total: '25', used: '7', minMax: '0 - 0', discount: '1500 ( Flat )', date: '19-05-2026 - 28-05-2026', isVisible: 'Visisble', status: 'Active' },
  { id: 4, sno: 4, code: 'FLAT25%', title: 'FLAT25%', type: 'Course', typeName: 'AI For Everyone : Complete Guide', total: '10', used: '0', minMax: '0 - 0', discount: '25 ( % )', date: '19-05-2026 - 31-05-2026', isVisible: 'Visisble', status: 'In-Active' },
  { id: 5, sno: 5, code: 'BIGSALE', title: 'BIGSALE', type: 'Course', typeName: 'AI For Everyone : Complete Guide', total: '1', used: '0', minMax: '0 - 0', discount: '750 ( Flat )', date: '22-05-2026 - 22-05-2026', isVisible: 'Not-Visible', status: 'Active' },
  { id: 6, sno: 6, code: 'DEALOFF', title: '', type: 'Course', typeName: 'AI For Everyone : Complete Guide', total: '1', used: '0', minMax: '0 - 0', discount: '800 ( Flat )', date: '23-05-2026 - 23-05-2026', isVisible: 'Not-Visible', status: 'Active' },
  { id: 7, sno: 7, code: 'MAHAOFF', title: '', type: 'Course', typeName: 'Data Science With Generative AI Course', total: '1', used: '0', minMax: '2500 - 2500', discount: '2500 ( Flat )', date: '23-05-2026 - 23-05-2026', isVisible: 'Not-Visible', status: 'Active' },
  { id: 8, sno: 8, code: 'NEWYEAR', title: '', type: 'Course', typeName: 'Master Of Data Analytics Program', total: '50', used: '12', minMax: '0 - 0', discount: '2000 ( Flat )', date: '01-01-2026 - 15-01-2026', isVisible: 'Visisble', status: 'In-Active' },
  { id: 9, sno: 9, code: 'DIWALI20', title: '', type: 'Course', typeName: 'AI For Everyone : Complete Guide', total: '100', used: '45', minMax: '0 - 0', discount: '20 ( % )', date: '01-11-2025 - 15-11-2025', isVisible: 'Visisble', status: 'In-Active' },
  { id: 10, sno: 10, code: 'EARLYBIRD', title: '', type: 'Course', typeName: 'Data Science With Generative AI Course', total: '20', used: '20', minMax: '0 - 0', discount: '5000 ( Flat )', date: '01-10-2025 - 31-10-2025', isVisible: 'Not-Visible', status: 'In-Active' },
];

export const moduleData = [
  { id: 1, sno: 1, subModule: 'Test Series LeaderBoard', key: 'Testserieslead', module: 'Test Series LeaderBoard', moduleKey: 'Testserieslead', status: 'Active' },
  { id: 2, sno: 2, subModule: 'Course Registrations', key: 'Course-Registrations', module: 'Registrations', moduleKey: 'Registrations', status: 'Active' },
  { id: 3, sno: 3, subModule: 'Certificate Request', key: 'Certificate-Request', module: 'Registrations', moduleKey: 'Registrations', status: 'Active' },
  { id: 4, sno: 4, subModule: 'Test Series Registration', key: 'Test-Series-Registration', module: 'Registrations', moduleKey: 'Registrations', status: 'Active' },
  { id: 5, sno: 5, subModule: 'Notes Registration', key: 'Notes-Registration', module: 'Registrations', moduleKey: 'Registrations', status: 'Active' },
  { id: 6, sno: 6, subModule: 'Webinar Registrations', key: 'Webinar-Registrations', module: 'Registrations', moduleKey: 'Registrations', status: 'Active' },
  { id: 42, sno: 42, subModule: 'Job Updates', key: 'Job-Updates', module: 'More', moduleKey: 'More', status: 'Active' },
  { id: 43, sno: 43, subModule: 'News & Updates', key: 'News-Updates', module: 'News & Updates', moduleKey: 'News-Updates', status: 'Active' },
  { id: 44, sno: 44, subModule: 'Contact Query', key: 'Contact-Query', module: 'Form & Queries', moduleKey: 'Form&Queries', status: 'Active' },
  { id: 45, sno: 45, subModule: 'Hire With Us Form', key: 'Hire-With-Usform', module: 'Form & Queries', moduleKey: 'Form&Queries', status: 'Active' },
  { id: 46, sno: 46, subModule: 'Event Category', key: 'Eventcategory', module: 'Events', moduleKey: 'Event', status: 'Active' },
  { id: 47, sno: 47, subModule: 'Events', key: 'Events', module: 'Events', moduleKey: 'Event', status: 'Active' },
  { id: 48, sno: 48, subModule: 'Permission', key: 'Permission', module: 'Master', moduleKey: 'Master', status: 'Active' },
  { id: 49, sno: 49, subModule: 'User Role', key: 'User-Role', module: 'User Role', moduleKey: 'User-Role', status: 'Active' },
  { id: 50, sno: 50, subModule: 'My Profile', key: 'Myprofile', module: 'General Setting', moduleKey: 'General-Setting', status: 'Active' },
];

export const brandVideoData = [
  { id: 1, sno: 1, name: 'Home Page' },
];

export const studentNewsData = [
  { id: 1, sno: 1, status: 'Active' },
  { id: 2, sno: 2, status: 'Active' },
  { id: 3, sno: 3, status: 'Active' },
  { id: 4, sno: 4, status: 'Active' },
  { id: 5, sno: 5, status: 'Active' },
  { id: 6, sno: 6, status: 'Active' },
  { id: 7, sno: 7, status: 'Active' },
  { id: 8, sno: 8, status: 'Active' },
  { id: 9, sno: 9, status: 'Active' },
  { id: 10, sno: 10, status: 'Active' },
];

export const studentTestimonialData = Array.from({ length: 38 }, (_, i) => ({
  id: i + 1,
  sno: i + 1,
  status: 'Active'
}));

export const eventCategoryData = [
  { id: 1, sno: 1, title: 'Electric Vehicle Program', order: '2', status: 'Active' },
  { id: 2, sno: 2, title: 'Data Science & Data Analyst', order: '1', status: 'Active' },
];

export const eventData = [
  { id: 1, sno: 1, title: 'NEW COHORT BATCH START | DATA ANALYTICS', category: 'Data Science & Data Analyst', banner: 'image', order: '2', eventStatus: 'Expired', status: 'Active' },
  { id: 2, sno: 2, title: 'NEW COHORT BATCH START | DATA SCIENCE', category: 'Data Science & Data Analyst', banner: 'image', order: '1', eventStatus: 'Expired', status: 'Active' },
  { id: 3, sno: 3, title: 'AI & Data Science Live Workshop For BITS Pilani', category: 'Data Science & Data Analyst', banner: 'image', order: '3', eventStatus: 'Expired', status: 'In-Active' },
  { id: 4, sno: 4, title: 'AI & Data Science Live Workshop', category: 'Data Science & Data Analyst', banner: 'no-image', order: '3', eventStatus: 'Expired', status: 'In-Active' },
  { id: 5, sno: 5, title: 'Data Science End-To-End Project | QnA Session', category: 'Data Science & Data Analyst', banner: 'image', order: '2', eventStatus: 'Expired', status: 'In-Active' },
];

export const userData = [
  { id: 1, sno: 1, name: 'Raju Dalai', loginId: 'raju@theiscale.com', contact: '7000244836', email: 'Raju@Theiscale.Com', addedOn: '11/09/2024', status: 'Active' },
  { id: 2, sno: 2, name: 'Kaushalya', loginId: '8797961608', contact: '8797961608', email: 'Kaushalya@Theiscale.Com', addedOn: '03/11/2024', status: 'Active' },
  { id: 3, sno: 3, name: 'Logixhunt', loginId: '9244034997', contact: '9244034997', email: 'Logixhunttech@Gmail.Com', addedOn: '20/09/2024', status: 'Active' },
  { id: 4, sno: 4, name: 'Devishri', loginId: '9981688422', contact: '9981688422', email: 'Manikpuridevishri7@Gmail.Com', addedOn: '13/07/2025', status: 'Active' },
  { id: 5, sno: 5, name: 'Priyanshu', loginId: '9109094320@priyanshu', contact: '9109094320', email: 'Priyanshugautam.Learn@Gmail.Com', addedOn: '14/03/2026', status: 'Active' },
  { id: 6, sno: 6, name: 'Ayush Dewangan', loginId: '7898204022', contact: '7898204022', email: 'Dewangan.Contact@Gmail.Com', addedOn: '07/08/2025', status: 'Active' },
];
