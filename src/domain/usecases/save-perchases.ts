namespace SavePurchases {
    export type params = {
        id: string
        date: string
        value: string 
    }

    export type result = void
}

export interface SavePurchases {
    save: (purchases: Array<SavePurchases.params>) => Promise<SavePurchases.result>
}
