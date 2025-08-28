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


const fetchCustomers = async () => {
    const { data } = await api.get("/api/admin/customers/")
    // console.log("Customers data:", data)
    return data
}

const AdminUsers = () => {
    const { data: customers, isLoading: isCustomerLoading, isError: isCustomerError } = useQuery({
        queryKey: ["customers"],
        queryFn: fetchCustomers,
    })

    const [searchTerm, setSearchTerm] = useState('')
    const [filteredCustomers, setFilteredCustomers] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const customersPerPage = 5

    // Filter logic
    useEffect(() => {
        const filtered = customers?.filter((c) =>
            [c.username, c.email, c?.company_name].some((field) =>
                (field || "").toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        setFilteredCustomers(filtered)
        setCurrentPage(1)
    }, [customers, searchTerm])

    //  Pagination logic
    const indexOfLastCustomer = currentPage * customersPerPage
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage
    const currentCustomers = filteredCustomers?.slice(indexOfFirstCustomer, indexOfLastCustomer)
    const totalPages = Math.ceil(filteredCustomers?.length / customersPerPage)

    const handlePageChange = (event, value) => {
        setCurrentPage(value)
    }

    if (isCustomerLoading) {
        return (
            <div className="flex justify-center items-center h-screen w-screen">
                <CircularProgress />
            </div>
        )
    }

    if (isCustomerError) {
        return <div className="text-center text-red-500">Failed to fetch customers.</div>
    }

    return (
        <div className="m-6 bg-white p-6 rounded-lg shadow w-[80%] mx-auto">
            <Typography variant="h5" className="font-semibold" sx={{ mb: 4 }}>
                Customer List
            </Typography>

            <TextField
                fullWidth
                label="Search by name"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 4 }}
            />

            {currentCustomers?.length === 0 ? (
                <p className="text-gray-500">No customers found.</p>
            ) : (
                <div className="space-y-4">
                    {currentCustomers?.map((customer, index) => (
                        <Card key={customer.id} className="shadow-sm flex  justify-between items-center p-2">
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                                {/* <div className="flex flex-col gap-2"> */}
                                <div className='flex gap-2'>
                                    <Typography variant="h6"> {((currentPage - 1) * customersPerPage) + index + 1 + "."}</Typography>
                                    <div>
                                        <Typography variant="h6">Name: {customer.username}</Typography>

                                        <Typography variant="body2" color="textSecondary">
                                            Email: {customer.email}
                                        </Typography>
                                    </div>

                                </div>

                                {/* </div> */}
                            </CardContent>
                            
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

export default AdminUsers
