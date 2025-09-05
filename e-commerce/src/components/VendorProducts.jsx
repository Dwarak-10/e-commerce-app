import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../utlis/api";
import ProductCard from "./ProductCard";
import { Box, Button, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";

const fetchVendorProducts = async (vendorId, page, pageSize) => {
  const { data } = await api.get(
    `/api/admin/vendors/${vendorId}/?page-num=${page}&page-size=${pageSize}`
  );
  console.log("Vendor products data:", data);
  return data;
};

export default function VendorProducts() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const { vendorId } = useParams();

  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", vendorId, page, pageSize],
    queryFn: () => fetchVendorProducts(vendorId, page, pageSize),
    keepPreviousData: true,
    enabled: !!vendorId,
  });


  useEffect(() => {
    setPage(1);
  }, [vendorId]);


  const results = products?.results || [];
  const current_page = products?.current_page || 1;
  const total_pages = products?.total_pages || 1;

  const handlePrev = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, total_pages));

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <CircularProgress />
      </div>
    );

  if (isError) return <p>Error loading products</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        Products for Vendor ID: {vendorId}
      </h2>

      {results.length === 0 && (
        <Box sx={{ p: 2, textAlign: "center" }}>
          No products found for this vendor.
        </Box>
      )}

      <ul className="flex flex-wrap gap-10">
        {results.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>

      <Box display="flex" justifyContent="center" alignItems="center" mt={3} gap={2}>
        <Button variant="outlined" onClick={handlePrev} disabled={!products?.previous}>
          Previous
        </Button>
        <span>
          Page {current_page} of {total_pages}
        </span>
        <Button variant="outlined" onClick={handleNext} disabled={!products?.next}>
          Next
        </Button>
      </Box>
    </div>
  );
}
