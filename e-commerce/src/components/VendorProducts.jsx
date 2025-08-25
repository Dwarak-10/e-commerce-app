
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import api from "../utlis/api"
import ProductCard from "./ProductCard"
import { Box, CircularProgress } from "@mui/material"

const fetchVendorProducts = async (vendorId) => {
  const { data } = await api.get(`/api/admin/vendors/${vendorId}/`)
  console.log("Vendor products data:", data)
  return data
}

export default function VendorProducts() {
  const { vendorId } = useParams()
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ["products", vendorId],
    queryFn: () => fetchVendorProducts(vendorId),
  })

  if (isLoading) return <div className="flex justify-center items-center h-screen w-screen"><CircularProgress /></div>
  if (isError) return <p>Error loading products</p>

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Products for Vendor ID: {vendorId}</h2>
      {products.length === 0 && <Box sx={{ p: 2, textAlign: 'center' }}>No products found for this vendor.</Box>}
      <ul className="flex flex-wrap gap-10">
        {products.map((p) => (
          <div key={p.id}>
            <ProductCard product={p} />
          </div>
        ))}
      </ul>

    </div>
  )
}
