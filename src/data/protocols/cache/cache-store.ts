export interface CacheStore {
    insert: (key: string) => void
    delete: (key: string) => void
}