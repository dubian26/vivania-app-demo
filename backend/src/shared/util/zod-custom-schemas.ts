import { z } from 'zod'

export const passCheck = () => z.string()
  .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/, {
    message: 'Password debe tener: al menos una minúscula, ' +
      'al menos una mayúscula, al menos un número, ' +
      'al menos un caracter especial @$!%*?& y ' +
      'mínimo 7 caracteres'
  })

export const firstNameCheck = () => z.string()
  .min(2, { message: 'El nombre es demasiado corto.' })
  .max(50, { message: 'El nombre es demasiado largo.' })

export const lastNameCheck = () => z.string()
  .min(2, { message: 'El apellido es demasiado corto.' })
  .max(50, { message: 'El apellido es demasiado largo.' })
