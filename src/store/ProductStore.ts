import { makeAutoObservable, runInAction } from 'mobx'
import fetchAPI from '../api/fetch'

export type ProductType = {
    status?: number,
    message?: ProductMessageType
}
export type ProductMessageType = {
    content: ProductContentType[]
}
export type ProductContentType = {
    id: number,
    name: string,
    displayImageUri: string,
    downloadImageUri: string,
    title: string,
    count: number,
}
class ProductStore {
    constructor() {
        makeAutoObservable(this)
    }

    dataProduct: ProductType = {}

    getDataProduct = async () => {
        await fetchAPI('image/paging', '', 'GET', {}).then(value => {
            runInAction(() => {
                this.dataProduct = value ?? {}
            })
        })
    }

}

const productStore = new ProductStore()
export default productStore