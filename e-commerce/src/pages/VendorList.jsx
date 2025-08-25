import { useQuery } from '@tanstack/react-query'
import api from '../utlis/api'
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Pagination,
    CircularProgress,
    CardActions,
    Button,
} from '@mui/material'
import { useEffect, useState } from 'react'


const fetchVendors = async () => {
    const { data } = await api.get("/api/admin/vendors/")
    // console.log("Vendors data:", data)
    return data
}

const VendorList = () => {
    const { data: vendors, isLoading: isVendorLoading, isError: isVendorError } = useQuery({
        queryKey: ["vendors"],
        queryFn: fetchVendors,
    })

    const [searchTerm, setSearchTerm] = useState('')
    const [filteredVendors, setFilteredVendors] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const vendorsPerPage = 5

    // Filter logic
    useEffect(() => {
        const filtered = vendors?.filter((v) =>
            [v.username, v.email, v?.company_name].some((field) =>
                (field || "").toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        setFilteredVendors(filtered)
        setCurrentPage(1)
    }, [vendors, searchTerm])

    //  Pagination logic
    const indexOfLastVendor = currentPage * vendorsPerPage
    const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage
    const currentVendors = filteredVendors?.slice(indexOfFirstVendor, indexOfLastVendor)
    const totalPages = Math.ceil(filteredVendors?.length / vendorsPerPage)

    const handlePageChange = (event, value) => {
        setCurrentPage(value)
    }

    if (isVendorLoading) {
        return (
            <div className="flex justify-center items-center h-screen w-screen">
                <CircularProgress />
            </div>
        )
    }

    if (isVendorError) {
        return <div className="text-center text-red-500">Failed to fetch vendors.</div>
    }

    return (
        <div className="m-6 bg-white p-6 rounded-lg shadow w-[80%] mx-auto">
            <Typography variant="h5" className="font-semibold" sx={{ mb: 4 }}>
                Vendor List
            </Typography>

            <TextField
                fullWidth
                label="Search by name, email or company"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 4 }}
            />

            {currentVendors?.length === 0 ? (
                <p className="text-gray-500">No vendors found.</p>
            ) : (
                <div className="space-y-4">
                    {currentVendors?.map((vendor, index) => (
                        <Card key={vendor.id} className="shadow-sm flex  justify-between items-center p-4">
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                                {/* <div className="flex flex-col gap-2"> */}
                                    <div className='flex gap-2'>
                                        <Typography variant="h6"> {((currentPage - 1) * vendorsPerPage) + index + 1 + "."}</Typography>
                                        <div>
                                            <Typography variant="h6">Name: {vendor.username}</Typography>

                                            <Typography variant="body2" color="textSecondary">
                                                Email: {vendor.email}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Phone: {vendor.phone || 'N/A'}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Company: {vendor.company_name || 'N/A'}
                                            </Typography>
                                        </div>

                                    </div>

                                {/* </div> */}
                            </CardContent>
                            <CardActions>
                                <Button
                                    href={`/admin/vendor/${vendor.id}/analytics`}
                                    sx={{
                                        color: 'white',
                                        backgroundColor: '#43a047',
                                        textTransform: 'none',
                                        '&:hover': { backgroundColor: '#2e7d32' },
                                    }}
                                    size="medium"
                                >
                                    Analytics
                                </Button>
                                <Button
                                    href={`/admin/vendor/${vendor.id}`}
                                    sx={{
                                        color: 'white',
                                        backgroundColor: '#1976d2',
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: '#125ea6'
                                        }
                                    }}
                                    size="medium"
                                >
                                    View Products
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </div>
            )}
        </div>
    )
}

export default VendorList
