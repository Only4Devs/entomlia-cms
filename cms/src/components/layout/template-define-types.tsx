import React, {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import styled from '@emotion/styled';
import {CollectionType, LayoutContext} from '../../hooks/layout-context';
import MenuListLink from './side-menu/menu-list-link';
import MenuList from './side-menu/menu-list';

const ContainerStyled = styled('div')`
  display: flex;
  height: 100%;
`;

const SideMenuStyled = styled('div')`
  width: 240px;
  border-right: 1px solid #e0e0e0;
  background-color: #fdfcfc;
`;

const ContentStyled = styled('div')`
  width: calc(100% - 240px);
`;

const HeaderStyled = styled('h1')`
  font-size: 16px;
  padding-left: 8px;
  padding-right: 8px;
`;

export default function TemplateDefineTypes({children}: any) {
  const {t, i18n} = useTranslation();
  const {layout} = useContext(LayoutContext);

  return (
    <ContainerStyled>
      <SideMenuStyled>
        <HeaderStyled>{t('Define types')}</HeaderStyled>
        <MenuList>
          {layout.collectionTypes && layout.collectionTypes.map((collectionType: CollectionType) => (
            <MenuListLink icon={collectionType.icon} label={collectionType.title}
                          key={`InnerMenuCollectionType${collectionType.id}`}
                          to={`/define-types/configure/${collectionType.slug}`}
                          drawerWidth={240} currentPath={layout.sideMenuCollectionType}
                          pathName={collectionType.slug} darkerActive={true} />
          ))}
          <div>
            <MenuListLink icon={'fas fa-plus'} label={t('Add new')}
                          key={`InnerMenuCollectionTypeNew`}
                          to={`/define-types/new`}
                          drawerWidth={240} currentPath={layout.sideMenuCollectionType}
                          pathName={'new'} />
          </div>
        </MenuList>
      </SideMenuStyled>
      <ContentStyled>
        {children}
      </ContentStyled>
    </ContainerStyled>
  )
}
