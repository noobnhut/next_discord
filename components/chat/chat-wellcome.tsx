import { Hash } from "lucide-react";

interface ChatWellcomeProps{
    name:string,
    type:"channel"|"conversation"

}
const ChatWellcome = ({name,type}:ChatWellcomeProps) => {
    return ( 
        <div className="space-y-2 px-4 mb-2">
            {type==="channel" && (
                <div className="h-[75px] w-[75px] rounded-full bg-zinc-500
                dark:bg-zinc-700 flex items-center justify-center">
                    <Hash className="h-12 w-12 text-white"/> 
                </div>
            )}
            <p className="text-xl md:text-3xl font-bold">
                {type==="channel"?"Chào mừng đén với kênh ":""}{name} !
            </p>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            {type==="channel"?`Đây là sự khởi đầu của kênh #${name}`:`Đây là sự khởi đầu của cuộc trò chuyện với ${name}`}
            </p>
        </div>
     );
}
 
export default ChatWellcome;