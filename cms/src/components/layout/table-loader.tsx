import React from 'react';
import {CircularProgress} from '@mui/material';
import styled from '@emotion/styled';

const TableLoaderStyled = styled('div')`
  padding: 50px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function TableLoader() {
  return (
    <TableLoaderStyled>
      <CircularProgress />
    </TableLoaderStyled>
  );
}
