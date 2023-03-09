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
    case 'POST':
      return registerUser(req, res);

    default:
      res.status(400).json({ message: 'Bad request' });
  }
}
const registerUser = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const {
    email = '',
    password = '',
    name = '',
  } = req.body as { email: string; password: string; name: string };

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: 'Password must be at least 6 characters' });
  }
  if (name.length < 2) {
    return res
      .status(400)
      .json({ message: 'Name must be at least 2 characters' });
  }

  const emailError = validations.isEmail(email);

  if (emailError) {
    return res.status(400).json({ message: emailError });
  }

  await db.connect();
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = new User({
    email: email.toLocaleLowerCase(),
    password: bcrypt.hashSync(password, 10),
    role: 'client',
    name,
  });

  try {
    await newUser.save({ validateBeforeSave: true });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }

  const { _id, role } = newUser;
  const token = jwt.signToken(_id, email);

  return res.status(200).json({
    token,
    user: {
      email,
      role,
      name,
    },
  });
};
