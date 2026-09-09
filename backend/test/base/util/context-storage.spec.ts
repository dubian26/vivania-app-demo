import { PermissionModel } from '@/base/models/permission-model'
import { ContextStorage } from '@/base/util/context-storage'

const permission: PermissionModel = {
  id: 'p1',
  path: '/roles/permisos',
  title: 'Permisos',
  type: 'ACTION',
  icon: null,
  order: 0,
  active: true,
  parentId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('ContextStorage', () => {
  it('con el store iniciado por el middleware, el contexto seteado por el guard después de un await debe ser visible para el handler', async () => {
    const storage = new ContextStorage()

    const guardLike = async () => {
      await new Promise((resolve) => setImmediate(resolve))
      storage.set({ userInfo: undefined, permissions: [permission] })
      return true
    }

    const handlerLike = async () => {
      await guardLike()
      return storage.get()?.permissions
    }

    // El middleware envuelve todo el pipeline en run()
    const result = await storage.run({ userInfo: undefined, permissions: [] }, handlerLike)

    expect(result).toEqual([permission])
  })

  it('sin store previo, set() debe fallar silenciosamente en el pipeline (comportamiento documentado de enterWith)', async () => {
    const storage = new ContextStorage()

    const guardLike = async () => {
      await new Promise((resolve) => setImmediate(resolve))
      storage.set({ userInfo: undefined, permissions: [permission] })
      return true
    }

    await guardLike()

    expect(storage.get()).toBeUndefined()
  })

  it('las mutaciones dentro de run() no deben escapar al contexto exterior', () => {
    const storage = new ContextStorage()

    const handler = () => {
      storage.set({ userInfo: undefined, permissions: [permission] })
      return storage.get()?.permissions
    }

    const result = storage.run({ userInfo: undefined, permissions: [] }, handler)

    expect(result).toEqual([permission])
    expect(storage.get()).toBeUndefined()
  })
})
