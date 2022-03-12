import React from 'react';
import styled from '@emotion/styled';

const MenuListStyled = styled('ul')`
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;

  &:before {
    content: "";
    display: block;
    position: absolute;
    bottom: 0;
    left: 15px;
    right: 15px;
    border-top: 1px solid #ccc;
  }
`;

export default function MenuList({children}: any) {
  return (
    <MenuListStyled>
      {children}
    </MenuListStyled>
  )
}
