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
  AddIconStyled, EmptyImageStyled,
  FileItemStyled, FilePreviewStyled,
  FilesContainerStyled, FileTitleStyled, FileUploadLabelStyled, FileUploadStyled
} from '../styled/media-library';
import {ButtonTopStyled, TopHeaderStyled} from '../styled/layout-common';

export default function MediaLibrary() {
  const {t} = useTranslation();
  const {layout, setLayout} = useContext(LayoutContext);
  const [filesBeforeUpload, setFilesBeforeUpload] = useState<Array<any>>([]);
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
    onDrop: acceptedFiles => {
      setFilesBeforeUpload(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });

  React.useEffect(() => {
    setLayout((prevLayout: any) => ({
      ...prevLayout,
      ['sideMenu']: 'media-library',
      ['sideMenuContent']: '',
    }));
  }, []);

  const configureSizes = () => {

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
          <FileItemStyled>
            <AddDirectoryStyled>
              <AddIconStyled className={'fa fa-plus-circle'} />
              <AddDirectoryLabelStyled>{t('Add directory')}</AddDirectoryLabelStyled>
            </AddDirectoryStyled>
          </FileItemStyled>
          <FileItemStyled>
            <FileUploadStyled {...getRootProps({className: 'dropzone'})}>
              <input {...getInputProps()} />
              <FileUploadLabelStyled>{t('Drag \'n\' drop some files here, or click here')}</FileUploadLabelStyled>
            </FileUploadStyled>
          </FileItemStyled>
          {filesBeforeUpload.map((file: any) => (
            <FileItemStyled key={file.path}>
              <EmptyImageStyled />
              <FilePreviewStyled src={file.preview} />
              <FileTitleStyled>{file.path}</FileTitleStyled>
            </FileItemStyled>
          ))}
        </FilesContainerStyled>
      </BoxContainer>
    </ContainerWithSpace>
  )
}
