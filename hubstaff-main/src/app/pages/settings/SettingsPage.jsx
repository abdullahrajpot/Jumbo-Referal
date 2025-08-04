import React, { useState, useEffect } from 'react';
import { Container, Typography, Stack, Paper, Alert, CircularProgress, Box } from '@mui/material';
import TwoFactorSettings from '../../_components/settings/TwoFactorSettings';
import axios from 'axios';
import { useAuth } from '@app/_components/_core/AuthProvider/hooks';

const SettingsPage = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Safe function to get user from localStorage
  const getLocalUser = () => {
    try {
      const userString = localStorage.getItem("user");
      console.log('Raw localStorage value:', userString);
      console.log('Type of localStorage value:', typeof userString);
      
      // Handle null, undefined, or empty string
      if (!userString || userString === "undefined" || userString === "null" || userString === "") {
        console.log('Invalid localStorage value, returning empty object');
        return {};
      }
      
      const parsed = JSON.parse(userString);
      console.log('Successfully parsed localStorage user:', parsed);
      return parsed;
    } catch (error) {
      console.error('Error parsing localStorage user:', error);
      console.error('Problematic value was:', localStorage.getItem("user"));
      // Clear the invalid localStorage data
      localStorage.removeItem("user");
      return {};
    }
  };

  useEffect(() => {
    console.log('=== SettingsPage useEffect Debug ===');
    
    // Try to get user from localStorage first (like ProfileSettings does)
    const localUser = getLocalUser();
    console.log('Local user from localStorage:', localUser);
    console.log('Auth user from context:', authUser);
    
    // Determine which user ID to use
    const userId = authUser?.id || authUser?._id || localUser?.id || localUser?._id;
    console.log('Determined userId:', userId);
    
    if (userId) {
      console.log('Fetching user data with ID:', userId);
      fetchUserData(userId);
    } else if (localUser && Object.keys(localUser).length > 0) {
      console.log('Using local user data directly');
      // If we have local user data but no ID, use it directly
      setUser(localUser);
      setLoading(false);
    } else {
      console.log('No user data available');
      // If no user data available
      setLoading(false);
      setError('No authenticated user found. Please log in again.');
    }
  }, [authUser]);

  const fetchUserData = async (userId) => {
    try {
      console.log('=== fetchUserData Debug ===');
      console.log('Fetching user data for ID:', userId);
      console.log('User ID type:', typeof userId);
      console.log('User ID length:', userId?.length);
      console.log('User ID value:', JSON.stringify(userId));
      
      // Validate userId before making the request
      if (!userId) {
        throw new Error('User ID is null or undefined');
      }
      
      const url = `http://localhost:5001/api/users/user/${userId}`;
      console.log('Making API call to:', url);
      
      // Fixed: Use userId instead of userid (case sensitivity)
      const response = await axios.get(url);
      
      console.log('User data response status:', response.status);
      console.log('User data response:', response.data);
      
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setError('');
        console.log('Successfully set user data');
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('=== fetchUserData Error ===');
      console.error('Failed to fetch user data:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // Fallback to localStorage user if API call fails
      const localUser = getLocalUser();
      if (localUser && Object.keys(localUser).length > 0) {
        console.log('Using fallback localStorage user');
        setUser(localUser);
        setError('Using cached user data (API call failed)');
      } else {
        setError(`Failed to load user data: ${error.response?.data?.error || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUserUpdate = (updatedUser) => {
    console.log('Updating user:', updatedUser);
    setUser(updatedUser);
    // Also update localStorage to keep it in sync
    const localUser = getLocalUser();
    const updatedLocalUser = { ...localUser, ...updatedUser };
    localStorage.setItem("user", JSON.stringify(updatedLocalUser));
  };

  // Get user ID for TwoFactorSettings component
  const getUserId = () => {
    const id = user?.id || user?._id || authUser?.id || authUser?._id;
    console.log('Getting user ID:', id);
    return id;
  };

  // Validate if the ID looks like a MongoDB ObjectId
  const isValidObjectId = (id) => {
    return id && typeof id === 'string' && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id);
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <Stack spacing={2} alignItems="center">
            <CircularProgress />
            <Typography>Loading settings...</Typography>
          </Stack>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Stack spacing={4} sx={{ py: 4 }}>
          <Typography variant="h4" component="h1">
            Account Settings
          </Typography>
          <Alert severity="error">
            {error}
          </Alert>
          <Typography variant="body2">
            Debug info: Auth user ID = {authUser?.id || authUser?._id || 'undefined'}, 
            Local storage user ID = {getLocalUser()?.id || getLocalUser()?._id || 'undefined'}
          </Typography>
        </Stack>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md">
        <Stack spacing={4} sx={{ py: 4 }}>
          <Typography variant="h4" component="h1">
            Account Settings
          </Typography>
          <Alert severity="warning">
            User data not found. Please try refreshing the page.
          </Alert>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Stack spacing={4} sx={{ py: 4 }}>
        <Typography variant="h4" component="h1">
          Account Settings
        </Typography>
        
       
        
        <Paper sx={{ p: 0 }}>
          <TwoFactorSettings 
            userId={getUserId()} 
            user={user}
            onUserUpdate={handleUserUpdate}
          />
        </Paper>
      </Stack>
    </Container>
  );
};

export default SettingsPage;