import React, { useEffect, useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PersonIcon from '@mui/icons-material/Person';
import axios from "axios";
import {
  DashboardWelcome,
  DashboardCard,
  DashboardGraph,
  DashboardRecentTransactions,
  DashboardTransactionTable
} from "./components";
import { Spinner } from "@app/_shared";
import { CartProvider, PopularProducts, CartWidget } from "@app/_components/widgets/Products";

const Dashboard = () => {
  const localUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [user, setUser] = useState(localUser);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndTransactions = async () => {
      try {
        const userRes = await axios.get(`http://localhost:5001/api/users/user/${localUser.id || localUser._id}`);
        setUser(userRes.data.user);
        const txRes = await axios.get(`http://localhost:5001/api/users/user/${localUser.id || localUser._id}/transactions`);
        setTransactions(txRes.data.transactions || []);
      } catch (err) {
        setUser(localUser);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndTransactions();
  }, [localUser.id, localUser._id]);

  if (loading) return <Spinner/>;

  const wallet = user.wallet || 0;
  const totalDeposits = user.totalDeposits || 0;
  const avatar = user.profile_pic || "https://i.pravatar.cc/100?img=3";

  // Prepare data for the graph (last 7 transactions)
  const chartData = transactions.slice(-7).map((tx, idx) => ({
    name: tx.date ? new Date(tx.date).toLocaleDateString() : `Tx ${idx + 1}`,
    amount: tx.amount,
  }));

  return (
    <Box sx={{ p: 4 }}>
      <DashboardWelcome avatar={avatar} name={user.name} />
      <Grid container spacing={3} mb={2}>
        <Grid item xs={12} md={6} lg={4}>
          <DashboardCard
            title="Wallet"
            value={wallet.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            icon={<AccountBalanceWalletIcon fontSize="large" sx={{ color: "#1976d2" }} />}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <DashboardCard
            title="Total Deposits"
            value={totalDeposits.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            icon={<MonetizationOnIcon fontSize="large" sx={{ color: "#43a047" }} />}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <DashboardCard
            title="Profile"
            value={user.email}
            icon={<PersonIcon fontSize="large" sx={{ color: "#fbc02d" }} />}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <DashboardGraph chartData={chartData} />
        </Grid>
        <Grid item xs={12} lg={4}>
          <DashboardRecentTransactions transactions={transactions} />
        </Grid>
        <Grid item xs={12}>
          <DashboardTransactionTable transactions={transactions} />
        </Grid>
      </Grid>
      
    </Box>
  );
};

export default Dashboard; 