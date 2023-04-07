import type { NextApiRequest, NextApiResponse } from 'next';
import { db, SHOP_CONSTANTS } from '../../../database';
import Product from '../../../models/Product';
import { IProduct } from '../../../interfaces/products';

type Data =
  | {
      message: string;
    }
  | IProduct[];

// eslint-disable-next-line import/no-anonymous-default-export
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res);
    default:
      return res.status(400).json({
        message: 'Bad request',
      });
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { gender = 'all' } = req.query;
  let condition = {};
  if (
    gender !== 'all' &&
    SHOP_CONSTANTS.validGenders.includes(gender as string)
  ) {
    condition = { gender: gender };
  }

  await db.connect();
  const products = await Product.find(condition)
    .select('title images price inStock slug')
    .lean();
  await db.disconnect();

  const updateProducts = products.map((product) => {
    product.images = product.images.map((image) => {
      return image.includes('http')
        ? image
        : `${process.env.HOST_NAME}products/${image}`;
    });
    return product;
  });

  return res.status(200).json(updateProducts);
};
