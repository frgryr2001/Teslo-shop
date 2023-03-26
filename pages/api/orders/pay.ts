import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { IPayPal } from '../../../interfaces';
import { db } from '../../../database';
import { Order } from '../../../models';

type Data = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'POST':
      return payOrder(req, res);

    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const getPaypalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

  // Base64 encode the client ID and secret
  const base64token = Buffer.from(
    `${PAYPAL_CLIENT}:${PAYPAL_SECRET}`,
    'utf-8'
  ).toString('base64');

  const body = new URLSearchParams('grant_type=client_credentials');

  try {
    const { data } = await axios.post(
      process.env.PAYPAL_OAUTH_URL || '',
      body,
      {
        headers: {
          Authorization: `Basic ${base64token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
    } else {
      console.log(error);
    }
    return null;
  }
};

async function payOrder(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const paypalBearerToken = await getPaypalBearerToken();
    if (!paypalBearerToken) {
      return res
        .status(400)
        .json({ message: 'Unable to get PayPal access token' });
    }

    const { transactionId, orderId } = req.body;
    if (!transactionId || !orderId) {
      return res
        .status(400)
        .json({ message: 'Transaction ID and order ID are required' });
    }

    const { data } = await axios.get<IPayPal.PayPalOrderStatusResponse>(
      `${process.env.PAYPAL_ORDERS_URL}/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${paypalBearerToken}`,
        },
      }
    );
    // TODO: Process payment and update order status

    if (data.status !== 'COMPLETED') {
      return res.status(400).json({ message: 'Order not completed' });
    }
    await db.connect();
    const dbOrder = await Order.findById(orderId);
    if (!dbOrder) {
      await db.disconnect();
      return res.status(400).json({ message: 'Order not found' });
    }

    if (dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
      await db.disconnect();
      return res.status(400).json({ message: 'Order total does not match' });
    }
    dbOrder.transactionId = transactionId;
    dbOrder.isPaid = true;
    await dbOrder.save();
    await db.disconnect();

    return res.status(200).json({ message: 'Payment successful' });
  } catch (error) {
    console.error('Error processing payment', error);
    return res.status(500).json({ message: 'Error processing payment' });
  }
}
