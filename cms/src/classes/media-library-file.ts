export default interface MediaLibraryFile {
  id: number;
  title: string;
  filename?: string;
  width: number | null;
  height: number | null;
  mediaLibraryDirectoryId?: number;
}
