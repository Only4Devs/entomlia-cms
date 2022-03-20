import styled from '@emotion/styled';

const FilesContainerStyled = styled('div')`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: 10px;
`;

const FileItemStyled = styled('div')`
  flex: 0 1 calc(100% / 6 - 2px - 16px);
  margin-bottom: 15px;
  background: #eee;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-right: 8px;
  margin-left: 8px;
`;

const AddDirectoryStyled = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;

  &:hover {
    cursor: pointer;
  }
`;

const AddIconStyled = styled('i')`
  padding-top: 25px;
  font-size: 24px;
  color: #3178bf;
`;

const AddDirectoryLabelStyled = styled('div')`
  color: #3178bf;
  padding-top: 15px;
  padding-bottom: 25px;
`;

const FileUploadStyled = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const FileUploadLabelStyled = styled('div')`
  text-align: center;
  padding: 0 15px;
  line-height: 123%;
`;

export {
  FilesContainerStyled,
  FileItemStyled,
  AddDirectoryStyled,
  AddIconStyled,
  AddDirectoryLabelStyled,
  FileUploadStyled,
  FileUploadLabelStyled,
}
