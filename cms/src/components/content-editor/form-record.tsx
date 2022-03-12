import React, {useState} from 'react';
import useCollectionType from '../../hooks/use-collection-type';
import {CollectionType} from '../../hooks/layout-context';
import {Button, Grid} from '@mui/material';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import useFormConfiguration, {FormConfiguration} from '../../hooks/use-form-configuration';
import FormFieldInput from './form-field-input';
import {FieldType} from '../../classes/field-type';
import styled from '@emotion/styled';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

export interface FormRecordProps {
  slug: string;
  id?: number | null;
}

const GridButtonBottomStyled = styled(Grid)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export default function FormRecord({slug, id = null}: FormRecordProps) {
  const {t} = useTranslation();
  const [collectionType, setCollectionType] = useState<CollectionType | null>(null);
  const {getCollectionType} = useCollectionType();
  const {getFormConfiguration} = useFormConfiguration();
  const {reset, setValue, register, control, handleSubmit, getValues, formState: {errors}} = useForm();
  const [formConfiguration, setFormConfiguration] = useState<FormConfiguration | null>(null);
  const [state, setState] = useState<Array<Array<FieldType>>>([]);

  React.useEffect(() => {
    (async () => {
      const result = await getCollectionType(slug);
      setCollectionType(result);
      const formConfiguration = await getFormConfiguration(slug);
      setFormConfiguration(formConfiguration);
      if (result !== undefined && result !== null) {
        console.log('formConfiguration.content', formConfiguration.content);
        if (formConfiguration.content !== null) {
          const containers = [];
          for (let i = 0; i < formConfiguration.content.length; i++) {
            const container = formConfiguration.content[i];
            const fields = [];
            for (const field of container) {
              if (result.fields !== undefined && result.fields !== null) {
                // @ts-ignore
                const found: FieldType = result.fields.find((f: FieldType) => f.slug === field.slug);
                fields.push(found);
              }
            }
            containers.push(fields);
          }
          setState(containers);
          console.log(containers)
        }
      }
    })();
  }, []);

  const onSubmit = async (data: any) => {
    console.log('on-submit', data, errors);
  }

  return (
    collectionType !== null ? (
      <LocalizationProvider dateAdapter={DateAdapter}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {state.length >= 4 ? (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {state[0].map((field, index) => (
                    <FormFieldInput field={field} index={index} errors={errors} control={control} register={register}
                                    setValue={setValue} key={`Grid0Cell${index}`} />
                  ))}
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  {state[1].map((field, index) => (
                    <FormFieldInput field={field} index={index} errors={errors} control={control} register={register}
                                    setValue={setValue} key={`Grid1Cell${index}`} />
                  ))}
                </Grid>
                <Grid item xs={6}>
                  {state[2].map((field, index) => (
                    <FormFieldInput field={field} index={index} errors={errors} control={control} register={register}
                                    setValue={setValue} key={`Grid2Cell${index}`} />
                  ))}
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {state[3].map((field, index) => (
                    <FormFieldInput field={field} index={index} errors={errors} control={control} register={register}
                                    setValue={setValue} key={`Grid3Cell${index}`} />
                  ))}
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <GridButtonBottomStyled item xs={12}>
                  <Button variant="contained" color="primary" type={'submit'} size={'small'}>{t('Save')}</Button>
                </GridButtonBottomStyled>
              </Grid>
            </>
          ) : <></>}
        </form>
      </LocalizationProvider>
    ) : (
      <></>
    )
  )
}
