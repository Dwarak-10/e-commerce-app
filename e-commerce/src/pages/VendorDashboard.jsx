
import { useQuery } from "@tanstack/react-query"
import api from "../utlis/api"
import ProductCard from "../components/ProductCard"
import { Button, CircularProgress } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import DashboardCards from "../components/DashboardCards"
import ProductStatsChart from "../components/ProductStatsChart"
import { useState } from "react"

const fetchVendorDashboardData = async () => {
  try {
    const { data } = await api.get('/api/vendor/dashboard/')
    return data?.Summary
  } catch (error) {
    console.error("Error fetching vendor dashboard data:", error)
    throw error
  }
}
const fetchVendorSalesAnalytics = async (type) => {
  try {
    const { data } = await api.get(`/api/admin/sales-stats/?type=${type}`)
    return data
    } catch (error) {
      console.error("Error fetching vendor sales analytics:", error)
      throw error
    }
  }


  export default function VendorDashboard() {
    const [isCategory, setIsCategory] = useState('week')

    const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useQuery({
      queryKey: ['vendorDashboard'],
      queryFn: fetchVendorDashboardData
    })
    const { data: salesData, isLoading: salesLoading, error: salesError } = useQuery({
      queryKey: ['vendorSalesAnalytics', isCategory],
      queryFn: () => fetchVendorSalesAnalytics(isCategory)
    })

    // console.log("Vendor Dashboard Data:", dashboardData)
    if (dashboardLoading || salesLoading) return <div className="flex justify-center items-center h-screen w-screen"><CircularProgress /></div>
    if (dashboardError || salesError) return <div className="flex justify-center items-center h-screen w-screen">Something went wrong❌</div>


    return (
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 bg-white p-4 rounded-md shadow">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            📦 Vendor Dashboard
          </h1>

          <Link to="/vendor/my-products">
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
              My Products
            </Button>
          </Link>
          <Link to="/vendor/my-orders">
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
          <Link to="/vendor/add-product">
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
              ➕ Add New Product
            </Button>
          </Link>
        </div>
        {/* Dashboard Cards */}
        <div className="mb-6">
          <DashboardCards stats={dashboardData} />
        </div>

        {/* Product Stats Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <ProductStatsChart salesData={salesData} isCategory={isCategory} setIsCategory={setIsCategory} />
        </div>
      </div>
    )
  }
