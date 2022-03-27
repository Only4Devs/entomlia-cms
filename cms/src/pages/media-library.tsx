import React, {useContext, useState} from 'react';
import ContainerWithSpace from '../components/layout/container-with-space';
import {LayoutContext} from '../hooks/layout-context';
import PageTitle from '../components/layout/common/page-title';
import {useTranslation} from 'react-i18next';
import BoxContainer from '../components/layout/common/box-container';
import {useDropzone} from 'react-dropzone';
import {
  AddDirectoryLabelStyled,
  AddDirectoryStyled,
  AddIconStyled, DeleteIconStyled, EditIconStyled, EmptyImageStyled,
  FileItemStyled, FilePreviewStyled,
  FilesContainerStyled, FileTitleStyled, FileUploadLabelStyled, FileUploadStyled
} from '../styled/media-library';
import {ButtonTopStyled, TopHeaderStyled} from '../styled/layout-common';
import {useNavigate, useParams} from 'react-router-dom';
import ModalMediaDirectory from '../components/layout/modal/modal-media-directory';
import useMediaLibraryDirectory from '../hooks/use-media-library-directory';
import MediaLibraryDirectory from '../classes/media-library-directory';
import LoadingOverlay from '../components/layout/common/loading-overlay';
import useMediaLibrary from '../hooks/use-media-library';
import MediaLibraryFile from '../classes/media-library-file';
import DialogConfirmation from '../components/dialog/dialog-confirmation';

