import React from 'react';
import {styled} from '@mui/material';
import {useTranslation} from 'react-i18next';

const ModalStyled = styled('div')`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40vw;
  background-color: #FFF;
  padding: 20px;
  border-radius: 10px;
`;

const HeaderStyled = styled('h2')`
  padding-top: 0;
  margin-top: 0;
`;

export interface ModalContainerProps {
  children?: React.ReactNode;
  title: string;
  fieldTypeName?: string|null;
}

export default function ModalContainer({children, title, fieldTypeName = null}: ModalContainerProps) {
  const {t} = useTranslation();

  return (
    <ModalStyled>
      <HeaderStyled>{t(title)}{fieldTypeName ? `: ${t(fieldTypeName)}` : ''}</HeaderStyled>
      {children}
    </ModalStyled>
  )
}
