
import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { OrdersList } from '../../_components/widgets/Orders/components/OrdersList';

const OrdersPage = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom marginBottom={4} >
        Orders Management
      </Typography>
      <Card>
        <CardContent>
          <OrdersList />
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrdersPage;