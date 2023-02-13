import { Box, Typography, Stack } from "@pankod/refine-mui"
import { useList } from "@pankod/refine-core"

import {
  PieChart,
  PropertyReferrals,
  TotalRevenue,
  PropertyCard,
  TopAgent
} from "components"

const home = () => {
  return (
    <Box>
      <Typography fontSize={25} fontWeight={700} color="#11142d">
        Dashboard
      </Typography>

      <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
        <PieChart
          title="Properties for Sale"
          value={684}
          series={[75, 25]}
          colors={["#475be8", "#F7A9A8"]}
        />
        <PieChart
          title="Properties for Rent"
          value={550}
          series={[60, 40]}
          colors={["#475be8", "#F7A9A8"]}
        />
        <PieChart
          title="Total Customers"
          value={5512}
          series={[75, 25]}
          colors={["#475be8", "#F7A9A8"]}
        />
        <PieChart
          title="Total Cities"
          value={637}
          series={[75, 25]}
          colors={["#475be8", "#F7A9A8"]}
        />
      </Box>

      <Stack
        mt="25px"
        width="100%"
        direction={{
          xs: "column",
          lg: "row"
        }}
        gap={4}
      >
        <TotalRevenue />
        <PropertyReferrals />
      </Stack>
    </Box>
  )
}

export default home
