'use client'

import { X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadting";
interface FileUploadProps{
    onChange:(url?:string)=>void;
    value:string;
    endpoint:"messageFile"|"serverImage"
}

export const FileUpload = ({onChange,value,endpoint}:FileUploadProps)=>{
    const fileType = value?.split(".").pop();
    if(value && fileType !=="pdf")
    {
        return(
            <div className="relative h-20 w-20">
                <Image
                fill
                src={value}
                alt=""
                className="rounded-full"
                sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                />
                
                <button
                onClick={()=>onChange("")}
                    type="button"
                    className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                >
                    <X className="h-4 w-4"/>
                </button>
            </div>
        )
    }
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res)=>{
                onChange(res?.[0].url);
            }}
            onUploadError={(error:Error)=>{
                console.log(error)
            }}
            
        />
    )
}