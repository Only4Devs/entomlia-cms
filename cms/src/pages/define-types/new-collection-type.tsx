import React, {useContext, useState} from 'react';
import {CollectionType, LayoutContext} from '../../hooks/layout-context';
import ContainerWithSpace from '../../components/layout/container-with-space';
import {useTranslation} from 'react-i18next';
import BoxContainer from '../../components/layout/common/box-container';
import {useForm} from 'react-hook-form';
import {Button, Grid, TextField} from '@mui/material';
import InputHolder from '../../components/layout/common/input-holder';
import PageTitle from '../../components/layout/common/page-title';
import DefineTypesFieldsListing from '../../components/field-types/define-types-fields-listing';
import {FieldType} from '../../classes/field-type';
import styled from '@emotion/styled';
import useCollectionType from '../../hooks/use-collection-type';
import {useNavigate} from 'react-router-dom';

const ButtonContainerStyled = styled('div')`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
`;

export default function NewCollectionType() {
  const {layout, setLayout} = useContext(LayoutContext);
  const {t} = useTranslation();
  const {setValue, register, handleSubmit, getValues, formState: {errors}} = useForm();
  const [showFields, setShowFields] = useState(false);
  const [fields, setFields] = useState<Array<FieldType>>([]);
  const [shouldShowModal, setShouldShowModal] = useState<boolean>(false);
  const {createCollectionType, getCollectionTypes} = useCollectionType();
  const navigate = useNavigate();

  React.useEffect(() => {
    setLayout({
      ...layout,
      sideMenuCollectionType: 'new',
    });
  }, []);

  const onSubmit = async (data: any) => {
    console.log('data', data);
    console.log('errors', errors);
    if (!showFields) {
      setShowFields(true);
      setShouldShowModal(true);
    }
  };

  const changedFields = (fields: Array<FieldType>) => {
    console.log('changedFields', fields)
    setFields([...fields]);
  };

  const saveAndGenerate = async () => {
    try {
      const data = getValues();
      data.fields = fields;
      console.log('data', data);
      const result = await createCollectionType(data);
      console.log('result', result);
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <InputHolder>
                <TextField
                  {...register('title', {required: true})}
                  onChange={e => setValue('title', e.target.value)}
                  variant={'outlined'}
                  type={'text'}
                  className={``}
                  size={'small'}
                  placeholder={t('Enter title')}
                  label={t('Title')}
                  helperText={t(errors.title?.type)}
                  error={errors && errors.title !== undefined}
                />
              </InputHolder>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              {!showFields ? (
                <Button variant="contained" color="primary" type={'submit'} size={'small'}>{t('Create')}</Button>
              ) : (
                <Button variant="contained" disabled={true} size={'small'}>{t('OK')}</Button>
              )}
            </Grid>
          </Grid>
        </form>
      </BoxContainer>
      {showFields ? (
        <DefineTypesFieldsListing inputFields={fields} onFieldsChange={changedFields} shouldShowModal={shouldShowModal} />
      ) : <></>}
      {fields.length > 0 ? (
        <ButtonContainerStyled>
          <Button variant="contained" color="primary" size={'small'} onClick={saveAndGenerate}>{t('Save & Generate')}</Button>
        </ButtonContainerStyled>
      ) : <></>}
    </ContainerWithSpace>
  )
}
