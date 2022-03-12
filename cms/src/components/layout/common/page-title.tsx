import React from 'react';
import {styled} from '@mui/material';

interface PageTitleProps {
  title: string;
}

const HeaderStyled = styled('h1')`
  padding-right: 20px;
`;

export default function PageTitle({title}: PageTitleProps) {
  return (
    <HeaderStyled>{title}</HeaderStyled>
  )
}
