import { Grid, Paper, Typography } from '@mui/material'
import { useSelector } from 'react-redux'

const Card = ({ title, value }) => (
  <Paper elevation={3} style={{ padding: 20 }}>
    <Typography variant="h6">{title}</Typography>
    <Typography variant="h4">{value}</Typography>
  </Paper>
)

export default function DashboardCards({ stats }) {
  console.log(stats)
  const { Total_Customers: users, Total_Vendors: vendors, Total_Products: products, Total_Orders: orders, Total_Amount: earnings } = stats
  const user = useSelector(store => store?.user)
  const role = user?.role
  return (
    <Grid container spacing={3} padding={3}
      sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: 2 }}
    >
      {role === "admin" &&
        <><Grid size={{ xs: 12, sm: 6, md: 3 }}><Card title="Users" value={users} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><Card title="Vendors" value={vendors} /></Grid>
        </>}
      {(role === "vendor" || role === 'admin') && (
        <>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><Card title="Products" value={products || 0} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><Card title="Orders" value={orders || 0} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><Card title="Earnings" value={`$${earnings || 0}`} /></Grid>
        </>
      )}
    </Grid>
  )
}
