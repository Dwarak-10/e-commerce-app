import { useQuery } from "@tanstack/react-query"
import api from "../utlis/api"
import DashboardCards from "../components/DashboardCards"
import DashboardLayout from "../components/DashboardLayout"
import { Button, CircularProgress } from "@mui/material"
import ProductStatsChart from "../components/ProductStatsChart"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { useState } from "react"
import ErrorFallback from "../components/ErrorFallBack"

const fetchAdminStats = async () => {
  try {
    const { data } = await api.get("/api/admin/")
    return data?.summary
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    throw error
  }
}

const fetchVendors = async () => {
  try {
    const { data } = await api.get("/api/admin/vendors/")
    // console.log("Vendors data:", data)

    return data
  } catch (error) {
    console.error("Error fetching vendors:", error)
    throw error
  }
}

const salesAnalytics = async (type) => {
  try {
    const { data } = await api.get(`/api/admin/sales-stats/?type=${type}`)
    // console.log("Sales Analytics data:", data)

    return data
  } catch (error) {
    console.error("Error fetching sales analytics:", error)
    throw error
  }
}

export default function AdminDashboard() {
  const [isCategory, setIsCategory] = useState('week')

  const userData = useSelector(store => store.user)
  // console.log(userData)

  const { data: vendors, isLoading: isVendorLoading, isError: isVendorError } = useQuery({
    queryKey: ["vendors"],
    queryFn: fetchVendors,
  })
  const { data: adminStats, isLoading: isAdminLoading, isError: isAdminError } = useQuery({
    queryKey: ["adminStats"],
    queryFn: fetchAdminStats,
  })
  const { data: salesData, isLoading: isSalesLoading, isError: isSalesError } = useQuery({
    queryKey: ["salesAnalytics", isCategory],
    queryFn: () => salesAnalytics(isCategory),
  })
  // console.log("Admin Stats:", adminStats)
  const handleRetry = () => {
    if (isVendorError) {
      fetchVendors()
    }
    if (isAdminError) {
      fetchAdminStats()
    }
    if (isSalesError) {
      salesAnalytics(isCategory)
    }
  }

  if (isVendorLoading || isAdminLoading || isSalesLoading) return <div className="flex justify-center items-center h-screen w-screen"><CircularProgress /></div>
  if (isVendorError || isAdminError || isSalesError) return <ErrorFallback onRetry={handleRetry} />

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Manage vendors and monitor product performance</p>
          </div>



          <Link to="/admin/add-vendor">
            <Button
              variant="contained"
              sx={{
                textTransform: 'none',
                backgroundColor: '#1976d2',
                '&:hover': { backgroundColor: '#125ea6' },
                borderRadius: 2,
                paddingX: 2,
                paddingY: 1,
              }}
            >
              ➕ Add New Vendor
            </Button>
          </Link>
        </div>


        {/* Vendor Overview */}
        <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-lg shadow">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Vendors Overview</h2>
            <p className="mb-4 text-gray-700">Total Vendors: <span className="font-bold">{adminStats?.Total_Vendors}</span></p>
          </div>
          <Link to="/admin/vendor-list">
            <Button
              variant="contained"
              sx={{
                textTransform: 'none',
                backgroundColor: '#1976d2',
                '&:hover': { backgroundColor: '#125ea6' },
                borderRadius: 2,
                paddingX: 2,
                paddingY: 1,
              }}
            >
              View All Vendors
            </Button>
          </Link>
          <Link to="/admin/my-orders">
            <Button
              variant="contained"
              sx={{
                textTransform: 'none',
                backgroundColor: '#1976d2',
                '&:hover': { backgroundColor: '#125ea6' },
                borderRadius: 2,
                paddingX: 2,
                paddingY: 1,
              }}
            >
              Orders
            </Button>
          </Link>
          <Link to="/admin/my-customers">
            <Button
              variant="contained"
              sx={{
                textTransform: 'none',
                backgroundColor: '#1976d2',
                '&:hover': { backgroundColor: '#125ea6' },
                borderRadius: 2,
                paddingX: 2,
                paddingY: 1,
              }}
            >
              View All Users
            </Button>
          </Link>
        </div>

        {/* Dashboard Cards */}
        <div className="mb-6">
          <DashboardCards stats={{ ...adminStats }} />
        </div>

        {/* Product Stats Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <ProductStatsChart salesData={salesData} isCategory={isCategory} setIsCategory={setIsCategory} />
        </div>
      </div>
    </div>
  )
}





