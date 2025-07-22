
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import api from "../utlis/api"

const fetchVendorProducts = async (vendorId) => {
  const { data } = await api.get(`/products?vendorId=${vendorId}`)
  return data
}

export default function VendorProducts() {
  const { vendorId } = useParams()
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ["products", vendorId],
    queryFn: () => fetchVendorProducts(vendorId),
  })

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error loading products</p>

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Products for Vendor ID: {vendorId}</h2>
      <ul className="grid grid-cols-2 gap-4">
        {products.map((p) => (
          <li key={p.id} className="border p-3 rounded bg-gray-50">{p.name}</li>
        ))}
      </ul>
    </div>
  )
}
