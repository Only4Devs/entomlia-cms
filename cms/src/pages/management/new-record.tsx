import React, {useContext} from 'react';
import PageTitle from '../../components/layout/common/page-title';
import {Button} from '@mui/material';
import {useTranslation} from 'react-i18next';
import ContainerWithSpace from '../../components/layout/container-with-space';
import styled from '@emotion/styled';
import BoxContainer from '../../components/layout/common/box-container';
import {useNavigate, useParams} from 'react-router-dom';
import FormRecord from '../../components/content-editor/form-record';
import {LayoutContext} from '../../hooks/layout-context';

type Params = {
  slug: string;
};

const TopHeaderStyled = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default function NewRecord() {
  const {t} = useTranslation();
  const {slug} = useParams<Params>();
  const navigate = useNavigate();
  const {layout, setLayout} = useContext(LayoutContext);

  React.useEffect(() => {
    if (slug !== undefined && slug !== null) {
      setLayout({
        ...layout,
        sideMenu: 'listing',
        sideMenuContent: slug
      });
    }
  }, [slug]);

  const navigateToListing = () => {
    navigate(`/listing/${slug}`);
  }

  return (
    <ContainerWithSpace>
      <TopHeaderStyled>
        <PageTitle title={`${t('New record')}: ${slug}`} />
        <Button variant="contained" color="inherit" size={'small'}
                onClick={navigateToListing}>{t('Back')}</Button>
      </TopHeaderStyled>
      <BoxContainer>
        <FormRecord slug={slug!!} />
      </BoxContainer>
    </ContainerWithSpace>
  )
}
