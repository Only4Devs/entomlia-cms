import React, {useState} from 'react';
import {
  Backdrop,
  Box,
  Button,
  Fade,
  FormControl,
  Grid, InputLabel, MenuItem,
  Modal, Select,
  TextField
} from '@mui/material';
import ModalContainer from './modal-container';
import {useTranslation} from 'react-i18next';
import styled from '@emotion/styled';
import InputHolder from '../common/input-holder';
import {useForm} from 'react-hook-form';
import MediaSize from '../../../classes/media-size';

export interface ModalNewFieldProps {
  showOpenModal: boolean;
  onClose: (output: any) => void;
}

const ButtonsContainerStyled = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
`;

export default function ModalMediaSize({
                                         showOpenModal = false,
                                         onClose
                                       }: ModalNewFieldProps) {
  const {t} = useTranslation();
  const {reset, setValue, register, control, handleSubmit, getValues, formState: {errors}} = useForm();
  const [, forceUpdate] = React.useState(false);
  const [mediaSize, setMediaSize] = useState<MediaSize | null>(null);

  React.useEffect(() => {
    if (!showOpenModal) {
      reset();
    }
  }, [showOpenModal]);

  const onSubmit = async (data: any) => {
    console.log('data', data);
    console.log('errors', errors);
    if (data.width !== undefined && data.width !== null) {
      data.width = parseFloat(data.width);
    } else {
      data.width = null;
    }
    if (data.height !== undefined && data.height !== null) {
      data.height = parseFloat(data.height);
    } else {
      data.height = null;
    }
    onClose(data);
  };

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
          <ModalContainer title={'Configure size'}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <InputHolder>
                    <TextField
                      {...register('title', {required: true})}
                      onChange={e => setValue('title', e.target.value)}
                      defaultValue={mediaSize?.title || null}
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
                  <FormControl fullWidth error={errors && errors.mode !== undefined}>
                    <InputLabel id="input-mode-value-label">{t('Resize mode')}</InputLabel>
                    <Select
                      {...register('mode')}
                      defaultValue={mediaSize?.mode || 'resize'}
                      labelId="input-mode-value-label"
                      id="input-mode-value"
                      label={t('Resize mode')}
                      onChange={e => {
                        setValue('mode', e.target.value);
                        forceUpdate(n => !n);
                      }}
                    >
                      <MenuItem value={'resize'}>{t('Resize')}</MenuItem>
                      <MenuItem value={'crop'}>{t('Crop')}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <InputHolder>
                    <TextField
                      {...register('width')}
                      onChange={e => setValue('width', e.target.value)}
                      defaultValue={mediaSize?.width || null}
                      variant={'outlined'}
                      type={'text'}
                      className={``}
                      size={'small'}
                      placeholder={t('Enter width')}
                      label={t('Width')}
                      helperText={t(errors.width?.type)}
                      error={errors && errors.width !== undefined}
                    />
                  </InputHolder>
                  <InputHolder>
                    <TextField
                      {...register('height')}
                      onChange={e => setValue('height', e.target.value)}
                      defaultValue={mediaSize?.height || null}
                      variant={'outlined'}
                      type={'text'}
                      className={``}
                      size={'small'}
                      placeholder={t('Enter height')}
                      label={t('Height')}
                      helperText={t(errors.height?.type)}
                      error={errors && errors.height !== undefined}
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
