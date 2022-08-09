import { mockPurchases } from "@/data/tests"
import { CacheStoreSpy } from "@/data/tests/mock-cache"
import { LocalSavePurchases } from "./local-save-purchases"

export type SutTypes = {
  sut: LocalSavePurchases
  cacheStore: CacheStoreSpy
}

export const makeSut = (timestamp = new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalSavePurchases(cacheStore, timestamp)

  return {
      sut,
      cacheStore
  }
}

describe('LocalSavePurchases', () => {
  describe('when create intance', () => {
    it('should not delete cache on sut.init', () => {
      const { cacheStore } = makeSut()
      
      expect(cacheStore.actions).toEqual([])
    })
  })

  describe('when save purchase', () => {
       
    it('should not insert new cache if delete fails', async () => {
      const { cacheStore, sut } = makeSut()
      cacheStore.simulateDeleteError()
      const promise = sut.save(mockPurchases())

      expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.delete])
      await expect(promise).rejects.toThrow()
    })

    it('should insert new cache if delete succeds', async () => {
      const timestamp = new Date()
      const { cacheStore, sut } = makeSut(timestamp)
      const purchases = mockPurchases()
      const promise = sut.save(purchases)
      
      expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.delete, CacheStoreSpy.Action.insert])
      expect(cacheStore.insertKey).toBe('purchases')
      expect(cacheStore.deleteKey).toBe('purchases')
      expect(cacheStore.insertValues).toEqual({
        timestamp,
        value: purchases
      })

      await expect(promise).resolves.toBeFalsy()
    })

    it('should throw if inset throws', async () => {
      const { cacheStore, sut } = makeSut()
      cacheStore.simulateInsertError()
      const promise = sut.save(mockPurchases())

      expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.delete, CacheStoreSpy.Action.insert])
      await expect(promise).rejects.toThrow()
    })
  })
})
