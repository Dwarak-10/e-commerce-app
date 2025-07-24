import { Grid, Paper, Typography } from '@mui/material'

const Card = ({ title, value }) => (
  <Paper elevation={3} style={{ padding: 20 }}>
    <Typography variant="h6">{title}</Typography>
    <Typography variant="h4">{value}</Typography>
  </Paper>
)

export default function DashboardCards() {
  return (
    <Grid container spacing={3} padding={3}>
      <Grid  size={{ xs:12, sm:6, md:3}}><Card title="Users" value="120" /></Grid>
      <Grid  size={{ xs:12, sm:6, md:3}}><Card title="Orders" value="58" /></Grid>
      <Grid  size={{ xs:12, sm:6, md:3}}><Card title="Vendors" value="10" /></Grid>
      <Grid  size={{ xs:12, sm:6, md:3}}><Card title="Earnings" value="$3.2k" /></Grid>
    </Grid>
  )
}
