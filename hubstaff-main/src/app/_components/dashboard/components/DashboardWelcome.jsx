import React from "react";
import { Paper, Box, Avatar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const DashboardWelcome = ({ avatar, name }) => {
  const navigate = useNavigate(); // <-- Move this inside the component

  const handleDeposit = () => {
    navigate("/user/deposit");
  };

  return (
    <Paper
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 4,
        background: "linear-gradient(90deg,rgb(130, 40, 213) 0%,rgb(182, 35, 245) 100%)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}
      elevation={3}
    >
      <Box display="flex" alignItems="center">
        <Avatar src={avatar} sx={{ width: 64, height: 64, mr: 2, border: "3px solid #fff" }} />
        <Box>
          <Typography variant="h5" fontWeight={700}>Welcome, {name || "User"}!</Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Here’s your financial overview.
          </Typography>
        </Box>
      </Box>
      <Button onClick={handleDeposit} variant="contained" color="secondary" sx={{ fontWeight: 700, borderRadius: 2 }}>
        Deposit Now
      </Button>
    </Paper>
  );
};

export default DashboardWelcome;