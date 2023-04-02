import {
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Box,
  Chip,
} from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import { CartList, OrderSummary } from '../../../components/cart';
import { AdminLayout } from '../../../components/layouts/AdminLayout';
import {
  AirplaneTicketOutlined,
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from '@mui/icons-material';
import { dbOrders } from '../../../database';
import { IOrder } from '../../../interfaces/order';

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const { ShippingAddress } = order;

  return (
    <AdminLayout
      title={'Order Summary'}
      pageDescription={`Order ${order._id}`}
      icon={<AirplaneTicketOutlined />}
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
                <Box display={'flex'} flexDirection={'column'}>
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
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = '' } = query;

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: '/admin/orders',
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
