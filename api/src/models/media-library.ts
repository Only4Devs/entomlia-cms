export default interface MediaLibrary {
  id: number;
  filename?: string;
  width?: number;
  height?: number;
  uid: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  path?: string;
}
