import React, {useContext, useState} from 'react';
import PageTitle from '../../components/layout/common/page-title';
import {Button, Table} from '@mui/material';
import BoxContainer from '../../components/layout/common/box-container';
import ContainerWithSpace from '../../components/layout/container-with-space';
import {useTranslation} from 'react-i18next';
import {useNavigate, useParams} from 'react-router-dom';
import styled from '@emotion/styled';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import useCollectionType from '../../hooks/use-collection-type';
import useFormConfiguration, {FormConfiguration} from '../../hooks/use-form-configuration';
import {FieldType} from '../../classes/field-type';
import TableLoader from '../../components/layout/table-loader';
import {LayoutContext} from '../../hooks/layout-context';

type Params = {
  slug: string;
};

const TopHeaderStyled = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ButtonTopStyled = styled(Button)`
  margin-left: 15px;
`;

const reorder = (list: Array<any>, startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (source: any, destination: any, droppableSource: any, droppableDestination: any) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  // @ts-ignore
  result[droppableSource.droppableId] = sourceClone;
  // @ts-ignore
  result[droppableDestination.droppableId] = destClone;

  return result;
};
const grid = 8;

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  maxWidth: isDragging ? '50%' : '100%',
  background: isDragging ? "#ccc" : "#e7e7e7",
  ...draggableStyle
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "#eee" : "#fff",
  padding: grid,
  width: 250
});

export default function ConfigureForm() {
  const {t} = useTranslation();
  const {slug} = useParams<Params>();
  const navigate = useNavigate();
  const {layout, setLayout} = useContext(LayoutContext);
  const {getCollectionType} = useCollectionType();
  const {getFormConfiguration, updateFormConfiguration} = useFormConfiguration();
  const [state, setState] = useState<Array<Array<any>>>([]);
  const [formConfiguration, setFormConfiguration] = useState<FormConfiguration | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      setLayout({
        ...layout,
        sideMenu: 'listing',
        sideMenuContent: slug!!
      });
      const result = await getCollectionType(slug!!);
      const formConfiguration = await getFormConfiguration(slug!!);
      setFormConfiguration(formConfiguration);
      console.log('formConfiguration', formConfiguration);
      if (result !== undefined && result !== null) {
        if (formConfiguration !== undefined && formConfiguration !== null) {
          if (formConfiguration.content !== undefined && formConfiguration.content !== null) {
            const loadedState: Array<Array<any>> = [];
            for (let container of formConfiguration.content) {
              const rows: Array<any> = [];
              for (let item of container) {
                const found = result.fields.find((it: FieldType) => it.slug === item.slug);
                if (found !== undefined && found !== null) {
                  rows.push(found);
                }
              }
              loadedState.push(rows);
            }
            setState(loadedState);
            setLoading(false);
          } else {
            setState([[], [], [], result.fields])
            setLoading(false);
          }
        }
      }
    })();
  }, []);

  function onDragEnd(result: any) {
    const {source, destination} = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      // @ts-ignore
      newState[sInd] = result[sInd];
      // @ts-ignore
      newState[dInd] = result[dInd];

      setState(newState);
    }
  }

  const navigateToListing = () => {
    navigate(`/listing/${slug}`);
  }

  const saveFormConfiguration = async () => {
    console.log('saveFormConfiguration', state);
    const result = [];
    let position = 0;
    for (let container of state) {
      const fields = [];
      for (let item of container) {
        fields.push({
          position,
          slug: item.slug
        });
        position++;
      }
      result.push(fields);
    }
    console.log('res-fields', result);

    if (formConfiguration !== undefined && formConfiguration !== null) {
      try {
        await updateFormConfiguration(formConfiguration.id!!, result);
      } catch (e) {
        console.log(e);
      }
    }
  }

  return (
    <ContainerWithSpace>
      <TopHeaderStyled>
        <PageTitle title={`${t('Configure')}: ${slug}`} />
        <div>
          <ButtonTopStyled variant="contained" color="inherit" size={'small'}
                           onClick={navigateToListing}>{t('Back')}</ButtonTopStyled>
          <ButtonTopStyled variant="contained" color="primary" size={'small'}
                           onClick={saveFormConfiguration}>{t('Save')}</ButtonTopStyled>
        </div>
      </TopHeaderStyled>
      <BoxContainer>
        {!loading && (
          <div style={{display: "flex"}} className={'holder-drag-and-drop'}>
            <DragDropContext onDragEnd={onDragEnd}>
              {state.map((el, ind) => (
                <Droppable key={ind} droppableId={`${ind}`}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                      {...provided.droppableProps}
                    >
                      {el.map((item, index) => (
                        <Draggable
                          key={item.slug}
                          draggableId={item.slug}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-around"
                                }}
                              >
                                <div>{item.slug}</div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </DragDropContext>
          </div>
        )}
        {loading && <TableLoader />}
      </BoxContainer>
    </ContainerWithSpace>
  );
}
