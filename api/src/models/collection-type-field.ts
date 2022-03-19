export default interface CollectionTypeField {
  id: number;
  collectionTypeId: number;
  title: string;
  slug: string;
  fieldType: string;
  isRequired: boolean;
  isUnique: boolean;
  position?: number;
  minLength?: number;
  maxLength?: number;
  showOnListing?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