export default function MediaLibrary() {
  const {t} = useTranslation();
  const {slug} = useParams();
  const navigate = useNavigate();
  const {getFiles} = useMediaLibrary();
  const [files, setFiles] = useState<Array<MediaLibraryFile>>([]);
  const {getListing, createDirectory, updateDirectory, deleteDirectory} = useMediaLibraryDirectory();
  const {layout, setLayout} = useContext(LayoutContext);
  const [filesBeforeUpload, setFilesBeforeUpload] = useState<Array<any>>([]);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [directories, setDirectories] = useState<Array<MediaLibraryDirectory>>([]);
  const [rowToEdit, setRowToEdit] = useState<MediaLibraryDirectory | null>(null);
  const [rowToDelete, setRowToDelete] = useState<MediaLibraryDirectory | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
    onDrop: acceptedFiles => {
      setFilesBeforeUpload(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file),
        uploading: true
      })));
    }
  });

  React.useEffect(() => {
    setLayout((prevLayout: any) => ({
      ...prevLayout,
      ['sideMenu']: 'media-library',
      ['sideMenuContent']: '',
    }));

    (async () => {
      try {
        await loadDirectories();
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  React.useEffect(() => {
    console.log('dir---slug', slug);
    (async () => {
      try {
        const response = await getFiles(slug || null);
        console.log('files response', response);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [slug]);

  const loadDirectories = async () => {
    const rows: Array<MediaLibraryDirectory> = await getListing();
    setDirectories([...rows]);
    console.log('rows', rows);
  };

  const configureSizes = () => {
    navigate('/media-sizes');
  };

  const showAddDirectory = () => {
    setShowOpenModal(true);
  };

  const handleShowOpenModalClose = () => {
    setShowOpenModal(false);
  };

  const handleEdit = (e: React.MouseEvent, row: MediaLibraryDirectory, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setRowToEdit(row);
    setShowOpenModal(true);
  };

  const handleDelete = (e: React.MouseEvent, row: MediaLibraryDirectory, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setRowToDelete(row);
    setShowConfirmation(true);
  };

  const handleModalResult = async (output: any) => {
    handleShowOpenModalClose();
    if (output !== undefined && output !== null) {
      if (output.id !== undefined && output.id !== null) {
        await updateDirectory(rowToEdit!!.id, output);
        await loadDirectories();
      } else {
        try {
          await createDirectory(output);
          await loadDirectories();
          setRowToEdit(null);
        } catch (e) {
          console.log(e);
        }
      }
    }
  };

  const openDirectory = (dir: MediaLibraryDirectory) => {
    navigate(`/media-library/${dir.slug}`);
  };

  const openMediaLibraryHome = () => {
    navigate('/media-library');
  };

  const closeConfirmation = () => {
    setRowToDelete(null);
    setShowConfirmation(false);
  };

  const confirmDelete = async () => {
    if (rowToDelete !== null) {
      try {
        await deleteDirectory(rowToDelete.id);
        await loadDirectories();
      } catch (e) {
        console.log(e);
      }
      closeConfirmation();
    }
  };

  return (
    <ContainerWithSpace>
      <TopHeaderStyled>
        <PageTitle title={t('Media library')} />
        <ButtonTopStyled variant="contained" color="warning" size={'small'}
                         onClick={configureSizes}>{t('Configure sizes')}</ButtonTopStyled>
      </TopHeaderStyled>
      <BoxContainer>
        <FilesContainerStyled>
          {slug !== undefined && slug !== null ? (
            <FileItemStyled onClick={openMediaLibraryHome}>
              <AddDirectoryStyled>
                <AddIconStyled className={'fa fa-angle-left'} />
                <AddDirectoryLabelStyled>{t('Back')}</AddDirectoryLabelStyled>
              </AddDirectoryStyled>
            </FileItemStyled>
          ) : (
            <FileItemStyled onClick={showAddDirectory}>
              <AddDirectoryStyled>
                <AddIconStyled className={'fa fa-plus-circle'} />
                <AddDirectoryLabelStyled>{t('Add directory')}</AddDirectoryLabelStyled>
              </AddDirectoryStyled>
            </FileItemStyled>
          )}
          <FileItemStyled>
            <FileUploadStyled {...getRootProps({className: 'dropzone'})}>
              <AddIconStyled className={'fa fa-upload'} />
              <input {...getInputProps()} />
              <FileUploadLabelStyled>{t('Drag \'n\' drop some files here, or click here')}</FileUploadLabelStyled>
            </FileUploadStyled>
          </FileItemStyled>
          {slug === undefined || slug === null ? (
            directories.map((dir: MediaLibraryDirectory, index: number) => (
              <FileItemStyled key={`Dir_${dir.slug}`} onClick={() => openDirectory(dir)}>
                <AddDirectoryStyled>
                  <AddIconStyled className={'fa fa-folder-open'} />
                  <AddDirectoryLabelStyled>{dir.title}</AddDirectoryLabelStyled>
                  <EditIconStyled className={'fa fa-edit'}
                                  onClick={(e: React.MouseEvent<HTMLElement>) => handleEdit(e, dir, index)} />
                  <DeleteIconStyled className={'fa fa-trash'}
                                    onClick={(e: React.MouseEvent<HTMLElement>) => handleDelete(e, dir, index)} />
                </AddDirectoryStyled>
              </FileItemStyled>
            ))
          ) : (
            <></>
          )}
          {filesBeforeUpload.map((file: any) => (
            <FileItemStyled key={file.path}>
              <EmptyImageStyled />
              <FilePreviewStyled src={file.preview} />
              <FileTitleStyled>{file.path}</FileTitleStyled>
              {file.uploading && <LoadingOverlay />}
            </FileItemStyled>
          ))}
        </FilesContainerStyled>
      </BoxContainer>
      <ModalMediaDirectory showOpenModal={showOpenModal} onClose={handleShowOpenModalClose}
                           inputEditMediaLibraryDirectory={rowToEdit}
                           onModalResult={handleModalResult} />
      <DialogConfirmation showDialog={showConfirmation} title={t('Delete confirmation')} onClose={closeConfirmation}
                          onConfirm={confirmDelete} content={t('This operation cannot be undone.')} />
    </ContainerWithSpace>
  )
}
