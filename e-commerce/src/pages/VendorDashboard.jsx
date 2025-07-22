
import { useQuery } from "@tanstack/react-query"
import api from "../utlis/api"

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
      <h1 className="text-2xl font-bold mb-4">Vendor Dashboard</h1>
      <ul className="space-y-2">
        {products.map((p) => (
          <li key={p.id} className="border p-2 bg-white rounded">{p.name}</li>
        ))}
      </ul>
    </div>
  )
}
