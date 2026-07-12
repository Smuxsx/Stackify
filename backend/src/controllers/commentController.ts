import type { Request, Response } from "express"
import * as queries from "../db/queries.ts"
import { getAuth } from "@clerk/express"
import { comments } from "../db/schema.ts"

type commentsParams = {
    id: string;
    productId: string;
    commentId: string;
}

// Create a comment
export const createComment = async (req:Request<commentsParams>, res:Response) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({error: "Unathorized"})
        
        const { content } = req.body;

        if (!content) { 
            res.status(400).json({error: "Content of the comment required"});
            return;
        }

        const { productId } = req.params;
        const product = await queries.getProductById(productId);
        if (!product) return res.status(404).json({error: "Product not found"});
        
        const comment = await queries.createComment({
            content,
            productId,
            userId
        });

        res.status(201).json(comment)
    } catch (error) {
        console.error("Error creating comment", error)
        res.status(500).json({error: "Error creating comment"})
    }
}

// Delete a comment
export const deleteComment = async (req:Request<commentsParams>, res:Response) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({error: "Unathorized"})
            
        const { commentId } = req.params;
        if(!commentId) return res.status(404).json({error: "Comment not found"})

        const comment = await queries.getCommentById(commentId);
        if (!comment) return res.status(404).json({error:"Comment not found"})
        //  Check if comment belongs to customer
        if (comment.userId !== userId) {
            return res.status(401).json({error: "You can only delete your own comment"})
        }

        await queries.deleteComment(commentId)
        res.status(201).json({message: "Comment deleted successfully"})
    } catch (error) {
        console.error("Error deleting comment", error)
        res.status(500).json({error: "Error deleting comment"})
    }
}