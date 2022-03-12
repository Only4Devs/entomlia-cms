const TOKEN_KEY = 'authToken'

const getHeaderOptions = () => {
  const token: string | null = localStorage.getItem(TOKEN_KEY)

  if (token !== undefined && token !== null) {
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  } else {
    return {}
  }
}

export {
  TOKEN_KEY,
  getHeaderOptions
}
