import { useAuth, useUser} from "@clerk/react"
import {useMutation} from "@tanstack/react-query"
import {use, useEffect} from "react"
import { syncUser } from "../lib/api"

function useUserSync() {
    const { isSignedIn } = useAuth();
    const { user } = useUser()

    const {mutate: syncUserMutation, isIdle, isSuccess} = useMutation({mutationFn: syncUser})

    useEffect(() => {
        if (isIdle && isSignedIn && user){
            syncUserMutation({
                email: user.primaryEmailAddress.emailAddress,
                name: user.fullName || user.firstName,
                imageUrl: user.imageUrl
            })
        }
        
    }, [isSignedIn, user, syncUserMutation, isIdle])

    return { isSynced: isSuccess}
}

export default useUserSync