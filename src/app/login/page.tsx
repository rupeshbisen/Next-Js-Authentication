"use client";
import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '@/context';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import InputComponent from '@/components/formElements/InputComponent';
import { loginFormControls } from '@/utils';
import loginUserTypes from '@/types/loginUserTypes';
import { login } from '@/service/login';
import Cookies from "js-cookie"
import ComponentLevelLoader from '@/components/loader/ComponentLevelLoader';
import Notification from '@/components/Notification';


const initialFormdata: loginUserTypes = {
    userName: "",
    password: "",
};
export default function Login() {

    const [formData, setFormData] = useState(initialFormdata);
    const {
        isAuthUser,
        setIsAuthUser,
        setUser,
        loader,
        setLoader,
    } = useContext(GlobalContext);

    const router = useRouter();

    const [captcha, setCaptcha] = useState('');
    const [userInput, setUserInput] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        generateCaptcha();
    }, []);

    const generateCaptcha = () => {
        const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let uniqueChar = '';
        for (let i = 0; i < 5; i++) {
            uniqueChar += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        setCaptcha(uniqueChar);
        setUserInput('');
        setMessage('');
    };

    const handleInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        if (captcha === e.target.value) {
            setMessage('Matched');
        } else {
            setMessage('Not Matched');
        }
        setUserInput(e.target.value);
    };

    function isValidForm() {
        return formData &&
            formData.userName &&
            formData.userName.trim() !== "" &&
            formData.password &&
            formData.password.trim() !== ""
            ? true
            : false;
    }

    async function handleLogin() {
        setLoader(true);
        if (captcha === userInput) {

            const res = await login(formData);
            if (res.success) {
                toast.success(res.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                setIsAuthUser(true);
                setUser(res?.data?.user);
                setFormData(initialFormdata);
                Cookies.set("token", res?.data?.token);
                localStorage.setItem("user", JSON.stringify(res?.data?.user));
                setLoader(false);
            } else {
                toast.error(res.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                setIsAuthUser(false);
                setLoader(false);
            }
        }

    }

    useEffect(() => {
        if (isAuthUser) router.push("/");
    }, [isAuthUser, router]);

    return (
        <div className="bg-white relative">
            <div className="flex flex-col items-center justify-between pt-0 pb-0 px-4 md:px-10 my-8 mr-auto xl:px-5 lg:flex-row">
                <div className="flex flex-col justify-center items-center w-full lg:flex-row">
                    <div className="w-full mt-10 mr-0 mb-0 ml-0 relative max-w-2xl lg:mt-0 lg:w-5/12">
                        <div className="flex flex-col items-center justify-start p-5 md:p-10 bg-white shadow-2xl rounded-xl relative z-10">
                            <p className="w-full text-4xl font-medium text-center font-serif">
                                Login
                            </p>
                            <div className="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">
                                {
                                    loginFormControls.map((controlItem) =>

                                        <InputComponent
                                            key={controlItem.id}
                                            type={controlItem.type}
                                            placeholder={controlItem.placeholder}
                                            label={controlItem.label}
                                            value={formData[controlItem.id] as string}
                                            onChange={(event) => {
                                                setFormData({
                                                    ...formData,
                                                    [controlItem.id]: event.target.value,
                                                });
                                            }}
                                        />
                                    )}
                                <div className='flex justify-between gap-3'>
                                    <div className='relative'>
                                        <p className="pt-0 pr-2 pb-0 pl-2 absolute -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 bg-white">
                                            ReCaptcha
                                        </p>
                                        <input
                                            placeholder="Captcha code"
                                            type="text"
                                            id="submit"
                                            value={userInput}
                                            onChange={handleInputChange}
                                            className={`border placeholder-gray-400 text-gray-800 focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mr-0 mt-0 ml-0 text-base block bg-white border-gray-300 rounded-md 
                                                ${message === 'Matched' ? 'border-green-600' : ''} 
                                                ${message === 'Not Matched' ? 'border-red-600' : ''} 
                                                `}
                                        />
                                    </div>
                                    <div className='flex items-center'>
                                        <i className="fa fa-solid fa-arrows-rotate" onClick={generateCaptcha}></i>
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            id="submit"
                                            value={captcha}
                                            readOnly
                                            className="border placeholder-gray-400 text-gray-800 focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mr-0 mt-0 ml-0 text-base block bg-white border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>
                                {message && <p className={`!mt-2 ${message === 'Matched' ? 'text-green-600' : ''} ${message === 'Not Matched' ? 'text-red-600' : ''}  `}>{message}</p>}
                                <button
                                    className="disabled:opacity-50 inline-flex w-full rounded items-center justify-center bg-blue-600 px-6 py-4 text-lg 
                                    text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide"
                                    disabled={!isValidForm()}
                                    onClick={handleLogin}
                                >
                                    {loader ? (
                                        <ComponentLevelLoader
                                            text={"Logging In"}
                                            color={"#ffffff"}
                                            loading={loader}
                                        />
                                    ) : (
                                        "Login"
                                    )}
                                </button>
                                <div className="flex justify-center gap-2 ">
                                    <p className='text-gray-800' ><a href="/forgot-password" className='text-blue-600'>Forgot password?</a></p>
                                </div>
                                <div className="flex flex-col gap-2 ">
                                    <p className='text-gray-800' >New to website? <a href="/register" className='text-blue-600'>Register</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Notification />
        </div>
    )
}
