import React, {useContext, useState} from 'react';
import ContainerWithSpace from '../components/layout/container-with-space';
import {LayoutContext} from '../hooks/layout-context';
import PageTitle from '../components/layout/common/page-title';
import {useTranslation} from 'react-i18next';
import BoxContainer from '../components/layout/common/box-container';
import {
  ButtonTopStyled,
  ColumnActionsStyled,
  EmptyStateHolderStyled,
  ScrollableTableStyled,
  TopHeaderStyled
} from '../styled/layout-common';
import ModalMediaSize from '../components/layout/modal/modal-media-size';
import {useNavigate} from 'react-router-dom';
import TableLoader from '../components/layout/table-loader';
import EmptyState from '../components/layout/common/empty-state';
import useMediaSize from '../hooks/use-media-size';
import MediaSize from '../classes/media-size';
import ActionIcon from '../components/layout/common/action-icon';
import DialogConfirmation from '../components/dialog/dialog-confirmation';

export default function MediaSizes() {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {layout, setLayout} = useContext(LayoutContext);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const {getListing, createSize, updateSize, deleteSize} = useMediaSize();
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [rowToDelete, setRowToDelete] = useState<MediaSize | null>(null);
  const [rowToEdit, setRowToEdit] = useState<MediaSize | null>(null);

  React.useEffect(() => {
    setLoading(true);
    setRows([]);
    setLayout((prevLayout: any) => ({
      ...prevLayout,
      ['sideMenu']: 'media-library',
      ['sideMenuContent']: '',
    }));

    (async () => {
      await loadListing();
    })();
  }, []);

  const loadListing = async () => {
    try {
      const result = await getListing();
      setRows(result);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleShowOpenModalClose = () => {
    setShowOpenModal(false);
  };

  const handleModalResult = async (output: any) => {
    console.log('output', output);
    handleShowOpenModalClose();
    if (output !== undefined && output !== null) {
      if (output.id !== undefined && output.id !== null) {
        await updateSize(rowToEdit!!.id, output);
        await loadListing();
      } else {
        try {
          await createSize(output);
          await loadListing();
        } catch (e) {
          console.log(e);
        }
      }
    }
  }

  const goBack = () => {
    navigate('/media-library');
  };

  const configureSize = () => {
    setShowOpenModal(true);
  };

  const handleEdit = (row: MediaSize, index: number) => {
    setRowToEdit(row);
    setShowOpenModal(true);
  };

  const handleDelete = (row: MediaSize, index: number) => {
    setRowToDelete(row);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (rowToDelete !== null) {
      const index = rows.findIndex((mediaSize: MediaSize) => mediaSize.id === rowToDelete.id);
      console.log('delete--index', index);
      try {
        await deleteSize(rowToDelete.id);
        await loadListing();
      } catch (e) {
        console.log(e);
      }
      closeConfirmation();
    }
  };

  const closeConfirmation = () => {
    setRowToDelete(null);
    setShowConfirmation(false);
  };

  return (
    <ContainerWithSpace>
      <TopHeaderStyled>
        <PageTitle title={t('Media library')} />
        <div>
          <ButtonTopStyled variant="contained" color="inherit" size={'small'}
                           onClick={goBack}>{t('Back')}</ButtonTopStyled>
          <ButtonTopStyled variant="contained" color="primary" size={'small'}
                           onClick={configureSize}>{t('Add new')}</ButtonTopStyled>
        </div>
      </TopHeaderStyled>
      <BoxContainer>
        {!loading && (
          <ScrollableTableStyled>
            <table>
              <thead>
              <tr>
                <th>{t('Name')}</th>
                <th>{t('Width')}</th>
                <th>{t('Height')}</th>
                <th>{t('Resize mode')}</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              {rows.map((row: MediaSize, index: number) => (
                <tr key={`TableTr${index}`}>
                  <td>{row.title}</td>
                  <td>{row.width || '-'}</td>
                  <td>{row.height || '-'}</td>
                  <td>
                    {row.mode === 'crop' ? t('Crop') : ''}
                    {row.mode === 'resize' ? t('Resize') : ''}
                  </td>
                  <ColumnActionsStyled>
                    <ActionIcon icon={'fa fa-edit hoverable'} color={'primary'} title={t('Edit')}
                                onClick={() => handleEdit(row, index)} />
                    <ActionIcon icon={'fa fa-trash-alt hoverable'} color={'error'} title={t('Delete')}
                                onClick={() => handleDelete(row, index)} />
                  </ColumnActionsStyled>
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
                        buttonOnClick={configureSize} />
          </EmptyStateHolderStyled>
        )}
      </BoxContainer>
      <ModalMediaSize showOpenModal={showOpenModal} onClose={handleShowOpenModalClose}
                      onModalResult={handleModalResult} inputEditMediaSize={rowToEdit !== null ? rowToEdit : null} />
      <DialogConfirmation showDialog={showConfirmation} title={t('Delete confirmation')} onClose={closeConfirmation}
                          onConfirm={confirmDelete} content={t('This operation cannot be undone.')} />
    </ContainerWithSpace>
  )
}
