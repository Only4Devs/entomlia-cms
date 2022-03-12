import React from 'react';
import PageTitle from '../../components/layout/common/page-title';
import {Button} from '@mui/material';
import {useTranslation} from 'react-i18next';
import ContainerWithSpace from '../../components/layout/container-with-space';
import styled from '@emotion/styled';
import BoxContainer from '../../components/layout/common/box-container';
import {useNavigate, useParams} from 'react-router-dom';
import FormRecord from '../../components/content-editor/form-record';

type Params = {
  slug: string;
  id: string;
};

const TopHeaderStyled = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default function EditRecord() {
  const {t} = useTranslation();
  const {slug, id} = useParams<Params>();
  const navigate = useNavigate();

  const navigateToListing = () => {
    navigate(`/listing/${slug}`);
  }

  return (
    <ContainerWithSpace>
      <TopHeaderStyled>
        <PageTitle title={`${t('Edit record')}: ${slug}`} />
        <Button variant="contained" color="inherit" size={'small'}
                onClick={navigateToListing}>{t('Back')}</Button>
      </TopHeaderStyled>
      <BoxContainer>
        <FormRecord slug={slug!!} id={parseFloat(id!!)} />
      </BoxContainer>
    </ContainerWithSpace>
  )
}
