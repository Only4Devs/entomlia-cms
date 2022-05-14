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
import {Alert, Snackbar} from '@mui/material';

export default function MediaLibrary() {
  const {t} = useTranslation();
  const {slug} = useParams();
  const navigate = useNavigate();
  const {getFiles, uploadFile, deleteFile} = useMediaLibrary();
  const [files, setFiles] = useState<Array<MediaLibraryFile>>([]);
  const {getListing, createDirectory, updateDirectory, deleteDirectory} = useMediaLibraryDirectory();
  const {layout, setLayout} = useContext(LayoutContext);
  const [filesBeforeUpload, setFilesBeforeUpload] = useState<Array<any>>([]);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [mediaDirectory, setMediaDirectory] = useState<MediaLibraryDirectory | null>(null);
  const [directories, setDirectories] = useState<Array<MediaLibraryDirectory>>([]);
  const [rowToEdit, setRowToEdit] = useState<MediaLibraryDirectory | null>(null);
  const [rowToDelete, setRowToDelete] = useState<MediaLibraryDirectory | null>(null);
  const [fileToDelete, setFileToDelete] = useState<MediaLibraryFile | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [showConfirmationFile, setShowConfirmationFile] = useState<boolean>(false);
  const [openPleaseWait, setOpenPleaseWait] = useState<boolean>(false);
  const {acceptedFiles, getRootProps, getInputProps,} = useDropzone({
    disabled: filesBeforeUpload.length > 0,
    onDrop: acceptedFiles => {
      setFilesBeforeUpload(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file),
        uploading: true,
        currentUploading: false,
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
    if (slug === undefined || slug === null) {
      setMediaDirectory(null);
      setFiles([]);
    } else {
      const found = directories.find(dir => dir.slug === slug);
      if (found !== undefined) {
        setMediaDirectory(found);
      }
    }
    (async () => {
      try {
        const response = await getFiles(slug || null);
        setFiles(response);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [slug]);

  React.useEffect(() => {
    if (filesBeforeUpload.length > 0) {
      const currentUploading = filesBeforeUpload.filter(file => file.currentUploading);
      if (currentUploading.length === 0) {
        filesBeforeUpload[0].currentUploading = true;
        setFilesBeforeUpload([...filesBeforeUpload]);
        uploadSingleFile(filesBeforeUpload[0]);
      }
    }
  }, [filesBeforeUpload]);

  const handleClosePleaseWait = () => {
    setOpenPleaseWait(false);
  };

  const uploadSingleFile = async (file: any) => {
    try {
      const result = await uploadFile(mediaDirectory !== null ? mediaDirectory.id : null, file);
      filesBeforeUpload.splice(0, 1);
      setFilesBeforeUpload([...filesBeforeUpload]);
      files.push(result);
      setFiles([...files]);
    } catch (e: any) {
      console.log(e);
    }
  };

  const loadDirectories = async () => {
    const rows: Array<MediaLibraryDirectory> = await getListing();
    setDirectories([...rows]);
    if (slug !== undefined && slug !== null) {
      const found = rows.find(dir => dir.slug === slug);
      if (found !== undefined) {
        setMediaDirectory(found);
      }
    }
  };

  const configureSizes = () => {
    navigate('/media-sizes');
  };

  const showAddDirectory = () => {
    if (canDoActionIfNotUploading()) {
      setShowOpenModal(true);
    }
  };

  const handleShowOpenModalClose = () => {
    setShowOpenModal(false);
  };

  const handleEdit = (e: React.MouseEvent, row: MediaLibraryDirectory, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (canDoActionIfNotUploading()) {
      setRowToEdit(row);
      setShowOpenModal(true);
    }
  };

  const handleDelete = (e: React.MouseEvent, row: MediaLibraryDirectory, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (canDoActionIfNotUploading()) {
      setRowToDelete(row);
      setShowConfirmation(true);
    }
  };

  const handleDeleteFile = (e: React.MouseEvent, row: MediaLibraryFile) => {
    e.preventDefault();
    e.stopPropagation();
    if (canDoActionIfNotUploading()) {
      setFileToDelete(row);
      setShowConfirmationFile(true);
    }
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
    if (canDoActionIfNotUploading()) {
      setFiles([]);
      navigate(`/media-library/${dir.slug}`);
    }
  };

  const openMediaLibraryHome = () => {
    if (canDoActionIfNotUploading()) {
      setFiles([]);
      navigate('/media-library');
    }
  };

  const closeConfirmation = () => {
    setRowToDelete(null);
    setShowConfirmation(false);
  };

  const closeConfirmationFile = () => {
    setFileToDelete(null);
    setShowConfirmationFile(false);
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

  const confirmDeleteFile = async () => {
    if (fileToDelete !== null) {
      try {
        await deleteFile(fileToDelete.id);

        const index = files.findIndex(it => it.id === fileToDelete.id);
        if (index !== -1) {
          files.splice(index, 1);
          setFiles([...files]);
        }
      } catch (e) {
        console.log(e);
      }
      closeConfirmationFile();
    }
  };

  const canDoActionIfNotUploading = () => {
    const result = filesBeforeUpload.length === 0;

    if (!result) {
      setOpenPleaseWait(true);
    }

    return result;
  }

  return (
    <ContainerWithSpace>
      <TopHeaderStyled>
        <PageTitle title={t('Media library') + (mediaDirectory !== null ? (' | ' + mediaDirectory.title) : '')} />
        <ButtonTopStyled variant="contained" color="warning" size={'small'}
                         onClick={configureSizes}>{t('Configure sizes')}</ButtonTopStyled>
      </TopHeaderStyled>
      <BoxContainer>
        <FilesContainerStyled>
          {slug !== undefined && slug !== null ? (
            <FileItemStyled onClick={openMediaLibraryHome} style={{opacity: filesBeforeUpload.length === 0 ? 1 : 0.3}}>
              <AddDirectoryStyled>
                <AddIconStyled className={'fa fa-angle-left'} />
                <AddDirectoryLabelStyled>{t('Back')}</AddDirectoryLabelStyled>
              </AddDirectoryStyled>
            </FileItemStyled>
          ) : (
            <FileItemStyled onClick={showAddDirectory} style={{opacity: filesBeforeUpload.length === 0 ? 1 : 0.3}}>
              <AddDirectoryStyled>
                <AddIconStyled className={'fa fa-plus-circle'} />
                <AddDirectoryLabelStyled>{t('Add directory')}</AddDirectoryLabelStyled>
              </AddDirectoryStyled>
            </FileItemStyled>
          )}
          <FileItemStyled style={{opacity: filesBeforeUpload.length === 0 ? 1 : 0.3}}>
            <FileUploadStyled {...getRootProps({className: 'dropzone'})}>
              <AddIconStyled className={'fa fa-upload'} />
              <input {...getInputProps()} />
              <FileUploadLabelStyled>{t('Drag \'n\' drop some files here, or click here')}</FileUploadLabelStyled>
            </FileUploadStyled>
          </FileItemStyled>
          {slug === undefined || slug === null ? (
            directories.map((dir: MediaLibraryDirectory, index: number) => (
              <FileItemStyled key={`Dir_${dir.slug}`} onClick={() => openDirectory(dir)}
                              style={{opacity: filesBeforeUpload.length === 0 ? 1 : 0.3}}>
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
          {files.map((file: any) => (
            <FileItemStyled key={`file${file.id}`}>
              <EmptyImageStyled />
              <FilePreviewStyled src={file.path} />
              <FileTitleStyled>{file.filename}</FileTitleStyled>
              <EditIconStyled className={'fa fa-edit'}
                              onClick={(e: React.MouseEvent<HTMLElement>) => console.log('edit', e)} />
              <DeleteIconStyled className={'fa fa-trash'}
                                onClick={(e: React.MouseEvent<HTMLElement>) => handleDeleteFile(e, file)} />
            </FileItemStyled>
          ))}
        </FilesContainerStyled>
      </BoxContainer>
      <ModalMediaDirectory showOpenModal={showOpenModal} onClose={handleShowOpenModalClose}
                           inputEditMediaLibraryDirectory={rowToEdit}
                           onModalResult={handleModalResult} />
      <DialogConfirmation showDialog={showConfirmation} title={t('Delete confirmation')} onClose={closeConfirmation}
                          onConfirm={confirmDelete} content={t('This operation cannot be undone.')} />
      <DialogConfirmation showDialog={showConfirmationFile} title={t('Delete confirmation')}
                          onClose={closeConfirmationFile}
                          onConfirm={confirmDeleteFile} content={t('This operation cannot be undone.')} />
      <Snackbar
        open={openPleaseWait}
        autoHideDuration={6000}
        onClose={handleClosePleaseWait}>
        <Alert severity={'warning'}>{t('Please wait...')}</Alert>
      </Snackbar>
    </ContainerWithSpace>
  )
}
