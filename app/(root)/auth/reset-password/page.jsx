'use client'
import { Card, CardContent } from '@/components/ui/card'
import React, { useState } from 'react'
import Logo from '@/public/assets/images/logo-black.png'
import Image from 'next/image'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { zSchema } from '@/lib/zodSchema'
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { Button } from "@/components/ui/button"
import axios from 'axios'

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import ButtonLoading from '@/components/Application/ButtonLoading'
import z from 'zod'
import Link from 'next/link'
import { WEBSITE_LOGIN, WEBSITE_REGISTER, WEBSITE_RESETPASSWORD } from '@/routes/WebsiteRoute'
import { showToast } from '@/lib/showToast'
import OTPVarification from '@/components/Application/OTPVarification'
import { useDispatch } from 'react-redux'
import { login } from '@/store/reducer/authReducer'
import UpdatePassword from '@/components/Application/UpdatePassword'

const ResetPassword = () => {

    const [isOtpVarified, setIsOtpVarified] = useState(false)
    const [otpEmail, setOtpEmail] = useState()
    const [emailVarificationLoading, setEmailVarificationLoading] = useState(false)
    const [otpVarificationLoading, setOtpVarificationLoading] = useState(false);


    const formSchema = zSchema.pick({
        email: true
    })


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        }
    })

    const handleEmailvarification = async (values) => {
        try {
            setEmailVarificationLoading(true)
            const { data: sendOtpResponse } = await axios.post('/api/auth/reset-password/send-otp', values)
            if (!sendOtpResponse.success) {
                throw new Error(sendOtpResponse.message)
            }
            setOtpEmail(values.email)

            showToast('success', sendOtpResponse.message)
            //dispach(login(sendOtpResponse.data))
        } catch (error) {
            // Use error object, not loginResponse
            showToast('error', error.response?.data?.message || error.message || 'Login failed')
        } finally {
            setEmailVarificationLoading(false)
        }
    }


    const handleOtpVarification = async (values) => {
        console.log(values);

        try {
            setOtpVarificationLoading(true)
            const { data: otpResponse } = await axios.post('/api/auth/reset-password/verify-otp', values)
            if (!otpResponse.success) {
                throw new Error(otpResponse.message)
            }
            // setOtpEmail('')

            showToast('success', otpResponse.message)
            setIsOtpVarified(true)
            // dispach(login(otpResponse.data))
        } catch (error) {
            // Use error object, not loginResponse
            showToast('error', error.response?.data?.message || error.message || 'Login failed')
        } finally {
            setOtpVarificationLoading(false)
        }
    }



    return (
        <Card className="w-[400px]">
            <CardContent>
                <div className="flex justify-center " >
                    <Image src={Logo.src} width={Logo.width} height={Logo.height} alt='logo' className='max-w-[150px]' />

                </div>


                {!otpEmail ?

                    <>

                        <div className='text-center'>
                            <h1 className='text-2xl font-semibold'>Reset Password</h1>
                            <p> Enter your Email to get password reset link </p>
                        </div>


                        <div className='mt-5'>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleEmailvarification)} className="">
                                    <div className="mb-5">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" placeholder="example@email.com" {...field} />
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>


                                    <div className='mb-3'>
                                        <ButtonLoading loading={emailVarificationLoading} type="submit" text="Send OTP" className="w-full cursor-pointer" />

                                    </div>

                                    <div className="text-center">
                                        <div className="flex justify-center item-center gap-1">

                                            <Link className='text-primary underline' href={WEBSITE_LOGIN} > Back to Login </Link>


                                        </div>

                                        {/* <div className="mt-3">
                                            <Link className='text-primary underline' href={WEBSITE_RESETPASSWORD} > Forget Password ? </Link>
                                        </div> */}

                                    </div>

                                </form>
                            </Form>
                        </div>


                    </> :

                    <>

                        {!isOtpVarified ? <OTPVarification email={otpEmail} loading={otpVarificationLoading} onSubmit={handleOtpVarification} />
                            : <UpdatePassword email={otpEmail}/>}


                    </>


                }


            </CardContent>

        </Card>
    )
}

export default ResetPassword
