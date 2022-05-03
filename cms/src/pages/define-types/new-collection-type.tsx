import React, {useContext, useState} from 'react';
import {CollectionType, LayoutContext} from '../../hooks/layout-context';
import ContainerWithSpace from '../../components/layout/container-with-space';
import {useTranslation} from 'react-i18next';
import BoxContainer from '../../components/layout/common/box-container';
import {useForm} from 'react-hook-form';
import {Button} from '@mui/material';
import PageTitle from '../../components/layout/common/page-title';
import DefineTypesFieldsListing from '../../components/field-types/define-types-fields-listing';
import {FieldType} from '../../classes/field-type';
import styled from '@emotion/styled';
import useCollectionType from '../../hooks/use-collection-type';
import {useNavigate} from 'react-router-dom';
import ModalCollectionType from '../../components/layout/modal/modal-collection-type';

const ButtonContainerStyled = styled('div')`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
`;

export default function NewCollectionType() {
  const {t} = useTranslation();
  const {layout, setLayout} = useContext(LayoutContext);
  const [showFields, setShowFields] = useState(false);
  const {setValue, register, handleSubmit, getValues, formState: {errors}} = useForm();
  const [fields, setFields] = useState<Array<FieldType>>([]);
  const [shouldShowModal, setShouldShowModal] = useState<boolean>(false);
  const {createCollectionType, getCollectionTypes} = useCollectionType();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);

  React.useEffect(() => {
    setLayout({
      ...layout,
      sideMenuCollectionType: 'new',
    });
  }, []);

  const changedFields = (fields: Array<FieldType>) => {
    setFields([...fields]);
  };

  const onDataSubmit = (data: any) => {
    if (!showFields) {
      setData(data);
      setShowFields(true);
      setShouldShowModal(true);
    }
  };

  const saveAndGenerate = async () => {
    try {
      data.fields = fields;
      const result = await createCollectionType(data);
      const rows = await getCollectionTypes() as Array<CollectionType>;
      setLayout((prevLayout: any) => ({
        ...prevLayout,
        ['collectionTypes']: rows
      }));
      navigate(`/define-types/configure/${result.slug}`);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ContainerWithSpace>
      <PageTitle title={t('Configure type')} />
      <BoxContainer extraVerticalSpace={true}>
        <ModalCollectionType onDataSubmit={onDataSubmit} showFields={showFields} />
      </BoxContainer>
      {showFields ? (
        <DefineTypesFieldsListing inputFields={fields} onFieldsChange={changedFields}
                                  shouldShowModal={shouldShowModal} />
      ) : <></>}
      {fields.length > 0 ? (
        <ButtonContainerStyled>
          <Button variant="contained" color="primary" size={'small'}
                  onClick={saveAndGenerate}>{t('Save & Generate')}</Button>
        </ButtonContainerStyled>
      ) : <></>}
    </ContainerWithSpace>
  )
}
