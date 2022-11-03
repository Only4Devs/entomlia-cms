import React, {useState} from 'react';
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  Fade,
  FormControl,
  FormControlLabel, FormHelperText,
  Grid, InputLabel, MenuItem,
  Modal, Select,
  TextField
} from '@mui/material';
import ModalContainer from './modal-container';
import FieldTypesListing from '../../field-types/field-types-listing';
import {FieldType, FieldTypeSelect} from '../../../classes/field-type';
import {useTranslation} from 'react-i18next';
import styled from '@emotion/styled';
import InputHolder from '../common/input-holder';
import {Controller, useForm} from 'react-hook-form';

export interface ModalNewFieldProps {
  showOpenModal: boolean;
  inputEditField?: FieldType | null;
  onClose: () => void;
  onFieldConfirm: (field: FieldType) => void;
  fields: Array<FieldType>;
}

const ContentCentered = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
`;

const ButtonsContainerStyled = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
`;

export default function ModalNewField({
                                        showOpenModal = false,
                                        onClose,
                                        onFieldConfirm,
                                        inputEditField = null,
                                        fields
                                      }: ModalNewFieldProps) {
  const {t} = useTranslation();
  const {reset, setValue, register, control, handleSubmit, getValues, formState: {errors}} = useForm();
  const [fieldTypeSelected, setFieldTypeSelected] = useState<FieldTypeSelect | null>(null);
  const [, forceUpdate] = React.useState(false);
  const [enumValues, setEnumValues] = useState<Array<string>>([]);
  const [showSourceUrl, setShowSourceUrl] = useState(false);

  React.useEffect(() => {
    setFieldTypeSelected(null);
    if (!showOpenModal) {
      reset();
      setShowSourceUrl(false);
    }
    setEnumValues([]);
  }, [showOpenModal]);

  React.useEffect(() => {
    if (inputEditField !== undefined && inputEditField !== null) {
      const fieldType: string = inputEditField?.fieldType;
      setFieldTypeSelected({ekey: fieldType, name: '', info: '', icon: ''});
      if (inputEditField?.fieldType === 'enum') {
        if (inputEditField.enumValues !== undefined && inputEditField.enumValues !== null) {
          setEnumValues(inputEditField.enumValues.split(','));
        }
      }
      if (inputEditField?.makeUrl) {
        setShowSourceUrl(true);
      }
    }
  }, [inputEditField]);

  React.useEffect(() => {
    if (fieldTypeSelected) {
      forceUpdate(n => !n);
    }
  }, [fieldTypeSelected]);

  const onSelectFieldType = (field: FieldTypeSelect) => {
    setFieldTypeSelected(field);
  }

  const onChangeEnumValues = (values: string) => {
    setValue('enumValues', values);
    setEnumValues(values.split(','));
  }

  const onSubmit = async (data: any) => {
    console.log('errors', errors);
    if (fieldTypeSelected !== null) {
      let fieldTypeValue = fieldTypeSelected.ekey;
      if (fieldTypeValue === 'text') {
        fieldTypeValue = data.textType;
      }

      let maxLength = null;
      if (data.maxLength !== '' && data.maxLength !== undefined && data.maxLength !== null) {
        maxLength = data.maxLength;
      }

      const fieldType: FieldType = {
        title: data.title,
        displayName: data.displayName,
        fieldType: fieldTypeValue,
        maxLength: maxLength,
        isRequired: data.isRequired,
        isUnique: data.isUnique,
        defaultValue: data.defaultValue,
        enumValues: data.enumValues || null,
        dateType: data.dateType || null,
        numberType: data.numberType || null,
        makeUrl: data.makeUrl || false,
        sourceUrl: data.sourceUrl || null,
      };

      if (inputEditField !== undefined && inputEditField !== null) {
        fieldType.id = inputEditField.id;
      }

      onFieldConfirm(fieldType);
      onClose();
    }
  };

  return (
    <Modal
      open={showOpenModal}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={showOpenModal}>
        <Box>
          <ModalContainer title={fieldTypeSelected ? 'Configure field' : 'Select field type'}
                          fieldTypeName={fieldTypeSelected ? fieldTypeSelected.name : null}>
            {fieldTypeSelected === null ? (
              <FieldTypesListing onSelect={onSelectFieldType} />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <InputHolder>
                      <TextField
                        {...register('displayName', {required: true})}
                        onChange={e => setValue('displayName', e.target.value)}
                        defaultValue={inputEditField?.displayName || null}
                        variant={'outlined'}
                        type={'text'}
                        className={``}
                        size={'small'}
                        placeholder={t('Enter display name')}
                        label={t('Display name')}
                        helperText={t(errors.displayName?.type)}
                        error={errors && errors.displayName !== undefined}
                      />
                    </InputHolder>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <InputHolder>
                      <TextField
                        {...register('title', {required: true})}
                        onChange={e => setValue('title', e.target.value)}
                        defaultValue={inputEditField?.title || null}
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
                    <InputHolder>
                      {fieldTypeSelected.ekey === 'boolean' || fieldTypeSelected.ekey === 'enum' ? (
                        <FormControl fullWidth error={errors && errors.defaultValue !== undefined}>
                          <InputLabel id="input-default-value-label">{t('Default value')}</InputLabel>
                          {fieldTypeSelected.ekey === 'boolean' ? (
                            <Select
                              {...register('defaultValue')}
                              defaultValue={inputEditField?.defaultValue || 'null'}
                              labelId="input-default-value-label"
                              id="input-default-value"
                              label={t('Default value')}
                              onChange={e => {
                                setValue('defaultValue', e.target.value);
                                forceUpdate(n => !n);
                              }}
                            >
                              <MenuItem value={'null'}>{t('NULL')}</MenuItem>
                              <MenuItem value={'true'}>{t('True')}</MenuItem>
                              <MenuItem value={'false'}>{t('False')}</MenuItem>
                            </Select>
                          ) : <></>}

                          {fieldTypeSelected.ekey === 'enum' ? (
                            <>
                              <Select
                                {...register('defaultValue', {
                                  validate: {
                                    required: v => v !== undefined && v !== '' && v !== 'null'
                                  }
                                })}
                                defaultValue={inputEditField?.defaultValue || 'null'}
                                labelId="input-default-value-label"
                                id="input-default-value"
                                label={t('Default value')}
                                error={errors && errors.defaultValue !== undefined}
                                onChange={e => {
                                  setValue('defaultValue', e.target.value);
                                  forceUpdate(n => !n);
                                }}
                              >
                                {enumValues.map((value, index) => (
                                  <MenuItem key={`MenuItemEnumValue${index}`} value={value}>{value}</MenuItem>
                                ))}
                              </Select>
                              {errors && errors.defaultValue !== undefined ? (
                                <FormHelperText>{t(errors.defaultValue?.type)}</FormHelperText>
                              ) : <></>}
                            </>
                          ) : <></>}
                        </FormControl>
                      ) : (
                        <TextField
                          {...register('defaultValue')}
                          onChange={e => setValue('defaultValue', e.target.value)}
                          variant={'outlined'}
                          type={'text'}
                          className={``}
                          size={'small'}
                          defaultValue={inputEditField?.defaultValue || null}
                          placeholder={t('Enter default value')}
                          label={t('Default value')}
                          helperText={t(errors.defaultValue?.type)}
                          error={errors && errors.defaultValue !== undefined}
                        />
                      )}
                    </InputHolder>
                    {(getValues('textType') && getValues('textType') === 'varchar') && (
                      <InputHolder withBottomSpacing={false}>
                        <FormControlLabel control={
                          <Controller
                            control={control}
                            name={'makeUrl'}
                            defaultValue={inputEditField?.makeUrl || false}
                            render={({
                                       field: {onChange, onBlur, value, name, ref},
                                       fieldState: {invalid, isTouched, isDirty, error},
                                       formState
                                     }) => (
                              <Checkbox
                                onBlur={onBlur}
                                onChange={(val: any) => {
                                  onChange(val);
                                  setShowSourceUrl(!value);
                                }}
                                checked={value}
                                inputRef={ref}
                                color={'primary'}
                                size={'small'} />
                            )}
                          />
                        } label={t('As URL') as string} />
                      </InputHolder>
                    )}
                    {showSourceUrl ? (
                      <InputHolder>
                        <FormControl fullWidth>
                          <InputLabel id="input-source-url-type-label">{t('Source field')}</InputLabel>
                          <Select
                            {...register('sourceUrl', {required: true})}
                            defaultValue={inputEditField?.sourceUrl || fields[0].slug}
                            labelId="input-source-url-type-label"
                            id="input-source-url-type"
                            label={t('Source field')}
                            onChange={e => {
                              setValue('sourceUrl', e.target.value);
                              forceUpdate(n => !n);
                            }}
                          >
                            {fields.filter(it => it.fieldType === 'varchar' && it.slug !== inputEditField?.slug).map((field: FieldType, index: number) => <MenuItem key={`MenuItemFieldType${index}`} value={field.slug}>{field.slug}</MenuItem>)}
                          </Select>
                        </FormControl>
                      </InputHolder>
                    ) : <></>}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {(fieldTypeSelected && fieldTypeSelected.ekey === 'enum') && (
                      <>
                        <InputHolder>
                          <TextField
                            {...register('enumValues', {required: true})}
                            onChange={e => onChangeEnumValues(e.target.value)}
                            variant={'outlined'}
                            defaultValue={inputEditField?.enumValues || ''}
                            type={'text'}
                            className={``}
                            size={'small'}
                            placeholder={t('Enter list of values')}
                            label={t('List of values')}
                            helperText={t(errors.enumValues?.type)}
                            error={errors && errors.enumValues !== undefined}
                          />
                        </InputHolder>
                      </>
                    )}
                    {(fieldTypeSelected && fieldTypeSelected.ekey === 'number') && (
                      <>
                        <InputHolder>
                          <FormControl fullWidth>
                            <InputLabel id="input-text-type-label">{t('Number type')}</InputLabel>
                            <Select
                              {...register('numberType', {required: true})}
                              defaultValue={inputEditField?.numberType || 'integer'}
                              labelId="input-number-type-label"
                              id="input-number-type"
                              label={t('Number type')}
                              onChange={e => {
                                setValue('numberType', e.target.value);
                                forceUpdate(n => !n);
                              }}
                            >
                              <MenuItem value={'integer'}>{t('Integer')}</MenuItem>
                              <MenuItem value={'bigint'}>{t('Big Integer')}</MenuItem>
                              <MenuItem value={'decimal'}>{t('Decimal')}</MenuItem>
                            </Select>
                          </FormControl>
                        </InputHolder>
                      </>
                    )}
                    {(fieldTypeSelected && fieldTypeSelected.ekey === 'date') && (
                      <>
                        <InputHolder>
                          <FormControl fullWidth>
                            <InputLabel id="input-text-type-label">{t('Date type')}</InputLabel>
                            <Select
                              {...register('dateType', {required: true})}
                              defaultValue={inputEditField?.dateType || 'datetime'}
                              labelId="input-date-type-label"
                              id="input-date-type"
                              label={t('Date type')}
                              onChange={e => {
                                setValue('dateType', e.target.value);
                                forceUpdate(n => !n);
                              }}
                            >
                              <MenuItem value={'datetime'}>{t('Date & time')}</MenuItem>
                              <MenuItem value={'date'}>{t('Date')}</MenuItem>
                              <MenuItem value={'time'}>{t('Time')}</MenuItem>
                            </Select>
                          </FormControl>
                        </InputHolder>
                      </>
                    )}
                    {(fieldTypeSelected && (fieldTypeSelected.ekey === 'text' || fieldTypeSelected.ekey === 'varchar')) && (
                      <>
                        <InputHolder>
                          <FormControl fullWidth>
                            <InputLabel id="input-text-type-label">{t('Text type')}</InputLabel>
                            <Select
                              {...register('textType')}
                              defaultValue={inputEditField?.fieldType || 'varchar'}
                              labelId="input-text-type-label"
                              id="input-text-type"
                              label={t('Text type')}
                              onChange={e => {
                                setValue('textType', e.target.value);
                                forceUpdate(n => !n);
                              }}
                            >
                              <MenuItem value={'varchar'}>{t('Short text')}</MenuItem>
                              <MenuItem value={'text'}>{t('Long text')}</MenuItem>
                            </Select>
                          </FormControl>
                        </InputHolder>
                        {(getValues('textType') && getValues('textType') === 'varchar') && (
                          <InputHolder>
                            <TextField
                              {...register('maxLength', {required: true})}
                              onChange={e => setValue('maxLength', e.target.value)}
                              variant={'outlined'}
                              defaultValue={inputEditField?.maxLength || null}
                              type={'text'}
                              className={``}
                              size={'small'}
                              placeholder={t('Enter max length')}
                              label={t('Max length')}
                              helperText={t(errors.maxLength?.type)}
                              error={errors && errors.maxLength !== undefined}
                            />
                          </InputHolder>
                        )}
                      </>
                    )}
                    <InputHolder withBottomSpacing={false}>
                      <FormControlLabel control={
                        <Controller
                          control={control}
                          name={'isRequired'}
                          defaultValue={inputEditField?.isRequired || false}
                          render={({
                                     field: {onChange, onBlur, value, name, ref},
                                     fieldState: {invalid, isTouched, isDirty, error},
                                     formState
                                   }) => (
                            <Checkbox
                              onBlur={onBlur}
                              onChange={onChange}
                              checked={value}
                              inputRef={ref}
                              color={'primary'}
                              size={'small'} />
                          )}
                        />
                      } label={t('Required') as string} />
                    </InputHolder>
                    {fieldTypeSelected && ['editor', 'number', 'date', 'boolean', 'enum'].indexOf(fieldTypeSelected.ekey) === -1 ? (
                      <InputHolder withBottomSpacing={false}>
                        <FormControlLabel control={
                          <Controller
                            control={control}
                            name={'isUnique'}
                            defaultValue={inputEditField?.isUnique || false}
                            render={({
                                       field: {onChange, onBlur, value, name, ref},
                                       fieldState: {invalid, isTouched, isDirty, error},
                                       formState
                                     }) => (
                              <Checkbox
                                onBlur={onBlur}
                                onChange={onChange}
                                checked={value}
                                inputRef={ref}
                                color={'primary'}
                                size={'small'} />
                            )}
                          />
                        } label={t('Unique') as string} />
                      </InputHolder>
                    ) : <></>}
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={12}>
                    <ButtonsContainerStyled>
                      <Button color="primary" size={'small'}
                              onClick={onClose}>{t('Cancel')}</Button>
                      <Button variant="contained" color="primary" size={'small'} type={'submit'}>{t('Confirm')}</Button>
                    </ButtonsContainerStyled>
                  </Grid>
                </Grid>
              </form>
            )}
            {fieldTypeSelected ? (
              <></>
            ) : (
              <ContentCentered>
                <Button variant="contained" color="primary" size={'small'}
                        onClick={onClose}>{t('Close')}</Button>
              </ContentCentered>
            )}
          </ModalContainer>
        </Box>
      </Fade>
    </Modal>
  )
}
