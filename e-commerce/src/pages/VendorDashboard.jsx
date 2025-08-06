
import { useQuery } from "@tanstack/react-query"
import  api  from "../utlis/api"
import ProductCard from "../components/ProductCard"
import { Button } from "@mui/material"
import { Link } from "react-router-dom"

const loggedInVendorId = "v1"

const fetchMyProducts = async () => {
  const { data } = await api.get(`/products?vendorId=${loggedInVendorId}`)
  return data
}

export default function VendorDashboard() {
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ["myProducts", loggedInVendorId],
    queryFn: fetchMyProducts,
  })

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error loading products</p>

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 bg-white p-4 rounded-md shadow">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          📦 Vendor Dashboard
        </h1>

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
      <ul className="flex flex-wrap gap-10">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </ul>
    </div>
  )
}
