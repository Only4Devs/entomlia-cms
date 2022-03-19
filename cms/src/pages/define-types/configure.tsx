import React, {useContext, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {CollectionType, LayoutContext} from '../../hooks/layout-context';
import useCollectionType from '../../hooks/use-collection-type';
import ContainerWithSpace from '../../components/layout/container-with-space';
import {useTranslation} from 'react-i18next';
import {FieldType} from '../../classes/field-type';
import DefineTypesFieldsListing from '../../components/field-types/define-types-fields-listing';
import {Button} from '@mui/material';
import styled from '@emotion/styled';
import TableLoader from '../../components/layout/table-loader';

const ButtonContainerStyled = styled('div')`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
`;

export default function Configure() {
  const navigate = useNavigate();
  const {layout, setLayout} = useContext(LayoutContext)
  const {slug} = useParams();
  const {getCollectionType, getCollectionTypes, updateCollectionType} = useCollectionType();
  const [collectionType, setCollectionType] = useState<CollectionType>();
  const {t} = useTranslation();
  const [fields, setFields] = useState<Array<FieldType>>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const changedFields = (fields: Array<FieldType>) => {
    console.log('change---', fields);
    setFields([...fields]);
  };

  React.useEffect(() => {
    if (slug !== undefined && slug !== null) {
      setLoading(true);
      setLayout((prevLayout: any) => ({
        ...prevLayout,
        ['sideMenuCollectionType']: slug,
      }));
      (async () => {
        await loadCollectionWithFields();
      })();
    }
  }, [slug]);

  const loadCollectionWithFields = async () => {
    if (slug !== undefined && slug !== null) {
      try {
        const result = await getCollectionType(slug);
        setCollectionType(result);
        if (result?.fields) {
          setFields(result?.fields);
        }
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
  }

  const saveAndGenerate = async () => {
    if (collectionType !== undefined && collectionType !== null) {
      try {
        const data = collectionType;
        data.fields = fields;
        console.log('data', data);
        const result = await updateCollectionType(collectionType!.id, data);
        console.log('result', result);
        const rows = await getCollectionTypes() as Array<CollectionType>;
        setLayout((prevLayout: any) => ({
          ...prevLayout,
          ['collectionTypes']: rows
        }));
        await loadCollectionWithFields();
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    collectionType ? (
      <ContainerWithSpace>
        {loading && <TableLoader />}
        {!loading && (
          <>
            <DefineTypesFieldsListing inputFields={fields} collectionType={collectionType}
                                      onFieldsChange={changedFields} />
            {fields.length > 0 ? (
              <ButtonContainerStyled>
                <Button variant="contained" color="primary" size={'small'}
                        onClick={saveAndGenerate}>{t('Save & Generate')}</Button>
              </ButtonContainerStyled>
            ) : <></>}
          </>
        )}
      </ContainerWithSpace>
    ) : (
      <></>
    )
  )
}
