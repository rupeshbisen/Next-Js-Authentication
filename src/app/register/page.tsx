"use client";
import React, { useContext, useEffect, useState } from 'react'
import { registrationFormControls } from '@/utils';
import InputComponent from '@/components/formElements/InputComponent';
import { useRouter } from 'next/navigation';
import { GlobalContext } from '@/context';
import { toast } from 'react-toastify';
import { registerNewUser } from '@/service/register';
import ComponentLevelLoader from '@/components/loader/ComponentLevelLoader';
import Notification from '@/components/Notification';
import registerUserType from '@/types/registerUserType';

const initialFormData: registerUserType = {
    name: "",
    userName: "",
    password: "",
}
export default function Register() {

    const [formData, setFormData] = useState(initialFormData);
    const [isRegistered, setIsRegistered] = useState(false);
    const { loader, setLoader, isAuthUser } = useContext(GlobalContext);


    const router = useRouter()

    function isFormValid() {
        return formData &&
            formData.name &&
            formData.name.trim() !== "" &&
            formData.userName &&
            formData.userName.trim() !== "" &&
            formData.password &&
            formData.password.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/) &&
            formData.password.trim() !== ""
            ? true
            : false;
    }

    async function handleRegisterOnSubmit() {
        setLoader(true);
        const data = await registerNewUser(formData);

        if (data.success) {
            toast.success(data.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
            setIsRegistered(true);
            setLoader(false);
            setFormData(initialFormData);
        } else {
            toast.error(data.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
            setLoader(false);
            setFormData(initialFormData);
        }
    }

    useEffect(() => {
        if (isAuthUser) router.push("/");
    }, [isAuthUser, router]);

    return (
        <div className="bg-white relative">
            <div className="flex flex-col items-center justify-between pt-0 pb-0 px-4 md:px-10 my-8 mr-auto xl:px-5 lg:flex-row">
                <div className="flex flex-col justify-center items-center w-full lg:flex-row">
                    <div className="w-full relative max-w-2xl lg:w-5/12">
                        <div className="flex flex-col items-center justify-start gap-6 p-5 md:p-10 bg-white shadow-2xl rounded-xl relative z-10">
                            <p className="w-full text-4xl text-black font-medium text-center font-serif">
                                {isRegistered
                                    ? "Registration Successfull !"
                                    : "Sign up for an account"}
                            </p>
                            {isRegistered ? (
                                <button
                                    className="inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg md:my-14
                                    text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide"
                                    onClick={() => router.push('/login')}
                                >
                                    Login
                                </button>
                            ) : (
                                <div className="w-full mr-0 mb-0 ml-0 relative space-y-8">
                                    {registrationFormControls.map((controlItem) =>
                                        <div key={controlItem.id}>
                                            <InputComponent
                                                type={controlItem.type}
                                                placeholder={controlItem.placeholder}
                                                label={controlItem.label}
                                                onChange={(event) => {
                                                    setFormData({
                                                        ...formData,
                                                        [controlItem.id]: event.target.value,
                                                    });
                                                }}
                                                value={formData[controlItem.id] as string}
                                            />
                                            {
                                                controlItem.id === 'password' &&
                                                <div className="mt-2 text-sm text-red-500 text-left">Password must be at least 7 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.</div>
                                            }
                                        </div>
                                    )}
                                    <button
                                        className=" disabled:opacity-50 inline-flex w-full items-center rounded justify-center bg-blue-600 px-6 py-4 text-lg 
                                    text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide"
                                        disabled={!isFormValid()}
                                        onClick={handleRegisterOnSubmit}
                                    >
                                        {loader ? (
                                            <ComponentLevelLoader
                                                text={"Registering"}
                                                color={"#ffffff"}
                                                loading={loader}
                                            />
                                        ) : (
                                            "Register"
                                        )}
                                    </button>
                                    <div className="flex flex-col gap-2 ">
                                        <p className='text-gray-800' >Already have an account? <a href="/login" className='text-blue-600'>sign in</a></p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Notification />
        </div>
    )
}