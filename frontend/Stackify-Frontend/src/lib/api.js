import api from "./axios"

// USERS API
export const syncUser = async (userData) => {
    const { data } = await api.post("/users/sync", userData);
    return data;
}

// PRODUCTS API

export const getAllProducts = async () => {
    const {data} = await api.get("/products");
    return data;
}

export const getProductsById = async (id) => {
    const {data} = await api.get(`/products/${id}`);
    return data;
}

export const getMyProducts = async () => {
    const {data} = await api.get("/products/my");
    return data;
}

export const createProduct = async (productData) => {
    const {data} = await api.post("/products", productData);
    return data;
}

export const updateProduct = async ({id, title, description, imageurl}) => {
    const {data} = await api.put(`/products/${id}`, {
        title,
        description,
        imageurl
    })
    return data
}

export const deleteProduct = async (id) => {
    const {data} = await api.delete(`/products/${id}`);
    return data;
}

//Comments API
export const createComment = async ({productId, content}) => {
    const {data} = await api.post(`/comments/${productId}`, {content});
    return data;
}

export const deleteComment = async (commentId) => {
    const {data} = await api.delete(`/comments/${commentId}`)
    return data;
}