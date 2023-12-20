import { create } from 'zustand'

import { IAuthStoreState, IAuthStoreLoginResponse } from '../types'

const authDataSchema = {
  authenticated: false,
  badLogin: false,
}

export const useAuthStore = create<IAuthStoreState>((set, get) => ({
  accessToken: null,
  authData: {
    ...authDataSchema,
  },
  fingerprint: null,
  validToken: false,
  setFingerprint: (fingerprint: string) => {
    set((state) => ({ ...state, fingerprint }))
  },
  updateAuthData: (key: string, value: string) =>
    set((state) => ({
      authData: { ...state.authData, [key]: value },
    })),
  isLoggedIn: () => !!get().accessToken,
  login: (response: IAuthStoreLoginResponse) => {
    if (response.tokens) {
      set((state) => ({
        ...state,
        accessToken: response.tokens || response.jwt,
        validToken: true,
        authData: { ...state.authData, badLogin: false },
      }))
      set((state) => ({
        authData: { ...state.authData, authenticated: response.auth },
      }))
    } else {
      set((authData) => ({
        ...authData,
        badLogin: true,
      }))
    }
  },
  logout: () => {
    set((state) => ({
      ...state,
      accessToken: null,
      authData: { ...authDataSchema },
      validToken: false,
    }))
  },
}))
