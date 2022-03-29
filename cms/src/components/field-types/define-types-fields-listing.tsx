import React, {ReactPropTypes, useContext, useState} from 'react';
import PageTitle from '../layout/common/page-title';
import {Button} from '@mui/material';
import BoxContainer from '../layout/common/box-container';
import EmptyState from '../layout/common/empty-state';
import {FieldType} from '../../classes/field-type';
import ActionIcon from '../layout/common/action-icon';
import ModalNewField from '../layout/modal/modal-new-field';
import styled from '@emotion/styled';
import {useTranslation} from 'react-i18next';
import {CollectionType, LayoutContext} from '../../hooks/layout-context';
import DialogConfirmation from '../dialog/dialog-confirmation';
import useCollectionType from '../../hooks/use-collection-type';
import {useNavigate} from 'react-router-dom';
import {ButtonTopStyled, ColumnActionsStyled} from '../../styled/layout-common';

export interface DefineTypesFieldsListingProps {
  inputFields: FieldType[];
  collectionType?: CollectionType | null;
  onFieldsChange: (fields: FieldType[]) => void;
  shouldShowModal?: boolean;
}

interface EditFieldAction {
  field: FieldType;
  index: number;
}

const RowFlexStyled = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CellFlexStyled = styled('div')`
  display: flex;
  align-items: center;
`;

const TextUppercaseStyled = styled('div')`
  text-transform: uppercase;
`;

