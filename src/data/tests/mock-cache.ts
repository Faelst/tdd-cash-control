import { SavePurchases } from "@/domain/usecases"
import { CacheStore } from "@/data/protocols/cache"

export class CacheStoreSpy implements CacheStore {
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

    simulateDeleteError(): void {
        jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => { throw new Error() })
    }

    simulateInsertError(): void {
        jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => { throw new Error() })
    }
}