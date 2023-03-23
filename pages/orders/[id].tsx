import {
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Box,
  Link,
  Chip,
} from '@mui/material';

import { GetServerSideProps, NextPage } from 'next';
import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import NextLink from 'next/link';
import { getSession } from 'next-auth/react';
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from '@mui/icons-material';
import { dbOrders } from '../../database';
import { IOrder, ShippingAddress } from '../../interfaces/order';

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const { ShippingAddress } = order;
  return (
    <ShopLayout title={'Order Summary'} pageDescription={'Order Summary'}>
      <Typography variant="h1" component={'h1'}>
        Order : {order._id}
      </Typography>
      {order.isPaid ? (
        <Chip
          sx={{ my: 2 }}
          label="Paid"
          variant="outlined"
          color="success"
          icon={<CreditScoreOutlined />}
        />
      ) : (
        <Chip
          sx={{ my: 2 }}
          label="Pending"
          variant="outlined"
          color="error"
          icon={<CreditCardOffOutlined />}
        />
      )}

      <Grid container>
        <Grid item xs={12} sm={7}>
          {/* CartList */}
          <CartList products={order.orderItems} />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">
                Summary ({order.numberOfItems}{' '}
                {order.numberOfItems > 1 ? 'items' : 'item'})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Address delivery</Typography>
              </Box>

              <Typography>
                {ShippingAddress.firstName} {ShippingAddress.lastName}
              </Typography>
              <Typography>
                {ShippingAddress.address}{' '}
                {ShippingAddress.address2
                  ? `, ${ShippingAddress.address2}`
                  : ''}{' '}
              </Typography>
              <Typography>
                {ShippingAddress.city}, {ShippingAddress.zip}
              </Typography>
              <Typography>{ShippingAddress.country}</Typography>
              <Typography>{ShippingAddress.phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <OrderSummary />
              <Box sx={{ mt: 3 }}>
                <h1>Pay</h1>
                <Chip
                  sx={{ my: 2 }}
                  label="Paid"
                  variant="outlined"
                  color="success"
                  icon={<CreditScoreOutlined />}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = '' } = query;
  const session: any = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      },
    };
  }
  const order = await dbOrders.getOrderById(id.toString());
  console.log({ order });

  if (!order) {
    return {
      redirect: {
        destination: '/orders/history',
        permanent: false,
      },
    };
  }

  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: '/orders/history',
        permanent: false,
      },
    };
  }

  return {
    props: {
      order,
    },
  };
};

export default OrderPage;
