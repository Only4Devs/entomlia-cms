import sharp from 'sharp'

const createThumb = async (width: number = 150, height: number = 150, location: string, fileName: string) => {
  await sharp(`${location}/${fileName}`)
    .resize({width, height, fit: 'cover'})
    .jpeg({quality: 80})
    .toFile(`${location}/thumb.jpeg`)
    .then((data: any) => {
      console.log('sharp-thumb', data)
      return true
    })
    .catch((err: any) => {
      console.log('sharp-thumb-err', err)
      return false
    })
}

export {
  createThumb
}
