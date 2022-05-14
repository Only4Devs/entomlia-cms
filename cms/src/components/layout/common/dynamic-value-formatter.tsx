import React from 'react';
import DateTimeDisplay from './date-time-display';
import moment from 'moment';
import BadgeStatus from './badge-status';

export interface DynamicValueFormatterProps {
  value: any;
  field: string;
  fields: Array<any>;
}

export default function DynamicValueFormatter({value, field, fields}: DynamicValueFormatterProps) {
  let asText = false;
  let asDate = false;
  let asTime = false;
  let asDateTime = false;
  let asBool = false;
  let asNumber = false;

  const fieldConfiguration = fields.find(f => f.slug === field);
  if (fieldConfiguration !== undefined && fieldConfiguration !== null) {
    switch (fieldConfiguration.fieldType) {
      case 'varchar':
        asText = true;
        break;
      case 'enum':
        asText = true;
        break;
      case 'editor':
        asText = true;
        break;
      case 'text':
        asText = true;
        break;
      case 'uuid':
        asText = true;
        break;
      case 'boolean':
        asBool = true;
        break;
      case 'number':
        asNumber = true;
        break;
      case 'date':
        if (fieldConfiguration.dateType === 'datetime') {
          asDateTime = true;
        } else if (fieldConfiguration.dateType === 'date') {
          asDate = true;
        } else if (fieldConfiguration.dateType === 'time') {
          asTime = true;
        }
        break;
    }
  }

  return (
    <div>
      {asText ? (<span>{value}</span>) : <></>}
      {asNumber ? (<span>{value}</span>) : <></>}
      {asBool ? (<BadgeStatus value={value} />) : <></>}
      {asDateTime ? (<DateTimeDisplay value={value} showDate={true} showTime={true} />) : <></>}
      {asDate ? (<DateTimeDisplay value={value} showDate={true} showTime={false} />) : <></>}
      {asTime ? (<DateTimeDisplay value={moment().format('YYYY-MM-DD ' + value)} showDate={false} showTime={true} />) : <></>}
    </div>
  )
}
