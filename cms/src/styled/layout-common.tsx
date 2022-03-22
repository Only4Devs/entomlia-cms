import styled from '@emotion/styled';
import {Button} from '@mui/material';

const TopHeaderStyled = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ButtonTopStyled = styled(Button)`
  margin-left: 15px;
`;

const ScrollableTableStyled = styled('div')`
  overflow-y: auto;
`;

const EmptyStateHolderStyled = styled('div')`
  padding-top: 50px;
  padding-bottom: 30px;
`;

const ColumnActionsStyled = styled('td')`
  text-align: right;
`;

export {
  TopHeaderStyled,
  ButtonTopStyled,
  ScrollableTableStyled,
  EmptyStateHolderStyled,
  ColumnActionsStyled,
}
