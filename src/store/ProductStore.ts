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
    id?: number,
    name?: string,
    displayImageUri?: string,
    downloadImageUri?: string,
    title?: string,
    count?: number,
    productName?: string,
    stock?: number,
    price?: number,
    chart?: number,
}
class ProductStore {
    constructor() {
        makeAutoObservable(this)
    }

    dataProduct: ProductType = {}
    dataProductLocal: ProductContentType[] = []

    getDataProduct = async () => {
        await fetchAPI('images', '', 'GET', {}).then(value => {
            runInAction(() => {
                this.dataProduct = value ?? {}
            })
        })
    }

    saveDataLocal = (data: ProductContentType[]) => {
        runInAction(() => {
            this.dataProductLocal = data
        })
    }

}

const productStore = new ProductStore()
export default productStore