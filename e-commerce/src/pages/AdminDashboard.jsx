import { useQuery } from "@tanstack/react-query"
import  api  from "../utlis/api"
import DashboardCards from "../components/DashboardCards"
import DashboardLayout from "../components/DashboardLayout"
import { Button } from "@mui/material"
import ProductStatsChart from "../components/ProductStatsChart"
import { Link } from "react-router-dom"
const fetchVendors = async () => {
  const { data } = await api.get("/vendors")
  return data
}

export default function AdminDashboard() {
  const { data: vendors, isLoading, isError } = useQuery({
    queryKey: ["vendors"],
    queryFn: fetchVendors,
  })

  if (isLoading) return <p>Loading vendors...</p>
  if (isError) return <p>Error loading vendors</p>

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Manage vendors and monitor product performance</p>
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
        <div className="mb-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Vendors Overview</h2>
          <p className="mb-4 text-gray-700">Total Vendors: <span className="font-bold">{vendors.length}</span></p>

        </div>

        {/* Dashboard Cards */}
        <div className="mb-6">
          <DashboardCards />
        </div>

        {/* Product Stats Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <ProductStatsChart />
        </div>
      </div>
    </div>
  )
}





