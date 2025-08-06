import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { OrderItem } from './OrderItem';
import { orderService } from '../../../../../services/orderServices'; // adjust path as needed

const OrdersList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await orderService.getAllOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    loadOrders();
  }, []);

  return (
    <TableContainer>
      <Table sx={{ minWidth: 760 }}>
        <TableHead>
          <TableRow
            sx={{
              'th:first-child': {
                pl: 3,
              },
              'th:last-child': {
                pr: 3,
              },
            }}
          >
            <TableCell width={200}>Order No</TableCell>
            <TableCell width={200}>Amount</TableCell>
            <TableCell width={200}>Order Date</TableCell>
            <TableCell width={200}>Customer</TableCell>
            <TableCell width={120}>Status</TableCell>
            <TableCell width={140}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((item) => (
  <OrderItem key={item._id} item={item} />

          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};



export { OrdersList };
