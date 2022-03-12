import React from 'react';
import styled from '@emotion/styled';
import {Tooltip, Typography} from '@mui/material';

export interface ActionIconProps {
  icon: string;
  color?: string;
  onClick?: () => void;
  title: string;
}

const IconStyled = styled('i')`
  margin-left: 15px;
`;

const TypographyStyled = styled(Typography)`
  font-size: 14px;
  width: auto;
  display: inline-flex;
`;

export default function ActionIcon({icon, color, onClick, title}: ActionIconProps) {
  return (
    <TypographyStyled color={color}>
      <Tooltip title={title} arrow placement={'top'}>
        <IconStyled className={icon} onClick={onClick} />
      </Tooltip>
    </TypographyStyled>
  )
}
