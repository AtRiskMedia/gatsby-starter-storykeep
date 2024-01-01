import { create } from 'zustand'

import { IAuthStoreState, IAuthStoreLoginResponse } from '../types'

export const useAuthStore = create<IAuthStoreState>((set, get) => ({
  accessToken: null,
  validToken: false,
  isLoggedIn: () => !!get().accessToken,
  login: (response: IAuthStoreLoginResponse) => {
    if (response.tokens) {
      set((state) => ({
        ...state,
        accessToken: response.tokens || response.jwt,
        validToken: true,
      }))
    } else {
      set((state) => ({
        ...state,
        accessToken: null,
        validToken: false,
      }))
    }
  },
  logout: () => {
    set((state) => ({
      ...state,
      accessToken: null,
      validToken: false,
    }))
  },
}))
