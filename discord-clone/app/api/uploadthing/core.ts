import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
const handleAuth = ()=>{
    const userId = auth()
if(!userId) throw new Error("Chưa đăng nhập")
    return {userId:userId}
}
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  //anh server
  serverImage: f({image:{maxFileSize:"4MB",maxFileCount:1}})
  .middleware(()=>handleAuth())
  .onUploadComplete(()=>{}),

  // file trong tin nhắn
  messageFile: f(["image","pdf"])
  .middleware(()=>handleAuth())
  .onUploadComplete(()=>{})
  
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;