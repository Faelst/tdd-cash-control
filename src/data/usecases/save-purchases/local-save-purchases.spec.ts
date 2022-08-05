import { CacheStore } from "@/data/protocols/cache"
import { LocalSavePurchases } from "@/data/usecases"
import { SavePurchases } from "@/domain"

class CacheStoreSpy implements CacheStore {
  deleteKey: string = ""
  insertKey: string = ""
  deleteCallsCount = 0
  insertCallsCount = 0
  insertValues: Array<SavePurchases.params> = []

  delete(key: string): void {
    this.deleteCallsCount++
    this.deleteKey = key
  }

  insert(key: string, value: any): void {
    this.insertCallsCount++
    this.insertKey = key
    this.insertValues = value
  }

  simulateDeleteError (): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => { throw new Error() })
  }

  simulateInsertError (): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => { throw new Error() })
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

const mockPurchases = (): Array<SavePurchases.params> => [{
  id: "1",
  date: new Date(),
  value: 10
},
{
  id: "2",
  date: new Date(),
  value: 20
}]

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
      await sut.save(mockPurchases())
      
      expect(cacheStore.deleteCallsCount).toBe(1)
      expect(cacheStore.deleteKey).toBe('purchases')
    })

    it('should not insert new cache if delete fails', () => {
      const { cacheStore, sut } = makeSut()
      cacheStore.simulateDeleteError()
      const promise = sut.save(mockPurchases())

      expect(cacheStore.insertCallsCount).toBe(0)
      expect(promise).rejects.toThrow()
    })

    it('should insert new cache if delete succeds', async () => {
      const { cacheStore, sut } = makeSut()
      const purchases = mockPurchases()
      await sut.save(purchases)

      expect(cacheStore.deleteCallsCount).toBe(1)
      expect(cacheStore.insertCallsCount).toBe(1)
      expect(cacheStore.insertKey).toBe('purchases')
      expect(cacheStore.insertValues).toEqual(purchases)
    })

    it('should throw if inset throws ', () => {
      const { cacheStore, sut } = makeSut()
      cacheStore.simulateInsertError()
      const promise = sut.save(mockPurchases())
      expect(promise).rejects.toThrow()
    })
  })
})
