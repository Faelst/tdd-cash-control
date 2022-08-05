class LocalSavePurchases {
  constructor(private readonly cacheStore: CacheStore) { }

  async save(): Promise<void> {
    this.cacheStore.delete('purchases')
  }

}

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0
  key: string = ""

  delete(key: string): void {
    this.deleteCallsCount++
    this.key = key
  }
}

interface CacheStore {
  delete: (key: string) => void
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
      expect(cacheStore.key).toBe('purchases')
    })
  })
})
