/**
 * Vitest setup file.
 * Provides a clean localStorage mock for every test.
 * jsdom includes a real localStorage implementation, but we
 * reset it before each test to keep tests isolated.
 */
import { beforeEach } from 'vitest'

beforeEach(() => {
  localStorage.clear()
})
