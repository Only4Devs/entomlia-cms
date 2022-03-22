import React from 'react';
import styled from '@emotion/styled';
import {CircularProgress} from '@mui/material';

const LoaderContainerStyled = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9;
`;

export default function LoadingOverlay() {
  return (
    <LoaderContainerStyled>
      <CircularProgress size={50} />
    </LoaderContainerStyled>
  )
}
