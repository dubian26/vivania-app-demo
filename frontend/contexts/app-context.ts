import { type UserInfoModel } from "@/models/user-info-model"
import { createContext, useContext } from "react"

interface AppContextProps {
  userSession: UserInfoModel | null
  login: (userInfo: UserInfoModel) => void
  logout: () => void
  showError: (error: unknown) => void
  showMessage: (message: string) => void
}

export const AppContext = createContext<AppContextProps | null>(null)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider")
  }
  return context
}
