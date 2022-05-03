import React, {useContext, useState} from 'react';
import {CollectionType, LayoutContext} from '../../hooks/layout-context';
import ContainerWithSpace from '../../components/layout/container-with-space';
import {useTranslation} from 'react-i18next';
import BoxContainer from '../../components/layout/common/box-container';
import PageTitle from '../../components/layout/common/page-title';
import useCollectionType from '../../hooks/use-collection-type';
import {useNavigate, useParams} from 'react-router-dom';
import ModalCollectionType from '../../components/layout/modal/modal-collection-type';

export default function EditCollectionType() {
  const {t} = useTranslation();
  const {slug} = useParams();
  const {updateCollectionType, getCollectionTypes} = useCollectionType();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [collectionType, setCollectionType] = useState<CollectionType | null>();
  const {layout, setLayout} = useContext(LayoutContext);
  const {getCollectionType} = useCollectionType();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (slug !== undefined && slug !== null) {
      setLoading(true);
      setLayout((prevLayout: any) => ({
        ...prevLayout,
        ['sideMenuCollectionType']: slug,
      }));
      (async () => {
        await loadCollectionWithFields();
      })();
    }
  }, [slug]);

  const loadCollectionWithFields = async () => {
    if (slug !== undefined && slug !== null) {
      try {
        const result = await getCollectionType(slug);
        setCollectionType(result);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
  }

  const onDataSubmit = async (data: any) => {
    try {
      await updateCollectionType(collectionType!!.id, data);
      const rows = await getCollectionTypes() as Array<CollectionType>;
      setLayout((prevLayout: any) => ({
        ...prevLayout,
        ['collectionTypes']: rows
      }));
      navigate(`/define-types/configure/${slug}`);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ContainerWithSpace>
      <PageTitle title={t('Edit type')} />
      <BoxContainer extraVerticalSpace={true}>
        {!loading && collectionType !== null ? (
          <ModalCollectionType onDataSubmit={onDataSubmit} showFields={false} inputEdit={collectionType} />
        ) : <></>}
      </BoxContainer>
    </ContainerWithSpace>
  )
}
