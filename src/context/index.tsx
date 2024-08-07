/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { FC, createContext, useState, Dispatch, SetStateAction, useEffect } from 'react';
import Cookies from 'js-cookie';
import registerUserType from '@/types/registerUserType';


interface GlobalContextProps {
    loader: boolean;
    setLoader: Dispatch<SetStateAction<boolean>>;
    isAuthUser: boolean;
    setIsAuthUser: Dispatch<SetStateAction<boolean>>;
    user: registerUserType | null;
    setUser: Dispatch<SetStateAction<registerUserType | null>>;

}

export const GlobalContext = createContext<GlobalContextProps>({} as GlobalContextProps);

interface GlobalStateProps {
    children: React.ReactNode;
}

const GlobalState: FC<GlobalStateProps> = ({ children }) => {
    const [loader, setLoader] = useState<boolean>(false);
    const [isAuthUser, setIsAuthUser] = useState<boolean>(false);
    const [user, setUser] = useState<registerUserType | null>(null);

    useEffect(() => {
        if (Cookies.get('token') !== undefined) {
            setIsAuthUser(true);
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            setUser(userData);
        } else {
            setIsAuthUser(false);
            setUser({} as registerUserType); //unauthenticated user
        }
    }, [Cookies]);

    return (
        <GlobalContext.Provider
            value={{
                loader,
                setLoader,
                isAuthUser,
                setIsAuthUser,
                user,
                setUser,
            }}>
            {children}
        </GlobalContext.Provider>
    );
}

export default GlobalState;
