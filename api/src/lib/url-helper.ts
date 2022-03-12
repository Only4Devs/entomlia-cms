import slugify from 'slugify';

const prepareUrl = (value: string, lowerCase = true) => {
  return slugify(value, {lower: lowerCase, trim: true, replacement: '-'})
}

export {
  prepareUrl
}
