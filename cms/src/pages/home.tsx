import React, {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {Helmet} from 'react-helmet-async';
import {LayoutContext} from '../hooks/layout-context';
import ContainerWithSpace from '../components/layout/container-with-space';

export default function Home() {
  const {t} = useTranslation();
  const {layout, setLayout} = useContext(LayoutContext);

  React.useEffect(() => {
    layout.sideMenu = 'home';
    layout.sideMenuContent = '';
    layout.sideMenuCollectionType = '';
    setLayout({...layout});
  }, []);

  return (
    <ContainerWithSpace>
      <Helmet>
        <title>{t('Start')} | EntomliaCMS</title>
      </Helmet>
      <div>
        <h1>{t('Start')}</h1>
      </div>
    </ContainerWithSpace>
  )
};
