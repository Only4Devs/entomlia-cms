import React from 'react';
import styled from '@emotion/styled';

interface MenuItemLabelProps {
  title: string;
}

const MenuLabel = styled('div')`
  padding-left: 15px;
`;

export default function MenuItemLabel({title}: MenuItemLabelProps) {
  return (
    <MenuLabel>{title}</MenuLabel>
  )
}
