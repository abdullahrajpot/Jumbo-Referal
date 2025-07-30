import React, { useState } from "react";
import { Avatar, Button, Grid, TextField, Typography, Box, IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import axios from "axios";

const ProfileSettings = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: user.name || "",
    email: user.email || "",
    referralCode: user.referralCode || "",
    profile_pic: user.profile_pic || "",
    _id: user.id || user._id, // ensure you have the user id
  });
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyReferral = () => {
    if (profile.referralCode) {
      navigator.clipboard.writeText(profile.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const referralLink = profile.referralCode
    ? `${window.location.origin}/auth/signup-1?ref=${profile.referralCode}`
    : "";

  const handleCopyReferralLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 1500);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEditMode(true);

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5001/api/users/update/${profile._id}`,
        { name: profile.name }
      );
      // Update localStorage and exit edit mode
      localStorage.setItem("user", JSON.stringify({ ...user, name: res.data.user.name }));
      setEditMode(false);
      window.location.reload(); // Optionally reload to update all UI
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  return (
    <Box sx={{ p: 4, background: "#fff", borderRadius: 3, boxShadow: 1 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={2}>
          <Avatar src={profile.profile_pic} sx={{ width: 80, height: 80, mb: 2 }} />
        </Grid>
        <Grid item xs={12} sm={7}>
          <Typography variant="h5">{profile.name}</Typography>
          <Typography color="text.secondary">{profile.email}</Typography>
        </Grid>
        <Grid item xs={12} sm={3} textAlign="right">
          {!editMode ? (
            <Button variant="contained" onClick={handleEdit}>Edit</Button>
          ) : (
            <Button variant="contained" color="success" onClick={handleSave}>Save</Button>
          )}
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Full Name"
            name="name"
            value={profile.name}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            name="email"
            value={profile.email}
            fullWidth
            disabled
          />
        </Grid>
        {/* Referral Link Field */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Referral Link"
            value={referralLink}
            fullWidth
            disabled
            InputProps={{
              endAdornment: referralLink && (
                <Tooltip title={copiedLink ? "Copied!" : "Copy Referral Link"}>
                  <IconButton onClick={handleCopyReferralLink} edge="end">
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )
            }}
          />
        </Grid>
      </Grid>
      <Box mt={4}>
        <Typography variant="h6">My email Address</Typography>
        <Box display="flex" alignItems="center" mt={1}>
          <Avatar sx={{ width: 32, height: 32, mr: 1 }}>{profile.email ? profile.email[0] : "U"}</Avatar>
          <Box>
            <Typography>{profile.email}</Typography>
            {/* <Typography variant="caption" color="text.secondary">1 month ago</Typography> */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileSettings; 