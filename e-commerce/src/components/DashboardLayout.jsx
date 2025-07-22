import { Box } from '@mui/material'
import Sidebar from '../components/SideBar'
import Header from '../components/DashboardHeader'
import AdminDashboard from '../pages/AdminDashboard'

function DashboardLayout() {
  return (
    <Box display="flex">
      <Sidebar />
      <Box flexGrow={1}>
        <Header />
        <AdminDashboard />
      </Box>
    </Box>
  )
}

export default DashboardLayout
