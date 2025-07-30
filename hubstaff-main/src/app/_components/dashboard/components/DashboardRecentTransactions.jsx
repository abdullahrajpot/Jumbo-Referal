import React from "react";
import { Paper, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const DashboardRecentTransactions = ({ transactions }) => (
  <Paper sx={{ p: 3, borderRadius: 3, height: 340, overflow: "auto" }}>
    <Typography variant="h6" mb={2}>Recent Transactions</Typography>
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.slice().reverse().slice(0, 7).map((tx, idx) => (
            <TableRow key={tx._id || idx}>
              <TableCell>{tx.date ? new Date(tx.date).toLocaleDateString() : ""}</TableCell>
              <TableCell align="right">{tx.amount}</TableCell>
            </TableRow>
          ))}
          {transactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} align="center">No transactions found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

export default DashboardRecentTransactions; 