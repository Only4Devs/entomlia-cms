import React, {useContext} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import ContainerWithSpace from '../../components/layout/container-with-space';
import {CollectionType, CollectionTypeField, LayoutContext} from '../../hooks/layout-context';
import PageTitle from '../../components/layout/common/page-title';
import {useTranslation} from 'react-i18next';
import styled from '@emotion/styled';
import {Button, Menu, MenuItem} from '@mui/material';
import BoxContainer from '../../components/layout/common/box-container';
import EmptyState from '../../components/layout/common/empty-state';
import useContent from '../../hooks/use-content';
import MenuIcon from '../../components/layout/side-menu/menu-icon';
import useCollectionType from '../../hooks/use-collection-type';
import {FieldType} from '../../classes/field-type';
import MenuItemLabel from '../../components/layout/side-menu/menu-item-label';

const TopHeaderStyled = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ThRightStyled = styled('th')`
  text-align: right;
`;

const EmptyStateHolderStyled = styled('div')`
  padding-top: 50px;
  padding-bottom: 30px;
`;

const ButtonTopStyled = styled(Button)`
  margin-left: 15px;
`;

const ScrollableTableStyled = styled('div')`
  overflow-y: auto;
`;

export default function Listing() {
  const {slug} = useParams();
  const navigate = useNavigate();
  const {t} = useTranslation();
  const {layout, setLayout} = useContext(LayoutContext);
  const {getListing} = useContent();
  const {getCollectionType} = useCollectionType();
  const [rows, setRows] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [fields, setFields] = React.useState<Array<CollectionTypeField|FieldType>>([]);

  React.useEffect(() => {
    if (slug !== undefined && slug !== null) {
      setLayout({
        ...layout,
        sideMenu: 'listing',
        sideMenuContent: slug
      });

      (async () => {
        try {
          const collectionType: CollectionType = await getCollectionType(slug);
          if (collectionType !== undefined && collectionType !== null) {
            if (collectionType.fields !== undefined && collectionType.fields !== null) {
              const arr: Array<CollectionTypeField|FieldType> = [];
              collectionType.fields.forEach((field: CollectionTypeField|FieldType) => {
                if (['id', 'createdAt', 'updatedAt'].indexOf(field.slug!!) === -1) {
                  arr.push(field);
                }
              });
              setFields(arr);
            }
          }
        } catch (e) {
          console.log(e);
        }
        try {
          const result = await getListing(slug);
          setRows(result);
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [slug]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const navigateToNewRecordForm = () => {
    navigate(`/listing/${slug}/new`);
  };

  const navigateToConfigureForm = () => {
    navigate(`/listing/configure/form/${slug}`);
  };

  return (
    <ContainerWithSpace>
      <TopHeaderStyled>
        <PageTitle title={`${t('Listing')}: ${slug}`} />
        <div>
          <ButtonTopStyled variant="contained" color="warning" size={'small'}
                           onClick={navigateToConfigureForm}>{t('Configure')}</ButtonTopStyled>
          <ButtonTopStyled variant="contained" color="primary" size={'small'}
                           onClick={navigateToNewRecordForm}>{t('Add new')}</ButtonTopStyled>
        </div>
      </TopHeaderStyled>
      <BoxContainer>
        <ScrollableTableStyled>
          <table>
            <thead>
            <tr>
              <th>{t('ID')}</th>
              {fields.map((it, index) => <th key={`TableTh${index}`}>{it.title}</th>)}
              <th>{t('Created At')}</th>
              <th>{t('Updated At')}</th>
              <ThRightStyled>{t('Actions')}</ThRightStyled>
            </tr>
            </thead>
            <tbody>
            {rows.map((row, index) => (
              <tr key={`Table_${slug}_${index}`}>
                <td>{row[`id`]}</td>
                {fields.map((it, index) => (
                  <td key={`TableCell${index}`}>
                    {row[it.slug!!]}
                  </td>
                ))}
                <td>{row[`createdAt`]}</td>
                <td>{row[`updatedAt`]}</td>
                <td>
                  <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                  >
                    <MenuIcon icon={'fa fa-ellipsis-h'} />
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem onClick={handleClose}>
                      <MenuIcon icon={'fa fa-edit'} />
                      <MenuItemLabel title={t('Edit')}/>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <MenuIcon icon={'fa fa-trash'} />
                      <MenuItemLabel title={t('Delete')}/>
                    </MenuItem>
                  </Menu>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </ScrollableTableStyled>
        {rows.length === 0 && (
          <EmptyStateHolderStyled>
            <EmptyState description={'No records have been added yet.'} buttonLabel={'Add new'}
                        buttonOnClick={navigateToNewRecordForm} />
          </EmptyStateHolderStyled>
        )}
      </BoxContainer>
    </ContainerWithSpace>
  )
}
