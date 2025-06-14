import { Box, Card, CardContent, Typography, Grid, Link } from "@mui/material"

const DonorDashboard = () => {
  // Placeholder data for inventory summary
  const inventorySummary = {
    totalItems: 150,
    itemsNeedingRestock: 30,
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Donor Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Quick Link to Inventory Management */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Manage Inventory
              </Typography>
              <Link href="/inventory" variant="body2">
                Go to Inventory Management
              </Link>
            </CardContent>
          </Card>
        </Grid>

        {/* Inventory Summary Card */}
        {inventorySummary && (
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  Inventory Summary
                </Typography>
                <Typography variant="body2">Total Items: {inventorySummary.totalItems}</Typography>
                <Typography variant="body2">Items Needing Restock: {inventorySummary.itemsNeedingRestock}</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Add more dashboard cards here */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Donation History
              </Typography>
              <Typography variant="body2">View your past donations and contributions.</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export { DonorDashboard }
export default DonorDashboard
