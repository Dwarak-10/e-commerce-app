
import { useQuery } from "@tanstack/react-query"
import api from "../utlis/api"
import ProductCard from "../components/ProductCard"

const loggedInVendorId = "v2"

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
      <ul className="flex flex-wrap gap-10">
        {products.map((p) => (
          <ProductCard key={p.id} product={p}/>
        ))}
      </ul>
    </div>
  )
}
