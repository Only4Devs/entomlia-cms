export default interface MediaSize {
  id: number;
  title: string;
  slug?: string;
  width: number | null;
  height: number | null;
  mode: string;
}
