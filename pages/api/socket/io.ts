import {Server as NestServer} from "http"
import {Server as ServerIo} from "socket.io"
import { NextApiRequest } from "next";
import {NextApiResponseServerIo} from "@/type";

export const config = {
    api:{
        bodyPaser:false
    }
}

const ioHandle = (req:NextApiRequest,res:NextApiResponseServerIo) =>{
    if(!res.socket.server.io){
        const path="/api/socket/io"
        const httpServer:NestServer = res.socket.server as any
        const io = new ServerIo(httpServer,
            {
                path:path,
                addTrailingSlash:false
            }
        )
        res.socket.server.io = io
       
    }
    res.end()
}
export default ioHandle