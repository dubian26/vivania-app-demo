import { Command } from '@/base/mediator'
import { LoggingBehavior } from '@/shared/util/logging-behavior'
import { Logger } from '@nestjs/common'

class TestCommand extends Command<string> { }

describe('LoggingBehavior', () => {
  it('delega en next() y devuelve el resultado sin alterarlo', async () => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => { })
    const behavior = new LoggingBehavior()

    await expect(
      behavior.handle(new TestCommand(), () => Promise.resolve('ok')),
    ).resolves.toBe('ok')
  })

  it('relanza el error del handler después de registrarlo', async () => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => { })
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => { })
    const behavior = new LoggingBehavior()
    const error = new Error('boom')

    await expect(
      behavior.handle(new TestCommand(), () => Promise.reject(error)),
    ).rejects.toBe(error)
  })
})
