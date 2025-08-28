import { Grid, Paper, Typography } from '@mui/material'
import { useSelector } from 'react-redux'

const Card = ({ title, value }) => (
  <Paper elevation={3} style={{ padding: 20 }}>
    <Typography variant="h6">{title}</Typography>
    <Typography variant="h4">{value}</Typography>
  </Paper>
)

export default function DashboardCards({ stats }) {
  // console.log(stats)
  const { Total_Customers: users = 0, Total_Vendors: vendors = 0, Total_Products: products = 0, Total_Orders: orders = 0, Total_Amount: earnings = 0, Total_Revenue: vendorRevenue = 0, Total_Ordered_Items: vendorTotalOrder = 0 } = stats
  const user = useSelector(store => store?.user)
  const role = user?.role
  return (
    <Grid container spacing={3} padding={3}
      sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: 2 }}
    >
      {role === "admin" &&
        <><Grid size={{ xs: 12, sm: 6, md: 3 }}><Card title="Users" value={users || 0} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><Card title="Vendors" value={vendors || 0} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><Card title="Orders" value={orders || 0} /></Grid>

        </>}
      {(role === "vendor" || role === 'admin') && (
        <>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><Card title="Products" value={products || 0} /></Grid>
          {role === 'vendor' && <Grid size={{ xs: 12, sm: 6, md: 3 }}><Card title="Total Ordered Items" value={vendorTotalOrder || 0} /></Grid>}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><Card title="Earnings" value={`$${earnings || vendorRevenue || 0}`} /></Grid>
        </>
      )}
    </Grid>
  )
}
