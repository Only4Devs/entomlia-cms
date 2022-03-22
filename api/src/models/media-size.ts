export default interface MediaSize {
  id: number;
  title: string;
  slug?: number;
  width?: number | null;
  height?: number | null;
  mode: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
