"use client";
import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '@/context';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ComponentLevelLoader from '@/components/loader/ComponentLevelLoader';
import Notification from '@/components/Notification';
import { sendOTPRequest, setPassword } from '@/service/forgot-password';
import forgetPasswordTypes from '@/types/forgetPasswordTypes';


const initialFormdata: forgetPasswordTypes = {
    userName: "",
    password: "",
    confirmPassword: "",
    otp: 0,
};
export default function ForgotPassword() {

    const [formData, setFormData] = useState(initialFormdata);
    const [otpsend, setOtpsend] = useState(false);
    const [visibleNewPassword, setVisibleNewPassword] = useState<boolean>(false);
    const [visibleConfirmPassword, setVisibleConfirmPassword] = useState<boolean>(false);
    const [otpLoader, setOtpLoader] = useState(false)

    const { isAuthUser, loader, setLoader, } = useContext(GlobalContext);

    const router = useRouter();

    function isValidForm() {
        return formData &&
            formData.userName &&
            formData.userName.trim() !== "" &&
            formData.password &&
            formData.password.trim() !== "" &&
            formData.password.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/) &&
            formData.confirmPassword &&
            formData.confirmPassword.trim() !== "" &&
            formData.confirmPassword.trim() === formData.password.trim() &&
            formData.otp &&
            formData.otp !== 0
            ? true
            : false;
    }

    async function sendOTP() {
        setOtpLoader(true);

        const res = await sendOTPRequest({ userName: formData.userName });
        if (res.success) {
            toast.success(res.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
            setOtpsend(true);
            setOtpLoader(false);
        } else {
            toast.error(res.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
            setOtpLoader(false);
        }
    }

    async function handelPassword() {
        setLoader(true);
        const passwordData = {
            userName: formData.userName,
            password: formData.password,
            otp: formData.otp
        }
        const res = await setPassword(passwordData);
        if (res.success) {
            toast.success(res.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
            setFormData(initialFormdata)
            setLoader(false);
        } else {
            toast.error(res.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
            setFormData(initialFormdata)
            setLoader(false);
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
                                Forgot Password
                            </p>
                            {!otpsend && <div className="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">
                                <div className='relative'>
                                    <p className="pt-0 pr-2 pb-0 pl-2 absolute -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 bg-white">
                                        UserName
                                    </p>
                                    <input
                                        placeholder="email@example.com"
                                        type="text"
                                        id="userName"
                                        value={formData.userName}
                                        onChange={(event) => {
                                            setFormData({
                                                ...formData,
                                                userName: event.target.value,
                                            });
                                        }}
                                        className={`border placeholder-gray-400 text-gray-800 focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mr-0 mt-0 ml-0 text-base block bg-white border-gray-300 rounded-md`}
                                    />
                                </div>
                                <button
                                    className="disabled:opacity-50 inline-flex w-full rounded items-center justify-center bg-blue-600 px-6 py-4 text-lg 
                                    text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide"
                                    disabled={!formData.userName}
                                    onClick={sendOTP}
                                >
                                    {otpLoader ? (
                                        <ComponentLevelLoader
                                            text={"OTP Sending"}
                                            color={"#ffffff"}
                                            loading={otpLoader}
                                        />
                                    ) : (
                                        "Send OTP"
                                    )}
                                </button>
                            </div>}
                            {
                                otpsend && <div className="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">
                                    <div className='relative'>
                                        <p className="pt-0 pr-2 pb-0 pl-2 absolute -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 bg-white">
                                            New Password
                                        </p>
                                        <input
                                            placeholder="Enter New Password"
                                            type={visibleNewPassword ? "text" : "password"}
                                            id="password"
                                            value={formData.password}
                                            onChange={(event) => {
                                                setFormData({
                                                    ...formData,
                                                    password: event.target.value,
                                                });
                                            }}
                                            className={`border placeholder-gray-400 text-gray-800 focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mr-0 mt-0 ml-0 text-base block bg-white border-gray-300 rounded-md`}
                                        />
                                        <span onClick={() => setVisibleNewPassword(!visibleNewPassword)} className="absolute right-2 top-4 ps-3 font-medium text-gray-600 bg-white" >
                                            {visibleNewPassword ?
                                                <i className="fa-solid fa-eye"></i>
                                                :
                                                <i className="fa-solid fa-eye-slash"></i>
                                            }
                                        </span>
                                    </div>
                                    <div className='relative'>
                                        <p className="pt-0 pr-2 pb-0 pl-2 absolute -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 bg-white">
                                            Confirm password
                                        </p>
                                        <input
                                            placeholder="Enter confirm password"
                                            type={visibleConfirmPassword ? "text" : "password"}
                                            id="confirm-password"
                                            value={formData.confirmPassword}
                                            onChange={(event) => {
                                                setFormData({
                                                    ...formData,
                                                    confirmPassword: event.target.value,
                                                });
                                            }}
                                            className={`border placeholder-gray-400 text-gray-800 focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mr-0 mt-0 ml-0 text-base block bg-white border-gray-300 rounded-md`}
                                        />
                                        <span onClick={() => setVisibleConfirmPassword(!visibleConfirmPassword)} className="absolute right-2 top-4 ps-3 font-medium text-gray-600 bg-white" >
                                            {visibleConfirmPassword ?
                                                <i className="fa-solid fa-eye"></i>
                                                :
                                                <i className="fa-solid fa-eye-slash"></i>
                                            }
                                        </span>
                                    </div>
                                    <div className='relative'>
                                        <p className="pt-0 pr-2 pb-0 pl-2 absolute -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 bg-white">
                                            OTP
                                        </p>
                                        <input
                                            placeholder="Enter OTP"
                                            type="text"
                                            id="OTP"
                                            value={Number(formData.otp)}
                                            onChange={(event) => {
                                                setFormData({
                                                    ...formData,
                                                    otp: Number(event.target.value),
                                                });
                                            }}
                                            className={`border placeholder-gray-400 text-gray-800 focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mr-0 mt-0 ml-0 text-base block bg-white border-gray-300 rounded-md`}
                                        />
                                    </div>
                                    <button
                                        className="disabled:opacity-50 inline-flex w-full rounded items-center justify-center bg-blue-600 px-6 py-4 text-lg 
                                    text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide"
                                        disabled={!formData.userName}
                                        onClick={sendOTP}
                                    >
                                        {otpLoader ? (
                                            <ComponentLevelLoader
                                                text={"Re Sending OTP"}
                                                color={"#ffffff"}
                                                loading={otpLoader}
                                            />
                                        ) : (
                                            "Re send OTP"
                                        )}
                                    </button>
                                    <button
                                        className="disabled:opacity-50 inline-flex w-full rounded items-center justify-center bg-blue-600 px-6 py-4 text-lg 
                                    text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide"
                                        disabled={!isValidForm()}
                                        onClick={handelPassword}
                                    >
                                        {loader ? (
                                            <ComponentLevelLoader
                                                text={"Set Password"}
                                                color={"#ffffff"}
                                                loading={loader}
                                            />
                                        ) : (
                                            "Set Password"
                                        )}
                                    </button>
                                </div>
                            }
                            <div className="flex flex-col gap-2 mt-3 ">
                                <p className='text-gray-800' >Go to <a href="/login" className='text-blue-600'>Login</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Notification />
        </div>
    )
}
