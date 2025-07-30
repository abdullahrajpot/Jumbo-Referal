import React from "react";
import { Paper, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const DashboardTransactionTable = ({ transactions }) => (
  <Paper sx={{ p: 3, borderRadius: 3, mt: 3 }}>
    <Typography variant="h6" mb={2}>All Transaction Details</Typography>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Commission</TableCell>
            <TableCell>Net Amount</TableCell>
            <TableCell>Method</TableCell>
            <TableCell>Transaction ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.slice().reverse().map((tx, idx) => (
            <TableRow key={tx._id || idx}>
              <TableCell>{tx.date ? new Date(tx.date).toLocaleString() : ""}</TableCell>
              <TableCell>{tx.amount}</TableCell>
              <TableCell>{tx.commission}</TableCell>
              <TableCell>{tx.netAmount}</TableCell>
              <TableCell>{tx.method}</TableCell>
              <TableCell>{tx._id}</TableCell>
            </TableRow>
          ))}
          {transactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center">No transactions found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

export default DashboardTransactionTable; 