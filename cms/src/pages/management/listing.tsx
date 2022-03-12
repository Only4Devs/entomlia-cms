import React, {useContext} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import ContainerWithSpace from '../../components/layout/container-with-space';
import {LayoutContext} from '../../hooks/layout-context';
import PageTitle from '../../components/layout/common/page-title';
import {useTranslation} from 'react-i18next';
import styled from '@emotion/styled';
import {Button} from '@mui/material';
import BoxContainer from '../../components/layout/common/box-container';
import EmptyState from '../../components/layout/common/empty-state';

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

export default function Listing() {
  const {slug} = useParams();
  const navigate = useNavigate();
  const {t} = useTranslation();
  const {layout, setLayout} = useContext(LayoutContext);
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    if (slug !== undefined && slug !== null) {
      setLayout({
        ...layout,
        sideMenu: 'listing',
        sideMenuContent: slug
      });
    }
  }, [slug]);

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
        <table>
          <thead>
          <tr>
            <th>{t('ID')}</th>
            <ThRightStyled>{t('Actions')}</ThRightStyled>
          </tr>
          </thead>
          <tbody>
          {rows.map((row, index) => (
            <tr key={`Table_${slug}_${index}`}>
              <td>{row[`id`]}</td>
              <td>
                <Button variant="contained" color="primary" size={'small'}>{t('Edit')}</Button>
                <Button variant="contained" color="secondary" size={'small'}>{t('Delete')}</Button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
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
