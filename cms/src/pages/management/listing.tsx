import React, {useContext, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import ContainerWithSpace from '../../components/layout/container-with-space';
import {CollectionType, CollectionTypeField, LayoutContext} from '../../hooks/layout-context';
import PageTitle from '../../components/layout/common/page-title';
import {useTranslation} from 'react-i18next';
import styled from '@emotion/styled';
import {Button, Checkbox, FormControlLabel, Popover} from '@mui/material';
import BoxContainer from '../../components/layout/common/box-container';
import EmptyState from '../../components/layout/common/empty-state';
import useContent from '../../hooks/use-content';
import useCollectionType from '../../hooks/use-collection-type';
import {FieldType} from '../../classes/field-type';
import TableLoader from '../../components/layout/table-loader';
import {
  ButtonTopStyled,
  EmptyStateHolderStyled,
  ScrollableTableStyled,
  TopHeaderStyled
} from '../../styled/layout-common';
import DialogConfirmation from '../../components/dialog/dialog-confirmation';
import ActionDropdown from '../../components/table/action-dropdown';

const ThRightStyled = styled('th')`
  text-align: right;
`;

const PopoverContentListStyled = styled('div')`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0 10px;
  max-height: 70vh;
  max-width: 320px;
  min-width: 320px;
`;

const FormControlLabelStyled = styled(FormControlLabel)`
  margin-right: 0;
  flex: 1 1 calc(50% - 15px);
  word-break: break-all;
  padding-right: 15px;
`;

export default function Listing() {
  const {slug} = useParams();
  const navigate = useNavigate();
  const {t} = useTranslation();
  const {layout, setLayout} = useContext(LayoutContext);
  const {getListing} = useContent();
  const {getCollectionType, updateField} = useCollectionType();
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [fields, setFields] = React.useState<Array<CollectionTypeField | FieldType>>([]);
  const [anchorPopoverEl, setAnchorPopoverEl] = React.useState<null | HTMLElement>(null);
  const openPopover = Boolean(anchorPopoverEl);

  React.useEffect(() => {
    if (slug !== undefined && slug !== null) {
      setLoading(true);
      setRows([]);
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
              const arr: Array<CollectionTypeField | FieldType> = [];
              collectionType.fields.forEach((field: CollectionTypeField | FieldType) => {
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
        await getNewListing()
      })();
    }
  }, [slug]);

  const getNewListing = async () => {
    try {
      const result = await getListing(slug!!);
      setRows(result);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handlePopoverClose = () => {
    setAnchorPopoverEl(null);
  };

  const handlePopoverClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorPopoverEl(event.currentTarget);
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
          <ButtonTopStyled aria-describedby={'configure-view-popover'} variant="contained" color="warning"
                           size={'small'} onClick={handlePopoverClick}>
            {t('Configure view')}
          </ButtonTopStyled>
          <Popover
            id={'configure-view-popover'}
            open={openPopover}
            anchorEl={anchorPopoverEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <PopoverContentListStyled>
              {fields.map((it, index) => (
                <FormControlLabelStyled
                  key={`ColumnVisibility-${it.slug}`}
                  label={it.title}
                  control={
                    <Checkbox
                      checked={it.showOnListing}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                        console.log('event.target.checked', event.target.checked, checked);
                        it.showOnListing = checked;
                        fields[index].showOnListing = checked;
                        setFields([...fields]);
                        (async () => {
                          try {
                            await updateField(it.id!!, {showOnListing: checked, id: it.id!!});
                          } catch (e) {
                            console.log(e);
                          }
                        })();
                      }}
                    />
                  }
                />
              ))}
            </PopoverContentListStyled>
          </Popover>

          <ButtonTopStyled variant="contained" color="warning" size={'small'}
                           onClick={navigateToConfigureForm}>{t('Configure form')}</ButtonTopStyled>
          <ButtonTopStyled variant="contained" color="primary" size={'small'}
                           onClick={navigateToNewRecordForm}>{t('Add new')}</ButtonTopStyled>
        </div>
      </TopHeaderStyled>
      <BoxContainer>
        {!loading && (
          <ScrollableTableStyled>
            <table>
              <thead>
              <tr>
                <th>{t('ID')}</th>
                {fields.filter(x => x.showOnListing).map((it, index) => <th key={`TableTh${index}`}>{it.title}</th>)}
                <th>{t('Created At')}</th>
                <th>{t('Updated At')}</th>
                <ThRightStyled />
              </tr>
              </thead>
              <tbody>
              {rows.map((row, index) => (
                <tr key={`Table_${slug}_${index}`}>
                  <td>{row[`id`]}</td>
                  {fields.filter(x => x.showOnListing).map((it, index) => (
                    <td key={`TableCell${index}`}>
                      {row[it.slug!!]}
                    </td>
                  ))}
                  <td>{row[`createdAt`]}</td>
                  <td>{row[`updatedAt`]}</td>
                  <td>
                    <ActionDropdown slug={slug!!} id={row[`id`]} index={index} reloadListing={getNewListing} />
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </ScrollableTableStyled>
        )}
        {loading && <TableLoader />}
        {!loading && rows.length === 0 && (
          <EmptyStateHolderStyled>
            <EmptyState description={'No records have been added yet.'} buttonLabel={'Add new'}
                        buttonOnClick={navigateToNewRecordForm} />
          </EmptyStateHolderStyled>
        )}
      </BoxContainer>
    </ContainerWithSpace>
  )
}
