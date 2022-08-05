import { CacheStore } from "@/data/protocols/cache"
import { LocalSavePurchases } from "@/data/usecases"

class CacheStoreSpy implements CacheStore {
  deleteKey: string = ""
  insertKey: string = ""
  deleteCallsCount = 0
  insertCallsCount = 0

  delete(key: string): void {
    this.deleteCallsCount++
    this.deleteKey = key
  }

  insert(key: string): void {
    this.insertCallsCount++
    this.insertKey = key
  }
}

type SutTypes = {
  sut: LocalSavePurchases
  cacheStore: CacheStoreSpy
}

const makeSut = (): SutTypes => {
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
      expect(cacheStore.deleteCallsCount).toBeFalsy()
    })
  })

  describe('when save purchase', () => {
    it('should delete old cache on sut.save', async () => {
      const { cacheStore, sut } = makeSut()
      await sut.save()

      expect(cacheStore.deleteCallsCount).toBe(1)
      expect(cacheStore.deleteKey).toBe('purchases')
    })

    it('should not insert new cache if delete fails', () => {
      const { cacheStore, sut } = makeSut()
      jest.spyOn(cacheStore, 'delete').mockImplementation(() => { throw new Error() })
      const promise = sut.save()
      expect(cacheStore.insertCallsCount).toBe(1)
      expect(promise).rejects.toThrow()
    })

    it('should insert new cache if delete succeds', async () => {
      const { cacheStore, sut } = makeSut()
      await sut.save()
      expect(cacheStore.deleteCallsCount).toBe(1)
      expect(cacheStore.insertCallsCount).toBe(1)
      expect(cacheStore.insertKey).toBe('purchases')
    })
  })
})
