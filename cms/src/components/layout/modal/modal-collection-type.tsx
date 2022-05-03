import React from 'react';
import {Button, Grid, TextField} from '@mui/material';
import InputHolder from '../common/input-holder';
import styled from '@emotion/styled';
import {useTranslation} from 'react-i18next';
import {useForm} from 'react-hook-form';
import {CollectionType} from '../../../hooks/layout-context';

const ButtonContainerWithoutMarginStyled = styled('div')`
  display: flex;
  justify-content: flex-end;
`;

export interface ModalCollectionTypeProps {
  onDataSubmit: (data: any) => void;
  showFields: boolean;
  inputEdit?: CollectionType | null;
}

export default function ModalCollectionType({onDataSubmit, showFields, inputEdit = null}: ModalCollectionTypeProps) {
  const {t} = useTranslation();
  const {setValue, register, reset, handleSubmit, getValues, formState: {errors}} = useForm();

  React.useEffect(() => {
    if (inputEdit !== undefined && inputEdit !== null) {
      reset(inputEdit);
    }
  }, [inputEdit]);

  const onSubmit = async (data: any) => {
    console.log('errors', errors);
    onDataSubmit(data);
  };

  return (
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
        <Grid item xs={12} md={6}>
          <InputHolder>
            <TextField
              {...register('icon', {required: true})}
              onChange={e => setValue('icon', e.target.value)}
              variant={'outlined'}
              type={'text'}
              className={``}
              size={'small'}
              placeholder={t('Enter icon')}
              label={t('Icon')}
              helperText={t(errors.icon?.type)}
              error={errors && errors.icon !== undefined}
            />
          </InputHolder>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <ButtonContainerWithoutMarginStyled>
            {!showFields ? (
              inputEdit !== undefined && inputEdit !== null ? (
                <Button variant="contained" color="primary" type={'submit'} size={'small'}>{t('Save')}</Button>
              ) : (
                <Button variant="contained" color="primary" type={'submit'} size={'small'}>{t('Create')}</Button>
              )
            ) : (
              <Button variant="contained" disabled={true} size={'small'}>{t('OK')}</Button>
            )}
          </ButtonContainerWithoutMarginStyled>
        </Grid>
      </Grid>
    </form>
  );
}
