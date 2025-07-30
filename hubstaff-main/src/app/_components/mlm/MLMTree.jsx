import React, { useEffect, useState } from "react";
import { MLMTreeGraph } from "./components";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import { Spinner } from "@app/_shared";

const MLMTree = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/mlm-tree/${user.id || user._id}`);
        setTree(res.data);
      } catch (err) {
        setTree(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTree();
  }, [user.id, user._id]);

  if (loading) return <Spinner />;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" fontWeight={700} mb={3}>My MLM Tree</Typography>
      <MLMTreeGraph treeData={tree} />
    </Box>
  );
};

export default MLMTree; 