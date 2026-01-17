// import { describe, test, expect } from '@jest/globals'
import sleep from './delay'
import { LockV2 } from './lock'

describe('LockV2.call', () => {
  test('single operation acquires lock and returns result', async () => {
    const lock = new LockV2()

    const result = await lock.call(async () => {
      await sleep(50)
      return 'ok'
    })

    expect(result).toBe('ok')
  })

  test('concurrent calls: one succeeds, one returns null', async () => {
    const lock = new LockV2()

    const first = lock.call(async () => {
      await sleep(100)
      return 'first'
    })

    const second = sleep(10).then(() =>
      lock.call(async () => 'second')
    )

    const results = await Promise.all([first, second])

    expect(results).toContain('first')
    expect(results).toContain(null)
  })

  test('sequential calls: both succeed', async () => {
    const lock = new LockV2()

    const first = await lock.call(async () => {
      await sleep(50)
      return 'first'
    })

    const second = await lock.call(async () => {
      await sleep(50)
      return 'second'
    })

    expect(first).toBe('first')
    expect(second).toBe('second')
  })
})
