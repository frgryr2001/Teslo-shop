import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { db } from '../../../database';
import { IOrder } from '../../../interfaces/order';
import { Product, Order } from '../../../models/';

type Data =
  | {
      message: string;
    }
  | IOrder;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'POST':
      return createOrder(req, res);
    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}
async function createOrder(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { orderItems, total } = req.body as IOrder;

  const session: any = await getSession({ req });

  if (!session) {
    return res.status(401).json({
      message: 'You are not authenticated ',
    });
  }

  const productIds = orderItems.map((product) => product._id);
  await db.connect();
  const dbproducts = await Product.find({ _id: { $in: productIds } });

  try {
    const subTotal = orderItems.reduce((acc, item) => {
      const currentPrice = dbproducts.find((prod) => {
        return prod.id === item._id;
      })?.price;
      if (!currentPrice) throw new Error('Check your cart , product no exist');
      return item.quantity * item.price + acc;
    }, 0);
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    const backendTotal = subTotal * (taxRate + 1);

    if (total !== Math.round(backendTotal)) {
      throw new Error('Invalid sum');
    }
    const userId = session.user._id;
    const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
    newOrder.total = Math.round(newOrder.total * 100) / 100;
    await newOrder.save();
    await db.disconnect();
    return res.status(201).json(newOrder);
  } catch (error: any) {
    await db.disconnect();
    console.log(error);
    return res
      .status(400)
      .json({ message: error.message || 'There are a few errors ' });
  }
}
