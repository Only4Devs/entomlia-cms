import React, {useState} from 'react';
import {
  Backdrop,
  Box,
  Button,
  Fade,
  Grid,
  Modal,
  TextField
} from '@mui/material';
import ModalContainer from './modal-container';
import {useTranslation} from 'react-i18next';
import styled from '@emotion/styled';
import InputHolder from '../common/input-holder';
import {useForm} from 'react-hook-form';
import MediaLibraryDirectory from '../../../classes/media-library-directory';

export interface ModalMediaDirectoryProps {
  showOpenModal: boolean;
  inputEditMediaLibraryDirectory?: MediaLibraryDirectory | null;
  onClose: () => void;
  onModalResult: (output: any) => void;
}

const ButtonsContainerStyled = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
`;

export default function ModalMediaDirectory({
                                              showOpenModal = false,
                                              onClose,
                                              onModalResult,
                                              inputEditMediaLibraryDirectory = null,
                                            }: ModalMediaDirectoryProps) {
  const {t} = useTranslation();
  const {reset, setValue, register, control, handleSubmit, getValues, formState: {errors}} = useForm();
  const [, forceUpdate] = React.useState(false);
  const [mediaLibraryDirectory, setMediaLibraryDirectory] = useState<MediaLibraryDirectory | null>(null);

  React.useEffect(() => {
    if (!showOpenModal) {
      reset();
    }
  }, [showOpenModal]);

  const onSubmit = async (data: any) => {
    console.log('errors', errors);
    if (mediaLibraryDirectory !== null) {
      data.id = mediaLibraryDirectory.id;
    }
    onModalResult(data);
  };

  React.useEffect(() => {
    if (inputEditMediaLibraryDirectory !== undefined && inputEditMediaLibraryDirectory !== null) {
      setMediaLibraryDirectory(inputEditMediaLibraryDirectory);
      reset(inputEditMediaLibraryDirectory);
    }
  }, [inputEditMediaLibraryDirectory]);

  return (
    <Modal
      open={showOpenModal}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={showOpenModal}>
        <Box>
          <ModalContainer title={'Configure directory'}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <InputHolder>
                    <TextField
                      {...register('title', {required: true})}
                      onChange={e => setValue('title', e.target.value)}
                      defaultValue={mediaLibraryDirectory?.title || null}
                      variant={'outlined'}
                      type={'text'}
                      className={``}
                      size={'small'}
                      placeholder={t('Enter title')}
                      label={t('Title')}
                      helperText={t(errors.title?.type)}
                      error={errors && errors.title !== undefined}
                    />
                  </InputHolder>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12}>
                  <ButtonsContainerStyled>
                    <Button color="primary" size={'small'}
                            onClick={onClose}>{t('Cancel')}</Button>
                    <Button variant="contained" color="primary" size={'small'} type={'submit'}>{t('Confirm')}</Button>
                  </ButtonsContainerStyled>
                </Grid>
              </Grid>
            </form>
          </ModalContainer>
        </Box>
      </Fade>
    </Modal>
  )
}
