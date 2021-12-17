export interface IUser {
  readonly id?: number;
  name: string;
  email: string;
  password: string;
}

export interface ITask {
  readonly id?: number;
  title: string;
  description: string;
  status: string;
  user?: IUser;
  userId?: number;
}
