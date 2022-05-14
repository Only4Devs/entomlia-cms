import React from 'react';
import {useTranslation} from 'react-i18next';
import styled from '@emotion/styled';

export interface BadgeStatusProps {
  value: boolean;
}

const BadgeStyled = styled('span')`
  padding: 5px;
  border-radius: 5px;
`;

const BadgeActive = styled(BadgeStyled)`
  background: #00a65a;
  color: #fff;
`;

const BadgeInactive = styled(BadgeStyled)`
  background: #dd4b39;
  color: #fff;
`;

export default function BadgeStatus({value}: BadgeStatusProps) {
  const {t} = useTranslation();
  return (
    value ? (
      <BadgeActive>{t('Active')}</BadgeActive>
    ) : (
      <BadgeInactive>{t('Inactive')}</BadgeInactive>
    )
  )
}
