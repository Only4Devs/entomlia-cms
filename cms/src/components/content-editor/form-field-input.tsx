import React from 'react';
import {Checkbox, FormControlLabel, TextareaAutosize, TextField} from '@mui/material';
import {Controller} from 'react-hook-form';
import InputHolder from '../layout/common/input-holder';
import {FieldType} from '../../classes/field-type';
import {useTranslation} from 'react-i18next';
import {DatePicker, DateTimePicker, TimePicker} from '@mui/lab';

export interface FormFieldInputProps {
  field: FieldType;
  index: number;
  errors: any;
  control: any;
  register: any;
  setValue: any;
}

export default function FormFieldInput({field, index, errors, control, register, setValue}: FormFieldInputProps) {
  const {t} = useTranslation();

  return (
    <InputHolder key={`FieldBox${index}`}>
      <div>{index} - {field.slug} - {field.fieldType}</div>

      {field.fieldType === 'date' && field.dateType === 'date' ? (
        <DatePicker
          label="Date"
          value={field.defaultValue}
          onChange={(newValue) => {
            setValue(field.slug!!, newValue);
          }}
          renderInput={(params) => <TextField {...params} error={errors && errors[field.slug!!] !== undefined} />}
        />
      ) : <></>}

      {field.fieldType === 'date' && field.dateType === 'time' ? (
        <TimePicker
          label="Time"
          value={field.defaultValue}
          onChange={(newValue) => {
            setValue(field.slug!!, newValue);
          }}
          renderInput={(params) => <TextField {...params} error={errors && errors[field.slug!!] !== undefined} />}
        />
      ) : <></>}

      {field.fieldType === 'date' && field.dateType === 'datetime' ? (
        <DateTimePicker
          renderInput={(props) => <TextField {...props} error={errors && errors[field.slug!!] !== undefined} />}
          label="Date & time"
          value={field.defaultValue}
          onChange={(newValue) => {
            setValue(field.slug!!, newValue);
          }}
        />
      ) : <></>}

      {field.fieldType === 'varchar' ? (
        <TextField
          {...register(field.slug!!)}
          onChange={e => setValue(field.slug!!, e.target.value)}
          variant={'outlined'}
          type={'text'}
          className={``}
          size={'small'}
          defaultValue={null}
          label={field.slug}
          helperText={errors[field.slug!!] ? t(errors[field.slug!!].type) : ''}
          error={errors && errors[field.slug!!] !== undefined}
        />
      ) : <></>}

      {field.fieldType === 'boolean' ? (
        <FormControlLabel control={
          <Controller
            control={control}
            name={field.slug!!}
            defaultValue={false}
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
        } label={field.slug!!} />
      ) : <></>}

      {field.fieldType === 'text' ? (
        <div className={'holder-textarea'}>
          <FormControlLabel control={
            <Controller
              control={control}
              name={field.slug!!}
              defaultValue={false}
              render={({
                         field: {onChange, onBlur, value, name, ref},
                         fieldState: {invalid, isTouched, isDirty, error},
                         formState
                       }) => (
                <TextareaAutosize minRows={5} onBlur={onBlur} onChange={onChange} ref={ref} />
              )}
            />
          } label={field.slug!!} />
        </div>
      ) : <></>}
    </InputHolder>
  )
}
