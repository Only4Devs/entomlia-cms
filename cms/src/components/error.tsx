import React from 'react';
import {useTranslation} from 'react-i18next';
import styled from '@emotion/styled';

const NotifErrorStyled = styled('h5')`
  color: #ff0303
`;

export default function Error(props: any) {
  const {t} = useTranslation();

  return (
    <div className="notifError">
      <NotifErrorStyled>
        {t(props.error)}
      </NotifErrorStyled>
    </div>
  )
}
