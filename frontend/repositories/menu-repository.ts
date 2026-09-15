import { type MenuModel } from "@/models/menu-model"

// Mock data: the menu is not connected to the backend yet.
// Replace this repository with a real implementation when the
// permissions endpoint is available.
const adminMenu: MenuModel[] = [
  {
    id: "dashboard",
    iconName: "LayoutDashboard",
    text: "Dashboard",
    alert: false,
    path: "/dashboard",
  },
  {
    id: "clientes",
    iconName: "Users",
    text: "Clientes",
    alert: false,
    path: "/clientes",
  },
  {
    id: "productos",
    iconName: "Package",
    text: "Productos",
    alert: false,
    path: "/productos",
  },
  {
    id: "pedidos",
    iconName: "ShoppingCart",
    text: "Pedidos",
    alert: true,
    path: "/pedidos",
  },
  {
    id: "reportes",
    iconName: "BarChart3",
    text: "Reportes",
    alert: false,
    path: "/reportes",
  },
  {
    id: "configuracion",
    iconName: "Settings",
    text: "Configuración",
    alert: false,
    path: "/configuracion",
  },
]

const clientMenu: MenuModel[] = [
  {
    id: "dashboard",
    iconName: "LayoutDashboard",
    text: "Inicio",
    alert: false,
    path: "/dashboard",
  },
  {
    id: "catalogo",
    iconName: "Package",
    text: "Catálogo",
    alert: false,
    path: "/catalogo",
  },
  {
    id: "mis-pedidos",
    iconName: "ShoppingCart",
    text: "Mis pedidos",
    alert: false,
    path: "/mis-pedidos",
  },
]

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

export const menuRepository = {
  async listByRole(roleName?: string): Promise<MenuModel[]> {
    await delay(250)
    return roleName === "Cliente" ? clientMenu : adminMenu
  }
}
