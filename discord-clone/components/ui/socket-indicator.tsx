"use client"
import { useSocket } from "../providers/socket-provider";
import { Badge } from "./badge";
const SocketIndicator = () => {
    const {isConnected}=useSocket()
    if(!isConnected)
    {
        return(
            <Badge variant="outline" className="bg-yellow-600 text-white border-none">
               Ngoại tuyến
            </Badge>
        )
    }
    return (
        <Badge variant="outline" className="bg-green-600 text-white border-none">
          Trực tuyến
        </Badge>
     );
}
 
export default SocketIndicator;