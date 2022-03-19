export interface FieldTypeSelect {
  name: string;
  info: string;
  icon: string;
  ekey: string;
}

export interface FieldType {
  id?: number;
  collectionTypeId?: number;
  title: string;
  slug?: string;
  fieldType: string;
  isRequired: boolean;
  isUnique: boolean;
  position?: number;
  minLength?: number;
  maxLength?: number|null;
  defaultValue?: string;
  toDelete?: boolean;
  enumValues?: string|null;
  dateType?: string|null;
  numberType?: string|null;
  values?: Array<string>;
  makeUrl: boolean;
  sourceUrl?: string;
  showOnListing?: boolean;
}
