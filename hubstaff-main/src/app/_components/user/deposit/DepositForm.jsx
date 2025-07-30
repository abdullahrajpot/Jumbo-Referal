import React, { useState } from "react";
import { Box, Typography, TextField, Button, MenuItem, InputAdornment, Paper } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const paymentMethods = [
  { value: "credit_card", label: "Credit Card" },
  { value: "bank", label: "Bank" },
  { value: "easypaisa", label: "Easypaisa" },
  { value: "jazzcash", label: "JazzCash" },
];

const currencies = [
  { value: "USD", label: "USD" },
];

const DepositForm = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [method, setMethod] = useState("credit_card");
  const [message, setMessage] = useState("");
  const [commission, setCommission] = useState("0.00");
  const [netAmount, setNetAmount] = useState("0.00");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setCommission("0.00");
    setNetAmount("0.00");
    try {
      const res = await axios.post(
        `http://localhost:5001/api/users/deposit/${user.id || user._id}`,
        { amount: Number(amount), method, currency }
      );
      setMessage(res.data.message || "Deposit successful!");
      toast.success("Payment Deposit Successfully")

      setCommission(res.data.totalDistributed?.toFixed(2) || "0.00");
      setNetAmount((amount - (res.data.totalDistributed || 0)).toFixed(2));
      setAmount("");
    } catch (err) {
      setMessage(err.response?.data?.error || "Deposit failed.");
      toast.error("Deposit failed")

    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 6 }}>
      <Typography variant="h4" fontWeight={700} mb={2} sx={{ fontFamily: "cursive" }}>
        Deposit Money
      </Typography>
      <Paper sx={{ p: 4, borderRadius: 4, maxWidth: 450, width: "100%", background: "#f7fbfd" }}>
        <Typography variant="h5" align="center" mb={2} fontWeight={500}>
          Payer Details
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            fullWidth
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <TextField
                    select
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    variant="standard"
                    sx={{ minWidth: 60, background: "transparent" }}
                  >
                    {currencies.map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </TextField>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3, background: "#fff" }}
          />
          <TextField
            label="Payment Method"
            select
            value={method}
            onChange={e => setMethod(e.target.value)}
            fullWidth
            required
            sx={{ mb: 3, background: "#fff" }}
          >
            {paymentMethods.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
          <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography>Total Fees</Typography>
            <Typography>
              <span style={{ textDecoration: "line-through", color: "#888" }}>7.21 USD</span>
              <Button size="small" sx={{ ml: 1, background: "#0a4", color: "#fff", minWidth: 40, fontWeight: 700, borderRadius: 2, px: 2 }}>
                Free
              </Button>
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography fontWeight={600}>Commission Deducted</Typography>
            <Typography fontWeight={600}>{commission} {currency}</Typography>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Typography fontWeight={600}>Net Amount Received</Typography>
            <Typography fontWeight={600}>{netAmount} {currency}</Typography>
          </Box>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              background: "#11443a",
              color: "#fff",
              fontWeight: 700,
              fontSize: 18,
              py: 1.5,
              borderRadius: 2,
              border: "2px solid #b6ff00",
              boxShadow: "0 2px 8px #0001",
              "&:hover": { background: "#0a3327" }
            }}
          >
            CONTINUE
          </Button>
        </Box>
        {message && <Typography mt={2} color="green" align="center">{message}</Typography>}
      </Paper>
    </Box>
  );
};

export default DepositForm; 