'use client'
import React, { useContext, } from 'react'
import { GlobalContext } from '@/context'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'


export default function Navbar() {
    const {
        user,
        setUser,
        isAuthUser,
        setIsAuthUser,
    } = useContext(GlobalContext);

    const router = useRouter();

    const handelLogout = () => {
        setIsAuthUser(false);
        setUser(null);
        Cookies.remove("token");
        localStorage.clear();
        router.push("/");
    }
    return (
        <>
            <nav className='bg-gray-950 text-white fixed w-full z-20 top-0 left-0'>
                <div className='max-w-screen-xl flex items-center justify-between mx-auto p-4 '>
                    <div onClick={() => router.push('/')} className='flex items-center cursor-pointer'>
                        <span className='text-xl md:text-3xl mx-1 md:mx-5'>🏠</span>
                    </div>
                    <div className='flex order-2 gap-2'>
                        {
                            isAuthUser ?
                                <button onClick={handelLogout} className='mx-1 md:mx-3'>
                                    <i className="fa-solid fa-arrow-right-from-bracket text-xl md:text-2xl"></i>
                                    <p className='hidden md:block'>Log out</p>
                                </button>
                                :
                                <button onClick={() => router.push("/login")} className='mx-1 md:mx-3'>
                                    <i className="fa-solid fa-arrow-right-to-bracket text-xl md:text-2xl"></i>
                                    <p className='hidden md:block'>Login</p>
                                </button>
                        }
                    </div>
                </div>
            </nav>
        </>
    )
}
