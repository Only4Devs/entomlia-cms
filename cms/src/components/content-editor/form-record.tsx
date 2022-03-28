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
import useContent from '../../hooks/use-content';
import plLocale from 'date-fns/locale/pl';
import {useNavigate} from 'react-router-dom';

const localeMap = {
  pl: plLocale
}

export interface FormRecordProps {
  slug: string;
  id?: number | null;
  editData?: any | null
}

const GridButtonBottomStyled = styled(Grid)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export default function FormRecord({slug, id = null, editData = null}: FormRecordProps) {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {createContent, updateContent} = useContent();
  const [collectionType, setCollectionType] = useState<CollectionType | null>(null);
  const {getCollectionType} = useCollectionType();
  const {getFormConfiguration} = useFormConfiguration();
  const {reset, setValue, register, control, handleSubmit, getValues, formState: {errors}} = useForm();
  const [formConfiguration, setFormConfiguration] = useState<FormConfiguration | null>(null);
  const [state, setState] = useState<Array<Array<FieldType>>>([]);
  const [locale, setLocale] = React.useState<keyof typeof localeMap>('pl');

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
          console.log(containers);
          if (editData !== undefined && editData !== null) {
            for (const singleField of result.fields) {
              if (singleField.fieldType === 'boolean') {
                setValue(singleField.slug, editData[singleField.slug] === 1);
              } else {
                setValue(singleField.slug, editData[singleField.slug]);
              }
            }
          }
        }
      }
    })();
  }, []);

  const onSubmit = async (data: any) => {
    console.log('on-submit', data, errors);
    try {
      if (editData !== undefined && editData !== null) {
        await updateContent(editData.id!!, slug, data);
      } else {
        await createContent(data, slug);
      }
      navigate(`/listing/${slug}`);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    collectionType !== null ? (
      <LocalizationProvider dateAdapter={DateAdapter} locale={'pl'}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {state.length >= 4 ? (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {state[0].map((field, index) => (
                    <FormFieldInput field={field} index={index} errors={errors} control={control} register={register}
                                    setValue={setValue} key={`Grid0Cell${index}`}
                                    defaultValue={editData !== null ? editData[field.slug!!] : null} />
                  ))}
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  {state[1].map((field, index) => (
                    <FormFieldInput field={field} index={index} errors={errors} control={control} register={register}
                                    setValue={setValue} key={`Grid1Cell${index}`}
                                    defaultValue={editData !== null ? editData[field.slug!!] : null} />
                  ))}
                </Grid>
                <Grid item xs={6}>
                  {state[2].map((field, index) => (
                    <FormFieldInput field={field} index={index} errors={errors} control={control} register={register}
                                    setValue={setValue} key={`Grid2Cell${index}`}
                                    defaultValue={editData !== null ? editData[field.slug!!] : null} />
                  ))}
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {state[3].map((field, index) => (
                    <FormFieldInput field={field} index={index} errors={errors} control={control} register={register}
                                    setValue={setValue} key={`Grid3Cell${index}`}
                                    defaultValue={editData !== null ? editData[field.slug!!] : null} />
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
