import {createContext} from 'react'

export interface UserContextData {
  user: any
  isLoading: any
  setUser: (user: any) => void
  setUserContext: () => void
}

const userContextDefaultValue: UserContextData = {
  setUser: () => null,
  user: null,
  isLoading: true,
  setUserContext: () => null,
}

export const UserContext = createContext<UserContextData>(userContextDefaultValue)
