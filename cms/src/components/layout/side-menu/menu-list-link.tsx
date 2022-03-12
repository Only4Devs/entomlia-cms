import React from 'react';
import styled from '@emotion/styled';
import {css, cx} from '@emotion/css';
import {Link} from 'react-router-dom';
import MenuIcon from './menu-icon';

interface MenuItemProps {
  drawerWidth: number;
  currentPath: string;
  pathName: string;
  darkerActive?: boolean;
}

interface MenuLinkItemProps extends MenuItemProps {
  icon: string;
  label: string;
  to: string;
}

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

const MenuListLinkStyled = styled(Link)((props: any) => (`
  ${StylesMenuItem}
`));

const MenuListItemTitleStyled = styled('span')`
  padding-left: 10px;
  white-space: nowrap;
`;

export default function MenuListLink({drawerWidth, pathName, currentPath, to, icon, label, darkerActive = false}: MenuLinkItemProps) {
  return (
    <li>
      <MenuListLinkStyled to={to}
                          className={css`
                            justify-content: ${drawerWidth === 240 ? 'flex-start' : 'center'};
                            background-color: ${currentPath === pathName ? (darkerActive ? '#d5e2ff' : '#eff4ff') : 'transparent'};
                          `}>
        <MenuIcon icon={icon} />
        {drawerWidth === 240 ? <MenuListItemTitleStyled>{label}</MenuListItemTitleStyled> : <></>}
      </MenuListLinkStyled>
    </li>
  )
}