import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const DashboardCard = ({ title, value, icon }) => (
  <Card sx={{ minWidth: 200, borderRadius: 3, boxShadow: 2, m: 1 }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={1}>
        {icon && <Box mr={1}>{icon}</Box>}
        <Typography variant="h6" fontWeight={600}>{title}</Typography>
      </Box>
      <Typography variant="h4" fontWeight={700}>{value} $</Typography>
    </CardContent>
  </Card>
);

export default DashboardCard; 