export default interface Page {
  id: number;
  title: string;
  slug: string;
  active: boolean;
  createdAt?: Date|string;
  updatedAt?: Date|string;
}
