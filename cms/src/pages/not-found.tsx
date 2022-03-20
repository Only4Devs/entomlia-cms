import React, {useContext} from 'react';
import ContainerWithSpace from '../components/layout/container-with-space';
import {LayoutContext} from '../hooks/layout-context';
import PageTitle from '../components/layout/common/page-title';
import { TopHeaderStyled } from '../styled/layout-common';
import {useTranslation} from 'react-i18next';

export default function NotFound() {
  const {layout, setLayout} = useContext(LayoutContext);
  const {t} = useTranslation();

  React.useEffect(() => {
    setLayout({
      ...layout,
      sideMenu: '',
      sideMenuCollectionType: '',
      sideMenuContent: ''
    });
  }, []);

  return (
    <ContainerWithSpace>
      <TopHeaderStyled>
        <div>
          <h1>404</h1>
          <PageTitle title={t('Not Found')} />
        </div>
      </TopHeaderStyled>
    </ContainerWithSpace>
  )
}
