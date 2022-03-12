import React from 'react';
import {Button} from '@mui/material';
import {useTranslation} from 'react-i18next';
import styled from '@emotion/styled';

export interface EmptyStateProps {
  title?: string;
  description: string;
  buttonLabel?: string;
  buttonOnClick?: () => void;
}

const ContainerCenterStyled = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ButtonContainerStyled = styled('div')`
  margin-top: 30px;
  margin-bottom: 30px;
`;

export default function EmptyState({title = 'No data', description, buttonLabel, buttonOnClick}: EmptyStateProps) {
  const {t} = useTranslation();

  return (
    <ContainerCenterStyled>
      <h1>{t(title || 'No data')}</h1>
      <div>{t(description)}</div>
      {buttonLabel && (
        <ButtonContainerStyled>
          <Button variant="contained" color="primary" size={'small'}
                  onClick={buttonOnClick}>{t(buttonLabel)}</Button>
        </ButtonContainerStyled>
      )}
    </ContainerCenterStyled>
  )
}
