import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import styled from '@emotion/styled';
import {useTranslation} from 'react-i18next';

export interface DialogConfirmationProps {
  showDialog: boolean;
  title: string;
  content?: string;
  onClose: () => void;
  onConfirm: () => void;
  labelConfirm?: string;
  labelCancel?: string;
}

const ContentStyled = styled('span')`
  display: block;
  max-width: 95vw;
  width: 500px;
`;

const DialogActionsStyled = styled(DialogActions)`
  justify-content: space-between;
`;

export default function DialogConfirmation({
                                             showDialog = false,
                                             title,
                                             content,
                                             labelConfirm,
                                             labelCancel,
                                             onClose,
                                             onConfirm
                                           }: DialogConfirmationProps) {
  const {t} = useTranslation();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (showDialog) {
      setOpen(true);
    }
  }, [showDialog]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleConfirm = () => {
    setOpen(false);
    onConfirm();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <ContentStyled>
              {content}
            </ContentStyled>
          </DialogContentText>
        </DialogContent>
        <DialogActionsStyled>
          <Button onClick={handleClose}>
            {labelCancel ? labelCancel : t('Cancel')}
          </Button>
          <Button onClick={handleConfirm}>
            {labelConfirm ? labelConfirm : t('Confirm')}
          </Button>
        </DialogActionsStyled>
      </Dialog>
    </div>
  )
}
