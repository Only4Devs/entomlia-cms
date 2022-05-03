import prisma from '../lib/prisma'
import fs from 'fs'
import {v4} from 'uuid'
import {createThumb} from '../lib/image-helper'
import {config} from '../config/config'
import sharp from 'sharp';

const getListing = async (directoryUrl: string | null = null) => {
  let result = [];

  try {
    let mediaLibraryDirectory = null
    if (directoryUrl !== null) {
      mediaLibraryDirectory = await prisma.mediaLibraryDirectory.findFirst({
        where: {
          slug: directoryUrl
        }
      });
    }
    result = await prisma.mediaLibrary.findMany({
      where: {
        mediaLibraryDirectoryId: mediaLibraryDirectory !== null ? mediaLibraryDirectory.id : null
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        width: true,
        height: true,
        mimetype: true,
        size: true,
        uid: true,
        filename: true,
        mediaLibraryDirectoryId: true,
      },
    }) as any[];
    for (let i = 0; i < result.length; i++) {
      let dirPath = ''
      if (result[i].mediaLibraryDirectoryId !== null) {
        dirPath += `/d${result[i].mediaLibraryDirectoryId}`
      }
      dirPath += `/f${result[i].id}`
      result[i] = {...result[i], path: `${config.host}/public/storage${dirPath}/thumb.jpeg`}
    }
  } catch (e) {
    console.log(e)
  }

  return result
}

const createFile = async (inputData: any) => {
  const file = inputData.file;
  delete inputData.file;
  if (inputData.mediaLibraryDirectoryId !== undefined && inputData.mediaLibraryDirectoryId !== null) {
    inputData.mediaLibraryDirectoryId = parseFloat(inputData.mediaLibraryDirectoryId);
  }
  inputData.filename = file.name
  inputData.mimetype = file.mimetype
  inputData.size = file.size
  inputData.uid = v4()

  return await prisma.mediaLibrary.create({
    data: {
      ...inputData
    }
  })
}

const updateFile = async (mediaLibraryId: number, inputData: any) => {
  delete inputData.id

  return await prisma.mediaLibrary.update({
    where: {
      id: mediaLibraryId
    },
    data: {
      ...inputData
    }
  })
}

const deleteFile = async (id: number) => {
  try {
    await prisma.mediaLibrary.delete({
      where: {
        id
      }
    })
  } catch (e) {
    throw e
  }
}

const ensureDirectoryExists = (path: string) => {
  return new Promise(resolve => {
    fs.access(path, (e) => {
      if (e) {
        fs.mkdir(path, {recursive: true}, (e) => {
          resolve(true)
        })
      } else {
        resolve(true)
      }
    })
  })
}

const updateMediaSize = async (directoryId: number | null, mediaFileId: number, fileName: string) => {
  let dirPath = `${__dirname}/../../public/storage`
  if (directoryId !== null) {
    dirPath += `/d${directoryId}/f${mediaFileId}`
  } else {
    dirPath += `f${mediaFileId}`
  }
  dirPath += `/${fileName}`

  const metadata = await sharp(dirPath).metadata()
  await prisma.mediaLibrary.update({
    where: {
      id: mediaFileId
    },
    data: {
      width: metadata.width,
      height: metadata.height
    }
  })
}

const handleFileUpload = async (file: any, directoryId: number | null, mediaFileId: number) => {
  console.log('handleFileUpload', file, directoryId, mediaFileId)
  let pathFile = ''
  let dirPath = `${__dirname}/../../public/storage`
  if (directoryId !== null) {
    await ensureDirectoryExists(`${__dirname}/../../public/storage/d${directoryId}`)
    pathFile = `${__dirname}/../../public/storage/d${directoryId}/f${mediaFileId}`
    dirPath += `/d${directoryId}/f${mediaFileId}`
    await ensureDirectoryExists(pathFile)
  } else {
    pathFile = `${__dirname}/../../public/storage/f${mediaFileId}`
    dirPath += `f${mediaFileId}`
    await ensureDirectoryExists(pathFile)
  }
  fs.writeFile(`${pathFile}/${file.name}`, file.data, async (e) => {
    console.log('file-creation', e)
    if (e === null) {
      console.log('mimetype', file.mimetype, file.mimetype.indexOf('image') !== -1)
      if (file.mimetype.indexOf('image') !== -1) {
        await updateMediaSize(directoryId, mediaFileId, file.name)
        await createThumb(200, 200, dirPath, file.name)
        return true
      } else {
        return true
      }
    } else {
      return false
    }
  })
}

export {
  getListing,
  createFile,
  updateFile,
  deleteFile,
  handleFileUpload,
}
