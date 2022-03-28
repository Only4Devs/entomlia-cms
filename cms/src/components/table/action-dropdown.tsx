import React, {useState} from 'react';
import {Button, Menu, MenuItem} from '@mui/material';
import MenuIcon from '../layout/side-menu/menu-icon';
import MenuItemLabel from '../layout/side-menu/menu-item-label';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import DialogConfirmation from '../dialog/dialog-confirmation';
import useContent from '../../hooks/use-content';

export interface ActionDropdownProps {
  slug: string;
  id: number | string;
  index: number;
  reloadListing: () => void;
}

export default function ActionDropdown({id, slug, index, reloadListing}: ActionDropdownProps) {
  const navigate = useNavigate();
  const {t} = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const {deleteContent} = useContent();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const navigateEdit = () => {
    handleClose();
    navigate(`/listing/${slug}/edit/${id}`);
  };

  const handleDelete = async () => {
    handleClose();
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (id !== null) {
      try {
        await deleteContent(id, slug!!);
        reloadListing();
      } catch (e) {
        console.log(e);
      }
      closeConfirmation();
    }
  };

  const closeConfirmation = () => {
    handleClose();
    setShowConfirmation(false);
  };

  return (
    <>
      <Button
        id={`basic-button-${index}`}
        aria-controls={open ? `basic-menu-${index}` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MenuIcon icon={'fa fa-ellipsis-h'} />
      </Button>
      <Menu
        id={`basic-menu-${index}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': `basic-button-${index}`,
        }}
      >
        <MenuItem onClick={navigateEdit}>
          <MenuIcon icon={'fa fa-edit'} />
          <MenuItemLabel title={t('Edit')} />
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <MenuIcon icon={'fa fa-trash'} />
          <MenuItemLabel title={t('Delete')} />
        </MenuItem>
      </Menu>
      <DialogConfirmation showDialog={showConfirmation} title={t('Delete confirmation')} onClose={closeConfirmation}
                          onConfirm={confirmDelete} content={t('This operation cannot be undone.')} />
    </>
  )
}
