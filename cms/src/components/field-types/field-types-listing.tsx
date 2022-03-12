import React from 'react';
import {FieldTypeSelect} from '../../classes/field-type';
import {useTranslation} from 'react-i18next';
import {styled} from '@mui/material';

interface FieldTypesListingProps {
  onSelect: (fieldType: FieldTypeSelect) => void;
}

const fieldTypes: Array<FieldTypeSelect> = [
  {name: 'Text', ekey: 'text', info: 'Info', icon: ''},
  {name: 'Text with editor', ekey: 'editor', info: 'Info', icon: ''},
  {name: 'Number', ekey: 'number', info: 'Info', icon: ''},
  {name: 'Date', ekey: 'date', info: 'Info', icon: ''},
  {name: 'Boolean', ekey: 'boolean', info: 'Info', icon: ''},
  {name: 'ENUM', ekey: 'enum', info: 'Info', icon: ''},
  {name: 'UUID', ekey: 'uuid', info: 'Info', icon: ''},
];

const FieldTypeListingStyled = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const FieldTypeStyled = styled('div')`
  padding: 10px 15px;
  flex: 0 1 calc(50% - 40px);
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  margin-bottom: 15px;
  transition: all 300ms ease-in-out;

  &:hover {
    cursor: pointer;
    background-color: #f1f1f1;
  }
`;

const FieldNameStyled = styled('div')`
  font-weight: 500;
  margin-bottom: 5px;
`;

const FieldInfoStyled = styled('div')`
  font-size: 11px;
`;

export default function FieldTypesListing({onSelect}: FieldTypesListingProps) {
  const {t} = useTranslation();

  const selectFieldType = (fieldType: FieldTypeSelect) => {
    onSelect(fieldType);
  };

  return (
    <FieldTypeListingStyled>
      {fieldTypes.map(field => (
        <FieldTypeStyled onClick={() => selectFieldType(field)} key={`FieldType${field.ekey}`}>
          <FieldNameStyled>{t(field.name)}</FieldNameStyled>
          <FieldInfoStyled>{t(field.info)}</FieldInfoStyled>
        </FieldTypeStyled>
      ))}
    </FieldTypeListingStyled>
  )
}
