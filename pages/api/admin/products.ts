import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import Product from '../../../models/Product';
import { IProduct } from '../../../interfaces/products';
import { isValidObjectId } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data =
  | {
      message: string;
    }
  | IProduct[]
  | IProduct;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res);

    case 'POST':
      return createProduct(req, res);

    case 'PUT':
      return updateProduct(req, res);

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}
const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();

  const products = await Product.find().sort({ title: 'asc' }).lean();

  await db.disconnect();

  //  TODO: Add pagination

  return res.status(200).json(products);
};

const createProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { images = [] } = req.body as IProduct;
  if (images.length < 2) {
    return res
      .status(400)
      .json({ message: 'Product must have at least 2 images' });
  }
  try {
    await db.connect();
    const productInDB = await Product.findOne({ slug: req.body.slug });
    if (productInDB) {
      await db.disconnect();
      return res
        .status(400)
        .json({ message: 'Product with this slug already exists' });
    }

    const product = new Product(req.body);
    await product.save();
    await db.disconnect();
    return res.status(201).json(product);
  } catch (error) {
    await db.disconnect();
    return res.status(500).json({ message: 'Something went error' });
  }
};

const updateProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { _id = '', images = [] } = req.body as IProduct;

  if (!isValidObjectId(_id)) {
    return res.status(400).json({ message: 'Product ID is required' });
  }
  if (images.length < 2) {
    return res
      .status(400)
      .json({ message: 'Product must have at least 2 images' });
  }

  try {
    await db.connect();
    const product = await Product.findById(_id);

    if (!product) {
      await db.disconnect();
      return res.status(400).json({ message: 'Product not found' });
    }

    //TODO :  Update product  images and save
    product.images.forEach(async (img) => {
      if (!images.includes(img)) {
        const [fileId, extension] = img
          .substring(img.lastIndexOf('/') + 1)
          .split('.');
        await cloudinary.uploader.destroy(fileId, {
          resource_type: 'image',
          invalidate: true,
        });
      }
    });

    await product?.updateOne(req.body);
    await db.disconnect();
    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
    await db.disconnect();
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
