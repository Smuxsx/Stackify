import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createProduct, deleteProduct, getAllProducts, getMyProducts, getProductsById } from "../lib/api"

export const useProducts = () => {
    const result = useQuery({queryKey: ["products"], queryFn: getAllProducts})
    return result;
};

export const useMyProducts = () => {
    const result = useQuery({queryKey: ["myProducts"], queryFn: getMyProducts})
    return result;
}

export const useCreateProduct = () => {
    const result = useMutation({mutationFn: createProduct})
    return result;
}

export const useProductById = (id:string) => {
    const result = useQuery({queryKey: ["product", id], queryFn: () => getProductsById(id), enabled: Boolean(id)})
    return result;
}

export const useDeleteProduct = (id:string) => {
    const queryClient = useQueryClient()
    const result = useMutation({mutationFn: (id) => deleteProduct(id), onSuccess: () => queryClient.invalidateQueries({queryKey: ["myProducts"]})})
    return result
}