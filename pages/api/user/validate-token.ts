import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { jwt, validations } from '../../../utils';

type Data =
  | {
      message: string;
    }
  | {
      token: string;
      user: {
        email: string;
        role: string;
        name: string;
      };
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return checkToken(req, res);

    default:
      res.status(400).json({ message: 'Bad request' });
  }
}
const checkToken = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { token = '' } = req.cookies;

  let userID = '';
  try {
    userID = await jwt.isValidToken(token);
  } catch (err: any) {
    return res.status(401).json({ message: err });
  }

  await db.connect();
  const user = await User.findById(userID).lean();
  await db.disconnect();
  if (!user) {
    return res.status(400).json({ message: 'User does not exist' });
  }
  const { _id, email, role, name } = user;

  return res.status(200).json({
    token: jwt.signToken(_id, email),
    user: {
      email,
      role,
      name,
    },
  } as { token: string; user: { email: string; role: string; name: string } });
};
