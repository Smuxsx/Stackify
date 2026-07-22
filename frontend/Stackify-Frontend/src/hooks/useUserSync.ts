import { useAuth, useUser} from "@clerk/react"
import {useMutation} from "@tanstack/react-query"
import {use, useEffect} from "react"
import { syncUser } from "../lib/api"

function useUserSync() {
    const { isSignedIn } = useAuth();
    const { user } = useUser()

    const {mutate: syncUserMutation, isIdle, isSuccess} = useMutation({mutationFn: syncUser})

    useEffect(() => {
         const email = user?.primaryEmailAddress?.emailAddress;
        if (isIdle && isSignedIn && user){
            syncUserMutation({
                email,
                name: user.fullName || user.firstName || email,
                imageUrl: user.imageUrl
            })
        }
        
    }, [isSignedIn, user, syncUserMutation, isIdle])

    return { isSynced: isSuccess}
}

export default useUserSync