import React, {useRef, useState} from 'react';
import {Checkbox, FormControlLabel, MenuItem, Select, TextareaAutosize, TextField} from '@mui/material';
import {Controller} from 'react-hook-form';
import InputHolder from '../layout/common/input-holder';
import {FieldType} from '../../classes/field-type';
import {useTranslation} from 'react-i18next';
import {DatePicker, DateTimePicker, TimePicker} from '@mui/lab';
import {Editor} from '@tinymce/tinymce-react';

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
  const editorRef = useRef<any>(null);
  const [localValue, setLocalValue] = useState(null);

  return (
    <InputHolder key={`FieldBox${index}`}>
      <div>{index} - {field.slug} - {field.fieldType}</div>

      {field.fieldType === 'date' && field.dateType === 'date' ? (
        <DatePicker
          label="Date"
          value={localValue}
          inputFormat={'YYYY-MM-DD'}
          onChange={(newValue) => {
            setValue(field.slug!!, newValue);
            setLocalValue(newValue);
          }}
          renderInput={(params) => <TextField {...params} error={errors && errors[field.slug!!] !== undefined} />}
        />
      ) : <></>}

      {field.fieldType === 'date' && field.dateType === 'time' ? (
        <TimePicker
          label="Time"
          value={localValue}
          inputFormat={'HH:mm'}
          ampm={false}
          onChange={(newValue) => {
            setValue(field.slug!!, newValue);
            console.log(newValue);
            if (newValue !== undefined && newValue !== null) {
              setLocalValue(newValue);
            }
          }}
          renderInput={(params) => <TextField {...params} error={errors && errors[field.slug!!] !== undefined} />}
        />
      ) : <></>}

      {field.fieldType === 'date' && field.dateType === 'datetime' ? (
        <DateTimePicker
          renderInput={(props) => <TextField {...props} error={errors && errors[field.slug!!] !== undefined} />}
          label="Date & time"
          ampm={false}
          value={localValue}
          inputFormat={'YYYY-MM-DD HH:mm'}
          onChange={(newValue) => {
            setValue(field.slug!!, newValue);
            setLocalValue(newValue);
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

      {field.fieldType === 'number' ? (
        <TextField
          {...register(field.slug!!)}
          onChange={e => setValue(field.slug!!, e.target.value)}
          variant={'outlined'}
          type={'number'}
          className={``}
          size={'small'}
          defaultValue={null}
          label={field.slug}
          helperText={errors[field.slug!!] ? t(errors[field.slug!!].type) : ''}
          error={errors && errors[field.slug!!] !== undefined}
        />
      ) : <></>}

      {field.fieldType === 'enum' && field.values ? (
        <Select
          {...register(field.slug!!)}
          defaultValue={field?.defaultValue || 'null'}
          labelId="input-default-value-label"
          id="input-default-value"
          label={t('Default value')}
          onChange={e => {
            setValue(field.slug!!, e.target.value);
          }}
        >
          {field.values.map((val, index) => <MenuItem key={`SelectVal_${field.slug}_${index}`}
                                                      value={val}>{t(val)}</MenuItem>)}
        </Select>
      ) : <></>}

      {field.fieldType === 'editor' ? (
        <Editor
          onInit={(evt, editor) => editorRef.current = editor}
          initialValue=""
          init={{
            height: 500,
            menubar: false,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount'
            ],
            toolbar: 'undo redo | formatselect | ' +
              'bold italic backcolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
          }}
          onEditorChange={(content: string, editor: any) => {
            setValue(field.slug!!, content);
          }}
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
