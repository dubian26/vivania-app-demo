"use server"

import { UserInfoModel } from '@/models/user-info-model'
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function getSession() {
  const data: UserInfoModel = {
    "id": "52ea3c28-c805-4835-88ec-083a4ac46086",
    "email": "root@admin.com",
    "firstName": "Root",
    "lastName": "Admin",
    "roleId": "2597f9c2-f1c5-41d8-84fb-a2566e3f3952",
    "roleName": "Administrador"
  }
  return data
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
  redirect("/login")
}
