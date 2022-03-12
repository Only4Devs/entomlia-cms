import React, {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import {LayoutContext} from '../../hooks/layout-context';

export default function DefineTypesHome() {
  const {layout} = useContext(LayoutContext);

  if (layout.collectionTypes) {
    return <Navigate to={`/define-types/configure/${layout.collectionTypes[0].slug}`} />;
  } else {
    return <Navigate to="/define-types/configure/new" />;
  }
}
