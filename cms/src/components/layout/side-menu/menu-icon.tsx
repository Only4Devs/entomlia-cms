import React from 'react';
import styled from '@emotion/styled';
import {Icon} from '@mui/material';

interface MenuIconProps {
  icon: string;
}

const MenuIconStyled = styled(Icon)`
  font-size: 14px;
  width: auto;
`;

export default function MenuIcon({icon}: MenuIconProps) {
  return (
    <MenuIconStyled className={icon} />
  )
}
