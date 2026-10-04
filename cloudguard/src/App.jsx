import { Routes, Route } from 'react-router-dom'
import { ChecklistProvider } from './context/ChecklistContext.jsx'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Checklist from './pages/Checklist.jsx'
import Report from './pages/Report.jsx'

export default function App() {
  return (
    <ChecklistProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/checklist" element={<Checklist />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </Layout>
    </ChecklistProvider>
  )
}
