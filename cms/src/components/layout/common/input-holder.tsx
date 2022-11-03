import React from 'react';
import {css} from '@emotion/css';

export interface InputHolderProps {
  children: React.ReactNode;
  withBottomSpacing?: boolean;
}

export default function InputHolder({children, withBottomSpacing = true}: InputHolderProps) {
  return (
    <div className={css`${withBottomSpacing ? 'margin-bottom: 30px;' : ''}`}>
      {children}
    </div>
  )
}
