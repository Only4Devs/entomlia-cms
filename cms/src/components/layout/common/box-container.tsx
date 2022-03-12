import React from 'react';
import styled from '@emotion/styled';
import {css} from '@emotion/css';

export interface BoxContainerProps {
  children?: React.ReactNode;
  extraVerticalSpace?: boolean;
}

const BoxStyled = styled('div')`
  background: #FFF;
  border-radius: 10px;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.1);
  padding: 10px 15px;
`;

export default function BoxContainer({children, extraVerticalSpace = false}: BoxContainerProps) {
  return (
    <BoxStyled className={css`${extraVerticalSpace ? 'padding-top: 16px; padding-bottom: 16px;' : ''}`}>
      {children}
    </BoxStyled>
  );
}
