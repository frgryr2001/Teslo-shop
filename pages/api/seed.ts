import type { NextApiRequest, NextApiResponse } from 'next';
import { db, seedDatabase } from '../../database';
import { Product } from '../../models';
import { User } from '../../models';

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (process.env.NODE_ENV === 'production') {
    res.status(401).json({ message: 'You must not access this API' });
  }

  await db.connect();

  await User.deleteMany();
  await User.insertMany(seedDatabase.initialData.users);

  await Product.deleteMany();
  await Product.insertMany(seedDatabase.initialData.products);

  await db.disconnect();

  res.status(200).json({ message: 'Example' });
}
