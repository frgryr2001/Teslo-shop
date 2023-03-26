import React from 'react';
import { GetServerSideProps } from 'next';
import { ShopLayout } from '../../components/layouts';
import { Chip, Grid, Typography, Link } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import NextLink from 'next/link';
import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces/order';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullname', headerName: 'Fullname', width: 300 },
  {
    field: 'paid',
    headerName: 'Paid',
    width: 200,
    description: 'Status of payment',
    renderCell: (params: GridRenderCellParams<any, any, any>) => {
      return params.row.paid ? (
        <Chip label="Paid" color="success" variant="outlined" />
      ) : (
        <Chip label="No paid" color="error" variant="outlined" />
      );
    },
  },
  {
    field: 'Order',
    headerName: 'View orders',
    width: 200,
    sortable: false,
    description: 'Order of payment',
    renderCell: (params: GridRenderCellParams<any, any, any>) => {
      return (
        <NextLink
          href={`/orders/${params.row.orderId}`}
          passHref
          legacyBehavior
        >
          <Link underline="always">View order</Link>
        </NextLink>
      );
    },
  },
];

const rows = [
  { id: 1, paid: false, fullname: 'Nguyen Van A' },
  { id: 2, paid: true, fullname: 'Nguyen Van B' },
  { id: 3, paid: true, fullname: 'Nguyen Van C' },
  { id: 4, paid: false, fullname: 'Nguyen Van D' },
];

interface Props {
  orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {
  const rows = orders.map((order, index) => {
    return {
      id: index + 1,
      paid: order.isPaid,
      fullname:
        `${order.ShippingAddress.firstName}` +
        `${order.ShippingAddress.lastName}`,
      orderId: order._id,
    };
  });
  return (
    <ShopLayout
      title={'Order history '}
      pageDescription={'Order history of customer'}
    >
      <Typography variant="h1" component={'h1'}>
        Order History
      </Typography>

      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // your fetch function here

  const session: any = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: 'auth/login?p=/orders/history',
        permanent: false,
      },
    };
  }

  const orders = await dbOrders.getOrderByUser(session.user._id);

  return {
    props: {
      orders,
    },
  };
};

export default HistoryPage;
