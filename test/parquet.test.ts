import { isParquetFile } from '../src/files/parquet'
import { describe, it, expect } from 'vitest'

describe('isParquetFile', () => {
  it('returns true for files starting with PAR1', async () => {
    const file = new File(['PAR1abcd'], 'test.parquet')
    expect(await isParquetFile(file)).toBe(true)
  })

  it('returns false for non-parquet files', async () => {
    const file = new File(['NOTPAR'], 'test.txt')
    expect(await isParquetFile(file)).toBe(false)
  })
})
