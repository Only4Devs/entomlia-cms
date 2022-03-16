import React from 'react';
import styled from '@emotion/styled';

const ContainerStyled = styled('div')`
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 24px;
`;

export default function ContainerWithSpace({children}: any) {
  return (
    <ContainerStyled>
      {children}
    </ContainerStyled>
  )
}
