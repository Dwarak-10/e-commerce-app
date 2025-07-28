import { useQuery } from "@tanstack/react-query"
import {api} from "../utlis/api"
import DashboardCards from "../components/DashboardCards"
import DashboardLayout from "../components/DashboardLayout"
import { Button } from "@mui/material"
import ProductStatsChart from "../components/ProductStatsChart"
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-3">Total Vendors: {vendors.length}</p>
      <ul className="space-y-2">
        {vendors.map((v) => (
          <li key={v.id} className="border p-3 rounded bg-white">
            <p>Name: {v.name}</p>
            <p>Email: {v.email}</p>
            <Button href={`/admin/vendor/${v.id}`} sx={{color:'white', background:'#657376ff'}}>
             {/* <div className="text-white bg-gray-600 p-2 rounded-sm"> */}
              View Products
              {/* </div>  */}
            </Button>
          </li>
        ))}
      </ul>
      <DashboardCards/>
      <ProductStatsChart />
    </div>
  )
}





