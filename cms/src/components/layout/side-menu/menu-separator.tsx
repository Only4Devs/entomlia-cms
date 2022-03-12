import React from 'react';
import styled from '@emotion/styled';
import {css, cx} from '@emotion/css';

interface MenuSeparatorProps {
  drawerWidth: number;
  label: string;
}

const MenuSeparatorStyled = styled('div')((props: any) => (`
  font-weight: bold;
  padding: 0 10px;
  color: #a2a2a2;
  font-size: 12px;
`));

export default function MenuSeparator({drawerWidth, label}: MenuSeparatorProps) {
  return (
    <MenuSeparatorStyled className={css`
      margin: ${drawerWidth === 240 ? '10px 0' : '0'};
      text-indent: ${drawerWidth === 240 ? 'unset' : '-999px'};
    `}>{label}</MenuSeparatorStyled>
  )
}
