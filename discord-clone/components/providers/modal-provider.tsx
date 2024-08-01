'use client'
import { useEffect, useState } from "react"
import { CreateServerModal } from "@/components/models/create-server-modal"
import { InviteServerModal } from "@/components/models/invite-server-modal"
import { EditServerModal } from "@/components/models/edit-server-modal"
import { ManageMemberModal } from "@/components/models/manage-member-modal"
import { CreateChannelModal } from "@/components/models/create-channel-modal"
import { LeaveServerModal } from "@/components/models/leave-server-modal"
import { DeleteServerModal } from "../models/delete-server-modal"
import { DeleteChannelModal } from "../models/delete-channel-modal"
import { EditChannelModal } from "../models/edit-channel-modal"
import { MessageFileModal } from "../models/message-file"

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)
    
    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (
        <>
            <CreateServerModal />
            <InviteServerModal />
            <EditServerModal />
            <ManageMemberModal />
            <CreateChannelModal />
            <LeaveServerModal />
            <DeleteServerModal />
            <DeleteChannelModal/>
            <EditChannelModal/>
            <MessageFileModal/>
        </>
    )
}
