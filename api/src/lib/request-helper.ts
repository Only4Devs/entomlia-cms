const isNotEmpty = (key: string, data: any) => {
  return data[key] !== undefined && data[key] !== null
}

export {
  isNotEmpty
}
