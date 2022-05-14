import React from 'react';
import moment from 'moment';
import styled from '@emotion/styled';

export interface DateTimeDisplayProps {
  value: string;
  showDate: boolean;
  showTime: boolean;
}

const IconStyled = styled('i')`
  margin-right: 8px;
`;

export default function DateTimeDisplay({value, showDate = true, showTime = true}: DateTimeDisplayProps) {
  return (
    <div>
      {showDate ? (
        <div>
          <IconStyled className={'fa fa-calendar-alt'} />
          <span>{moment(value).format('YYYY-MM-DD')}</span>
        </div>
      ) : <></>}
      {showTime ? (
        <div>
          <IconStyled className={'far fa-clock'} />
          <span>{moment(value).format('HH:mm:ss')}</span>
        </div>
      ) : <></>}
    </div>
  );
}
