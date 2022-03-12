export default interface Admin {
  id: number;
  email: string;
  username: string;
  active: boolean;
  password: string;
  createdAt?: Date|string;
  updatedAt?: Date|string;
}
