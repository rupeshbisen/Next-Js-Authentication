"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import HomeImage from "@/../public/home.jpg"
import Success from "@/../public/success.gif"
import { useContext } from "react";
import { GlobalContext } from "@/context";


export default function Home() {
  const { isAuthUser } = useContext(GlobalContext);
  const router = useRouter();

  return (
    <div>
      <div className='max-w-screen-xl mx-auto px-4 flex justify-center'>
        {
          isAuthUser ?
            <Image src={Success} alt="Success"/>
            :
            <Image src={HomeImage} alt="HomeImage" onClick={() => router.push('./login')} />
        }
      </div>
    </div>
  );
}