export default function DefineTypesFieldsListing({
                                                   inputFields,
                                                   collectionType = null,
                                                   onFieldsChange,
                                                   shouldShowModal = false
                                                 }: DefineTypesFieldsListingProps) {
  const {t} = useTranslation();
  const {deleteCollectionType, getCollectionTypes} = useCollectionType();
  const navigate = useNavigate();
  const {layout, setLayout} = useContext(LayoutContext);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [fields, setFields] = useState<Array<FieldType>>([]);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [showDeleteTableConfirmation, setShowDeleteTableConfirmation] = useState<boolean>(false);
  const [fieldToDelete, setFieldToDelete] = useState<FieldType | null>(null);
  const [fieldToEdit, setFieldToEdit] = useState<EditFieldAction | null>(null);

  React.useEffect(() => {
    setFields(inputFields);
  }, [inputFields]);

  React.useEffect(() => {
    if (!showOpenModal && shouldShowModal) {
      handleShowOpenModal();
    }
  }, [shouldShowModal]);

  const handleShowOpenModal = () => {
    setShowOpenModal(true);
  };

  const handleShowOpenModalClose = () => {
    setShowOpenModal(false);
    setFieldToEdit(null);
  };

  const handleFieldConfirm = (data: FieldType) => {
    if (data.id === undefined || data.id === null) {
      setFields((fields: any) => ([...fields, data]));
      onFieldsChange([...fields, data]);
    } else {
      fields[fieldToEdit!.index] = data;
      onFieldsChange([...fields]);
    }
  };

  const closeConfirmation = () => {
    setFieldToDelete(null);
    setShowConfirmation(false);
  };

  const closeConfirmationDeleteTable = () => {
    setShowDeleteTableConfirmation(false);
  }

  const confirmDeleteTable = async () => {
    try {
      await deleteCollectionType(collectionType!.id);
      const rows = await getCollectionTypes() as Array<CollectionType>;
      setLayout((prevLayout: any) => ({
        ...prevLayout,
        ['collectionTypes']: rows
      }));
      navigate('/');
    } catch (e) {
      console.log(e);
    }
    closeConfirmationDeleteTable();
  };

  const handleShowDeleteTableConfirmation = () => {
    setShowDeleteTableConfirmation(true);
  };

  const confirmDelete = () => {
    console.log('field-to-delete', fieldToDelete);
    if (fieldToDelete !== null) {
      const index = fields.findIndex((field: FieldType) => field.id === fieldToDelete.id);
      fields[index].toDelete = true;
      setFields([...fields]);
      onFieldsChange(fields);
      closeConfirmation();
    }
  };

  const handleDeleteField = (field: FieldType, index: number) => {
    if (field.id === undefined || field.id === null) {
      fields.splice(index, 1);
      setFields([...fields]);
      onFieldsChange(fields);
    } else {
      setFieldToDelete(field);
      setShowConfirmation(true);
    }
  };

  const handleUndoDeletion = (index: number) => {
    fields[index].toDelete = false;
    setFields([...fields]);
    onFieldsChange(fields);
  };

  const handleEditField = (field: FieldType, index: number) => {
    setFieldToEdit({field, index});
    handleShowOpenModal();
  };

  const goToEditCollection = () => {
    navigate(`/define-types/edit/${collectionType!.slug}`);
  };

  return (
    <>
      <RowFlexStyled>
        <CellFlexStyled>
          <PageTitle title={`${collectionType !== null ? (collectionType.title + ' | ') : ''}${t('Fields')}`} />
          <Button variant="contained" color="primary" size={'small'}
                  onClick={goToEditCollection}>{t('Edit')}</Button>
        </CellFlexStyled>
        <CellFlexStyled>
          <ButtonTopStyled variant="contained" color="primary" size={'small'}
                  onClick={handleShowOpenModal}>{t('Add field')}</ButtonTopStyled>
          {collectionType !== null && (
            <ButtonTopStyled variant="contained" color="error" size={'small'}
                             onClick={handleShowDeleteTableConfirmation}>{t('Delete')}</ButtonTopStyled>
          )}
        </CellFlexStyled>
      </RowFlexStyled>
      <BoxContainer extraVerticalSpace={true}>
        {fields.length === 0 ? (
          <EmptyState description={'No fields have been added yet.'} buttonLabel={'Add new'}
                      buttonOnClick={handleShowOpenModal} />
        ) : (
          <table>
            <thead>
            <tr>
              <th>{t('Name')}</th>
              <th>{t('Type')}</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            {fields.map((field: FieldType, index: number) => (
              <tr key={`TableField${index}`} className={`${field.toDelete ? 'row-delete' : ''}`}>
                <td>{field.title}</td>
                <td>
                  <TextUppercaseStyled>
                    {field.fieldType}{field.fieldType === 'varchar' ? `(${field.maxLength})` : ''}
                  </TextUppercaseStyled>
                </td>
                <ColumnActionsStyled>
                  {!field.toDelete ? (
                    <>
                      <ActionIcon icon={'fa fa-edit hoverable'} color={'primary'} title={t('Edit')}
                                  onClick={() => handleEditField(field, index)} />
                      <ActionIcon icon={'fa fa-trash-alt hoverable'} color={'error'} title={t('Delete')}
                                  onClick={() => handleDeleteField(field, index)} />
                    </>
                  ) : (
                    <>
                      <ActionIcon icon={'fa fa-history hoverable'} color={'success.main'} title={t('Undo')}
                                  onClick={() => handleUndoDeletion(index)} />
                    </>
                  )}
                </ColumnActionsStyled>
              </tr>
            ))}
            </tbody>
          </table>
        )}
      </BoxContainer>
      <ModalNewField showOpenModal={showOpenModal} onClose={handleShowOpenModalClose}
                     onFieldConfirm={handleFieldConfirm} fields={fields}
                     inputEditField={fieldToEdit !== null ? fieldToEdit.field : null} />
      <DialogConfirmation showDialog={showConfirmation} title={t('Delete confirmation')} onClose={closeConfirmation}
                          onConfirm={confirmDelete} content={t('This operation cannot be undone.')} />
      <DialogConfirmation showDialog={showDeleteTableConfirmation} title={t('Delete confirmation')}
                          onClose={closeConfirmationDeleteTable}
                          onConfirm={confirmDeleteTable}
                          content={`${t('This operation cannot be undone.')} ${t('The table and data will be deleted.')}`}
                          labelConfirm={t('Delete')} />
    </>
  )
}
