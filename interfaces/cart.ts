import { ISize, IType } from './';

export interface ICartProduct {
  _id: string;
  images: string;
  price: number;
  size?: ISize;
  type: IType;
  slug: string;
  title: string;
  quantity: number;
  gender: string;
}
