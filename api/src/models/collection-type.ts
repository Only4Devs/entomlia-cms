import CollectionTypeField from './collection-type-field';

export default interface CollectionType {
  id: number;
  title: string;
  slug: string;
  tableName: string;
  fields: Array<CollectionTypeField>;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
