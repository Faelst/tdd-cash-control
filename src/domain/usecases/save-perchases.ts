export namespace SavePurchases {
    export type params = {
        id: string
        date: Date
        value: number
    }

    export type result = void
}

export interface SavePurchases {
    save: (purchases: Array<SavePurchases.params>) => Promise<SavePurchases.result>
}
