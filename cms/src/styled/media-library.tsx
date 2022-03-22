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
  position: relative;
  overflow: hidden;
  min-height: 140px;
`;

const FilePreviewStyled = styled('img')`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
`;

const EmptyImageStyled = styled('div')`
  padding: 50% 0;
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
  flex-direction: column;
  height: 100%;

  &:hover {
    cursor: pointer;
  }
`;

const FileUploadLabelStyled = styled('div')`
  text-align: center;
  padding: 15px 15px 0 15px;
  line-height: 123%;
  color: #3178bf;

  &:hover {
    cursor: pointer;
  }
`;

const FileTitleStyled = styled('div')`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  color: #FFF;
  padding: 50px 5px 5px 5px;
  background: rgb(2, 0, 36);
  background: linear-gradient(0deg, rgba(2, 0, 36, 0.8) 0%, rgba(57, 57, 57, 0.8) 35%, rgba(255, 255, 255, 0) 100%);
`;

export {
  FilesContainerStyled,
  FileItemStyled,
  FilePreviewStyled,
  EmptyImageStyled,
  AddDirectoryStyled,
  AddIconStyled,
  AddDirectoryLabelStyled,
  FileUploadStyled,
  FileUploadLabelStyled,
  FileTitleStyled,
}
