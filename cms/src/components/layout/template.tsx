import React, {useContext, Suspense} from 'react';
import {
  AppBar,
  Button,
  Container,
  Icon,
  LinearProgress,
  Menu,
  MenuItem,
  Toolbar
} from '@mui/material';
import {UserContext} from '../../hooks/user-context';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {ShowLoaderContext} from '../../hooks/show-loader-context';
import useProfile from '../../hooks/use-profile';
import SideMenu from './side-menu';
import styled from '@emotion/styled';

const RootStyled = styled('div')`
  display: flex;
  height: 100%;
`;

const AppBarStyled = styled(AppBar)`
  z-index: ${(props: any) => props.theme.zIndex.drawer + 1};
`;

const ToolbarStyled = styled(Toolbar)`
  min-height: 40px !important;
`;

const TopToolbarStyled = styled(Toolbar)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  min-height: 40px !important;
`;

const LogoLinkStyled = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: #FFF;
  text-decoration: none;
  font-weight: 600;
`;

const RightContentStyled = styled('div')`
  display: flex;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`;

const ButtonLanguageStyled = styled(Button)`
  color: #FFF;
  font-size: 14px;
`;

const MenuLangLabelStyled = styled(MenuItem)`
  font-size: 14px;
`;

const MenuIconStyled = styled(Icon)`
  font-size: 18px;
`;

const TopLoaderStyled = styled(LinearProgress)`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
`;

const ContentStyled = styled('main')`
  flex-grow: 1;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const ContainerFullStyled = styled(Container)((props: any) => (`
  max-width: 100%;
  margin-left: 0;
  transition: all 300ms ease-in-out;
  min-width: 100%;
  height: 100%;
  @media (min-width: 600px) {
    padding-left: 0;
    padding-right: 0;
  }
`));

const LogoImageStyled = styled('img')`
  height: 35px;
`;

export default function Template({children}: any) {
  const {t, i18n} = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const {user} = useContext(UserContext);
  const {showLoader} = useContext(ShowLoaderContext);
  const {changeLanguage} = useProfile();
  const [drawerWidth, setDrawerWidth] = React.useState(240);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (lang: string | null) => {
    if (lang) {
      i18n.changeLanguage(lang);
      if (user !== undefined && user !== null) {
        changeLanguage(lang);
      }
    }
    setAnchorEl(null);
  };

  return (
    <Suspense fallback="loading">
      {user && (
        <AppBarStyled position="fixed" color="primary">
          <TopToolbarStyled>
            <LogoLinkStyled to={'/'}>
              <span><LogoImageStyled src={'/logo.svg'} /></span>
            </LogoLinkStyled>
            <RightContentStyled>
              <ButtonLanguageStyled aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                {i18n.language.toUpperCase()}
              </ButtonLanguageStyled>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => handleClose(null)}>
                <MenuLangLabelStyled onClick={() => handleClose('pl')}>PL</MenuLangLabelStyled>
                <MenuLangLabelStyled onClick={() => handleClose('en')}>EN</MenuLangLabelStyled>
              </Menu>
              <MenuIconStyled className={`fa fa-bars`}
                              onClick={() => setDrawerWidth(drawerWidth === 240 ? 60 : 240)} />
            </RightContentStyled>
            {showLoader ? <TopLoaderStyled /> : <></>}
          </TopToolbarStyled>
        </AppBarStyled>
      )}

      <RootStyled>
        {user ? <SideMenu drawerWidth={drawerWidth} /> : <></>}
        <ContentStyled>
          <ToolbarStyled />
          <ContainerFullStyled>
            {children}
          </ContainerFullStyled>
        </ContentStyled>
      </RootStyled>
    </Suspense>
  )
}
