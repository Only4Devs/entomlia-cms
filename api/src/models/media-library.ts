export default interface MediaLibrary {
  id: number;
  filename?: string;
  width?: number;
  height?: number;
  createdAt?: Date|string;
  updatedAt?: Date|string;
}
