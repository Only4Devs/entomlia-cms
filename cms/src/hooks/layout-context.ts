import {createContext} from 'react';
import {FieldType} from '../classes/field-type';

export interface CollectionType {
  id: number;
  slug: string;
  tableName: string;
  title: string;
  displayTitle: string;
  icon: string;
  fieldType: string;
  isRequired: boolean;
  isUnique: boolean;
  position?: number;
  minLength?: number;
  maxLength?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  fields?: Array<CollectionTypeField>|Array<FieldType>;
}

export interface CollectionTypeField {
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
  defaultValue?: string;
  showOnListing?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Layout {
  sideMenu: string;
  sideMenuCollectionType: string;
  sideMenuContent: string;
  collectionTypes: Array<CollectionType>;
}

export interface LayoutContextData {
  layout: Layout,
  setLayout: (layout: Layout|CallableFunction) => void;
}

const layoutContextDefaultValue: LayoutContextData = {
  layout: {
    sideMenu: '',
    sideMenuCollectionType: '',
    sideMenuContent: '',
    collectionTypes: []
  },
  setLayout: () => null
}

export const LayoutContext = createContext<LayoutContextData>(layoutContextDefaultValue);
