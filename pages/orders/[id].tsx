import {
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Box,
  Link,
  Chip,
  CircularProgress,
} from '@mui/material';

import { GetServerSideProps, NextPage } from 'next';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from '@mui/icons-material';
import { dbOrders } from '../../database';
import { IOrder, ShippingAddress } from '../../interfaces/order';
import { requestApi } from '../../api';

interface Props {
  order: IOrder;
}

export type OrderResponseBody = {
  id: string;
  status:
    | 'CREATED'
    | 'SAVED'
    | 'APPROVED'
    | 'VOIDED'
    | 'COMPLETED'
    | 'PAYER_ACTION_REQUIRED';
};

const OrderPage: NextPage<Props> = ({ order }) => {
  const { ShippingAddress } = order;
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);

  const onOrderComplete = async (detail: OrderResponseBody) => {
    if (detail.status !== 'COMPLETED') {
      return alert('Payment failed');
    }
    setIsPaying(true);

    try {
      const { data } = await requestApi.post(`orders/pay`, {
        orderId: order._id,
        transactionId: detail.id,
      });
      router.reload();
    } catch (error) {
      setIsPaying(false);
      console.log(error);
      alert('Something went wrong');
    }
  };
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

      <Grid container className="fadeIn">
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

              <OrderSummary
                orderValues={{
                  numberOfItems: order.numberOfItems,
                  subTotal: order.subTotal,
                  tax: order.tax,
                  total: order.total,
                }}
              />
              <Box sx={{ mt: 3 }} display="flex" flexDirection={'column'}>
                <Box
                  display={'flex'}
                  justifyContent="center"
                  className="fadeIn"
                  sx={{ display: isPaying ? 'flex' : 'none' }}
                >
                  <CircularProgress />
                </Box>
                <Box
                  flexDirection={'column'}
                  sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }}
                >
                  {order.isPaid ? (
                    <Chip
                      sx={{ my: 2 }}
                      label="Paid"
                      variant="outlined"
                      color="success"
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: `${order.total}`,
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order!.capture().then((details) => {
                          onOrderComplete(details);
                          // const name = details.payer.name!.given_name;
                          // alert(`Transaction completed by ${name}`);
                        });
                      }}
                    />
                  )}
                </Box>
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

  if (!order) {
    return {
      redirect: {
        destination: '/orders/history',
        permanent: false,
      },
    };
  }

  if (order.user !== session.user.id) {
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
