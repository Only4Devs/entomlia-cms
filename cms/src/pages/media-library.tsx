import React, {useContext} from 'react';
import ContainerWithSpace from '../components/layout/container-with-space';
import {LayoutContext} from '../hooks/layout-context';
import PageTitle from '../components/layout/common/page-title';
import {useTranslation} from 'react-i18next';

export default function MediaLibrary() {
  const {t} = useTranslation();
  const {layout, setLayout} = useContext(LayoutContext);

  React.useEffect(() => {
    setLayout((prevLayout: any) => ({
      ...prevLayout,
      ['sideMenu']: 'media-library',
      ['sideMenuContent']: '',
    }));
  }, []);

  return (
    <ContainerWithSpace>
      <PageTitle title={t('Media library')} />
    </ContainerWithSpace>
  )
}
