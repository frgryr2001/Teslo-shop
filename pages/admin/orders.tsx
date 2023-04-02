import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { Chip, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';
import { AdminLayout } from '../../components/layouts';
import useSWR from 'swr';
import { IOrder } from '../../interfaces/order';
import { IUser } from '../../interfaces/user';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Order Id', width: 250 },
  { field: 'email', headerName: 'Email', width: 250 },
  { field: 'name', headerName: 'Name', width: 300 },
  { field: 'total', headerName: 'Total', width: 300 },
  {
    field: 'isPaid',
    headerName: 'Paid',
    renderCell: ({ row }: GridRenderCellParams) => {
      return row.isPaid ? (
        <Chip variant="outlined" label={'Paid'} color="success" />
      ) : (
        <Chip variant="outlined" label={'No paid'} color="error" />
      );
    },
  },
  {
    field: 'noProducts',
    headerName: 'Quantity',
    align: 'center',
  },
  {
    field: 'check',
    headerName: 'View orders',
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
          View orders
        </a>
      );
    },
  },
  { field: 'createAt', headerName: 'Create At', width: 300 },
];

const OrderPage = () => {
  const { data, error } = useSWR<IOrder[]>('/api/admin/orders');
  console.log(data);

  if (!data && !error) return <></>;

  const rows = data!.map((order) => {
    return {
      id: order._id,
      email: (order.user as IUser)?.email,
      name: (order.user as IUser)?.name,
      total: '$' + order.total,
      isPaid: order.isPaid,
      noProducts: order.numberOfItems, // quantity
      createAt: new Date(order.createdAt || '').toLocaleDateString(), // createAt to date format (new Date(order.createdAt).toLocaleDateString())
    };
  });

  return (
    <AdminLayout
      title={'Orders'}
      pageDescription={'Orders management'}
      icon={<ConfirmationNumberOutlined />}
    >
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default OrderPage;
