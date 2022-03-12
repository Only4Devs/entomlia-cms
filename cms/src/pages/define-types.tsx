import React, {useContext} from 'react';
import {Route, Routes} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {Helmet} from 'react-helmet-async';
import {LayoutContext} from '../hooks/layout-context';
import TemplateDefineTypes from '../components/layout/template-define-types';
import PrivateRoute from './private-route';
import Configure from './define-types/configure';
import NotFound from './not-found';
import DefineTypesHome from './define-types/define-types-home';
import NewCollectionType from './define-types/new-collection-type';

export default function DefineTypes() {
  const {t} = useTranslation();
  const {layout, setLayout} = useContext(LayoutContext);

  React.useEffect(() => {
    setLayout((prevLayout: any) => ({
      ...prevLayout,
      ['sideMenu']: 'define-types',
      ['sideMenuContent']: '',
    }));
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('Define types')} | EntomliaCMS</title>
      </Helmet>
      <TemplateDefineTypes>
        <Routes>
          <Route path="/" element={<PrivateRoute><DefineTypesHome /></PrivateRoute>} />
          <Route path="/new" element={<PrivateRoute><NewCollectionType /></PrivateRoute>} />
          <Route path="/configure/:slug" element={<PrivateRoute><Configure /></PrivateRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TemplateDefineTypes>
    </>
  )
};
