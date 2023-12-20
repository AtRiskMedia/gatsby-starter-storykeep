import { createAxiosClient } from './createAxiosClient'
import { connect } from '../api/services'
import { useAuthStore } from '../stores/authStore'
import { IAuthStoreLoginResponse } from '../types'

function getCurrentAccessToken() {
  return useAuthStore.getState().accessToken
}

function setRefreshedTokens(response: IAuthStoreLoginResponse) {
  const login = useAuthStore.getState().login
  login(response)
}

function logout() {
  const logout = useAuthStore.getState().logout
  logout()
}

function getAuthData() {
  return {
    secret: process.env.CONCIERGE_SECRET,
  }
}

export const client = createAxiosClient({
  options: {
    baseURL: process.env.CONCIERGE_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': `application/json`,
    },
  },
  getCurrentAccessToken,
  refreshTokenUrl: process.env.CONCIERGE_REFRESH_TOKEN_URL,
  setRefreshedTokens,
  getAuthData,
  logout,
})

export const getTokens = async (fingerprint: string) => {
  try {
    const response = await connect({ fingerprint })
    const accessToken = response?.data?.jwt
    const auth = response?.data?.auth
    return {
      tokens: accessToken,
      auth,
      error: null,
    }
  } catch (error: any) {
    return {
      error: error?.response?.data?.message || error?.message || error,
      tokens: null,
    }
  }
}
