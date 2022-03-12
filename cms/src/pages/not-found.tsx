import React, {useContext} from 'react';
import ContainerWithSpace from '../components/layout/container-with-space';
import {LayoutContext} from '../hooks/layout-context';

export default function NotFound() {
  const {layout, setLayout} = useContext(LayoutContext);

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
      <h1>404.<br />Not found</h1>
    </ContainerWithSpace>
  )
}
