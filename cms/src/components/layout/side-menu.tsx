import React, {useContext} from 'react';
import {Drawer, Toolbar} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {CollectionType, LayoutContext} from '../../hooks/layout-context';
import useLogout from '../../hooks/use-logout';
import styled from '@emotion/styled';
import {css, cx} from '@emotion/css';
import useCollectionType from '../../hooks/use-collection-type';
import MenuListLink from './side-menu/menu-list-link';
import MenuIcon from './side-menu/menu-icon';
import MenuSeparator from './side-menu/menu-separator';
import MenuList from './side-menu/menu-list';
import {useNavigate} from 'react-router-dom';
import useAuth from '../../hooks/use-auth';
import {UserContext} from '../../hooks/user-context';

const DrawerStyled = styled(Drawer)((props: any) => (`
  flex-shrink: 0;
  transition: all 300ms ease-in-out;
`));

const InnerDrawerContentStyled = styled('div')((props: any) => (`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 300ms ease-in-out;
`));

const DrawerContainerStyled = styled('div')`
  overflow: auto;
  flex: 1 1 100%;
`;

const SideMenuContainerStyled = styled('div')`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
`;

const ToolbarStyled = styled(Toolbar)`
  min-height: 40px !important;
`;

const MenuListWithoutBorderStyled = styled('ul')`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const StylesMenuItem = `
  color: #333;
  text-decoration: none;
  transition: all 300ms ease-in-out;
  padding: 10px;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #e8e8e8;
    cursor: pointer;
  }
`;

const MenuListLinkAsDivStyled = styled('div')((props: any) => (`
  ${StylesMenuItem}
`));

const MenuListItemTitleStyled = styled('span')`
  padding-left: 10px;
  white-space: nowrap;
`;

const MenuListBottomStyled = styled('div')`
  margin-top: 15px;
  position: relative;

  &:before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 15px;
    right: 15px;
    border-top: 1px solid #ccc;
  }
`;

export default function SideMenu({drawerWidth}: any) {
  const {logoutUser} = useLogout();
  const {layout, setLayout} = useContext(LayoutContext);
  const {setUser} = useContext(UserContext);
  const {getCollectionTypes} = useCollectionType();
  const {t, i18n} = useTranslation();
  const {logout} = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    (async () => {
      try {
        const rows = await getCollectionTypes() as Array<CollectionType>;
        setLayout((prevLayout: any) => ({
          ...prevLayout,
          ['collectionTypes']: rows
        }));
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      await logout();
      setUser(null);
      navigate('/');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <DrawerStyled anchor={'left'} variant="permanent" className={css`width: ${drawerWidth}px;`}>
      <InnerDrawerContentStyled className={css`width: ${drawerWidth}px`}>
        <ToolbarStyled />
        <DrawerContainerStyled>
          <SideMenuContainerStyled>
            <div>
              <MenuList>
                <MenuListLink icon={'fa fa-home'} label={t('Start')} to={'/home'} drawerWidth={drawerWidth}
                              currentPath={layout.sideMenu} pathName={'home'} />
                <MenuListLink icon={'fa fa-layer-group'} label={t('Define types')} to={'/define-types'}
                              drawerWidth={drawerWidth} currentPath={layout.sideMenu} pathName={'define-types'} />
                <MenuListLink icon={'fa fa-images'} label={t('Media library')} to={'/media-library'}
                              drawerWidth={drawerWidth} currentPath={layout.sideMenu} pathName={'media-library'} />
                <MenuListLink icon={'fa fa-cog'} label={t('Settings')} to={'/settings'} drawerWidth={drawerWidth}
                              currentPath={layout.sideMenu} pathName={'settings'} />
              </MenuList>
              <MenuSeparator drawerWidth={drawerWidth} label={t('Management')} />
              <MenuListWithoutBorderStyled>
                {layout.collectionTypes && layout.collectionTypes.map((collectionType: CollectionType) => (
                  <MenuListLink icon={collectionType.icon} label={collectionType.title}
                                key={`SideMenuCollectionType${collectionType.id}`}
                                to={`/listing/${collectionType.slug}`}
                                drawerWidth={drawerWidth} currentPath={layout.sideMenuContent}
                                pathName={collectionType.slug} />
                ))}
              </MenuListWithoutBorderStyled>
            </div>
            <MenuListBottomStyled>
              <MenuList>
                <li>
                  <MenuListLinkAsDivStyled onClick={handleLogout} className={css`
                    justify-content: ${drawerWidth === 240 ? 'flex-start' : 'center'};
                  `}>
                    <MenuIcon icon={'fa fa-sign-out-alt'} />
                    {drawerWidth === 240 ? <MenuListItemTitleStyled>{t('Logout')}</MenuListItemTitleStyled> : <></>}
                  </MenuListLinkAsDivStyled>
                </li>
              </MenuList>
            </MenuListBottomStyled>
          </SideMenuContainerStyled>
        </DrawerContainerStyled>
      </InnerDrawerContentStyled>
    </DrawerStyled>
  )
}
