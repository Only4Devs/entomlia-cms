import React from 'react';
import {TextField} from '@mui/material';
import styled from '@emotion/styled';

const TextFieldStyled = styled(TextField)`
  width: 100%;
`;

export default function FormInput(props: any) {
  let fail = props.fail;

  return (
    <TextFieldStyled
      variant={'outlined'}
      type={props.type}
      placeholder={props.placeholder}
      name={props.name}
      label={props.label}
      value={props.value}
      onChange={props.handleChange}
      onKeyDown={props.handleKeyDown}
    />
  )
}
