import React from "react";
import { Paper, Typography } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const DashboardGraph = ({ chartData }) => (
  <Paper sx={{
    p: 3,
    borderRadius: 3,
    height: 340,
    background: "linear-gradient(120deg, #e3f2fd 0%, #fff 100%)"
  }}>
    <Typography variant="h6" mb={2}>Deposit History</Typography>
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="amount" stroke="#1976d2" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </Paper>
);

export default DashboardGraph; 