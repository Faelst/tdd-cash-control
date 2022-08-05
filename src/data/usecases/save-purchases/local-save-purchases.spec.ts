import { mockPurchases } from "@/data/tests"
import { CacheStoreSpy } from "@/data/tests/mock-cache"
import { LocalSavePurchases } from "./local-save-purchases"

export type SutTypes = {
  sut: LocalSavePurchases
  cacheStore: CacheStoreSpy
}

export const makeSut = (): SutTypes => {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalSavePurchases(cacheStore)

  return {
      sut,
      cacheStore
  }
}

describe('LocalSavePurchases', () => {
  describe('when create intance', () => {
    it('should not delete cache on sut.init', () => {
      const { cacheStore } = makeSut()
      
      expect(cacheStore.messages).toEqual([])
    })
  })

  describe('when save purchase', () => {
    it('should delete old cache on sut.save', async () => {
      const { cacheStore, sut } = makeSut()
      
      await sut.save(mockPurchases())
      
      expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
      expect(cacheStore.deleteKey).toBe('purchases')
    })

    it('should not insert new cache if delete fails', () => {
      const { cacheStore, sut } = makeSut()
      cacheStore.simulateDeleteError()
      const promise = sut.save(mockPurchases())

      expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete])
      expect(promise).rejects.toThrow()
    })

    it('should insert new cache if delete succeds', async () => {
      const { cacheStore, sut } = makeSut()
      const purchases = mockPurchases()
      await sut.save(purchases)

      expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
      expect(cacheStore.insertKey).toBe('purchases')
      expect(cacheStore.insertValues).toEqual(purchases)
    })

    it('should throw if inset throws ', () => {
      const { cacheStore, sut } = makeSut()
      cacheStore.simulateInsertError()
      const promise = sut.save(mockPurchases())

      expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
      expect(promise).rejects.toThrow()
    })
  })
})
