'use client'
import { useEffect, useState } from "react"
import { CreateServerModal } from "../models/create-server-modal"
import { InviteServerModal } from "../models/invite-server-modal"
import { EditServerModal } from "../models/edit-server-modal"
import { ManageMemberModal } from "../models/manage-member-modal"
import { CreateChannelModal } from "../models/create-channel-modal"
export const ModalProvider = ()=>{
    const [isMounted,setIsMounted]=useState(false)
    useEffect(()=>{
        setIsMounted(true)
    },[])

    if(!isMounted)
    {
        return null
    }
    return[
        <>
            <CreateServerModal/>
            <InviteServerModal/>
            <EditServerModal/>
            <ManageMemberModal/>
            <CreateChannelModal/>
        </>
    ]
}