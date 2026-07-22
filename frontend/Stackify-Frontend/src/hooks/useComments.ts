import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment, deleteComment } from "../lib/api";

export const useCreateComment = () => {
    const queryClient = useQueryClient()
    const result = useMutation({
        mutationFn: createComment,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({queryKey: ["product", variables.productId]})
        }
    })
    return result;
}

export const useDeleteComment = (productId:string) => {
    const queryClient = useQueryClient()
    const result = useMutation({
        mutationFn: (commentId: string) => deleteComment(commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["product", productId]})
        }
    })
    return result;
}