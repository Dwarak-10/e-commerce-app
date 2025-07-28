
import axios from "axios"

export const api = axios.create({
    baseURL: "http://localhost:4000",
})

export const createProduct = async (product) => {
    const {data} = await api.post("/products",product)
    return data
}