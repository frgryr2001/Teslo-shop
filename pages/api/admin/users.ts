import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { IUser } from '../../../interfaces';
import User from '../../../models/User';
import { isValidObjectId } from 'mongoose';

type Data =
  | {
      message: string;
    }
  | IUser[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return getUsers(req, res);
    case 'PUT':
      return updateUser(req, res);
    default:
      res.status(200).json({ message: 'Bad request' });
  }
}

const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  const users = await User.find().select('-password').lean();
  await db.disconnect();
  return res.status(200).json(users);
};
const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { userId = '', role = '' } = req.body;

  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Invalid user id' });
  }
  const validRoles = ['admin', 'super-user', 'SEO', 'client'];
  if (!validRoles.includes(role)) {
    return res
      .status(400)
      .json({ message: 'Role no permission' + validRoles.join(', ') });
  }

  await db.connect();
  await User.findByIdAndUpdate(userId, {
    role,
  });
  await db.disconnect();

  return res.status(200).json({ message: 'Update user success' });
};
