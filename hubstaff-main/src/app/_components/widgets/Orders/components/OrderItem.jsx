import {
  MenuItem,
  Select,
  Chip,
  Stack,
  TableCell,
  TableRow,
  Collapse,
  Box,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableHead,
} from '@mui/material';
import { useState } from 'react';
import { orderService } from '../../../../../services/orderServices';
import { toast } from 'react-toastify';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const OrderItem = ({ item }) => {
  const [status, setStatus] = useState(item.status);
  const [open, setOpen] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    try {
      await orderService.updateOrderStatus(item._id, newStatus);
      toast.success("Status Updated");
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error("Error in updating Status");
    }
  };

  return (
    <>
      {/* Main Row */}
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>{' '}
          {item._id?.slice(-6).toUpperCase() || 'N/A'}
        </TableCell>
        <TableCell>${item.totalAmount?.toFixed(2)}</TableCell>
        <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
        <TableCell>{item.userId?.name || 'N/A'}</TableCell>
        <TableCell>
          <Select
            size="small"
            value={status}
            onChange={handleStatusChange}
            sx={{ textTransform: 'capitalize' }}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="processing">Processing</MenuItem>
            <MenuItem value="shipped">Shipped</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </TableCell>
        <TableCell>
          <Stack direction="row" spacing={2}>
            <Chip label={status} size="small" color={getStatusColor(status)} />
          </Stack>
        </TableCell>
      </TableRow>

      {/* Collapsible Row */}
      <TableRow>
        <TableCell colSpan={6} sx={{ py: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Order Items
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Sale Price</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {item.items.map((prod, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{prod.name}</TableCell>
                      <TableCell>{prod.quantity}</TableCell>
                      <TableCell>${prod.salePrice.toFixed(2)}</TableCell>
                      <TableCell>${(prod.salePrice * prod.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'delivered':
      return 'success';
    case 'processing':
      return 'primary';
    case 'shipped':
      return 'info';
    case 'cancelled':
      return 'error';
    default:
      return 'warning';
  }
};

export { OrderItem };
