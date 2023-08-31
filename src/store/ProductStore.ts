import { makeAutoObservable, runInAction } from 'mobx'
import fetchAPI from '../api/fetch'

class ProductStore {
    constructor() {
        makeAutoObservable(this)
    }

    dataProduct = {
        message: {}
    }

    getDataProduct = async () => {
        await fetchAPI('image/paging', '', 'GET', {}).then(value => {
            runInAction(() => {
                console.log("++++++++++++++++++ ", value)
                this.dataProduct = value ?? {}
            })
        })
    }
}

const productStore = new ProductStore()
export default productStore