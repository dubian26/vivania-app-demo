import { createContext, useContext } from "react"

interface AppContextProps {
  showError: (error: unknown) => void
  showMessage: (message: string) => void
}

export const AppContext = createContext<AppContextProps | null>(null)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error("Usar AppContext con AppProvider")
  return context
}
