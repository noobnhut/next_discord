import { useEffect, useState } from "react";

type ChatScrollProps={
    chatref:React.RefObject<HTMLDivElement>;
    bottomref:React.RefObject<HTMLDivElement>;
    shouldLoadMore:boolean;
    loadMore:()=>void;
    count:number
}
const UseScroll = ({chatref,bottomref,shouldLoadMore,loadMore,count}:ChatScrollProps) => {
  const [hasInitialized,setHasInitialized]=useState(false) 
  useEffect(()=>{
    const topDiv = chatref?.current;
    const handleScroll = ()=>{
        const scrollTop = topDiv?.scrollTop

        if(scrollTop===0 && shouldLoadMore)
        {
            loadMore()
        }
        topDiv?.addEventListener("scroll",handleScroll)
        return ()=>{
            topDiv?.removeEventListener("scroll",handleScroll)
        }
    }
  },[shouldLoadMore,loadMore,chatref])

  useEffect(()=>{
    const topDiv = chatref?.current;
    const bottomDiv = bottomref?.current;
    const shouldAutoScroll = ()=>{
        if(!hasInitialized && bottomDiv)
        {
            setHasInitialized(true)
            return true
        }
        if(!topDiv)
        {
            return false
        }
        const distanceFormBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight
        return distanceFormBottom <= 100
    }

    if(shouldAutoScroll())
    {
        setTimeout(()=>
        {
            bottomref.current?.scrollIntoView({
                behavior:"smooth"
            })
        },100)
    }
  },[bottomref,chatref,count,hasInitialized])
}
 
export default UseScroll;