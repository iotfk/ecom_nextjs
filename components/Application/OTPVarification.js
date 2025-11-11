'use client'
import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import ButtonLoading from '@/components/Application/ButtonLoading'
import axios from 'axios'  // ✅ Added
import { showToast } from '@/lib/showToast'  // ✅ Added

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"

const OTPVarification = ({ email, onSubmit, loading }) => {

    const [isResendOtp, setIsResendOtp] = useState(false)

    const formSchema = zSchema.pick({
        otp: true, 
        email: true
    })

    const form = useForm({
        resolver: zodResolver(formSchema), 
        defaultValues: {
            otp: '',
            email: email
        }
    })

    const handleOtpVarification = async (values) => {
        onSubmit(values)
    }

    const reSendOTP = async () => {
        try {
            setIsResendOtp(true)
            const { data: resendOtpResponse } = await axios.post('/api/auth/resend-otp', { email })
            if (!resendOtpResponse.success) {
                throw new Error(resendOtpResponse.message)
            }
            showToast('success', resendOtpResponse.message)
        } catch (error) {
            showToast('error', error.response?.data?.message || error.message || 'Failed to resend OTP')
        } finally {
            setIsResendOtp(false)
        } 
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleOtpVarification)} className="">

                    <div className='text-center'>
                        <h1 className='text-2xl font-bold mb-2'>Please enter Your OTP</h1>
                        <p>We have sent an OTP to your email</p>
                    </div>

                    <div className="mb-5 mt-5 flex justify-center">
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem className='flex flex-col items-center'>
                                    <FormLabel>One Time Password (OTP)</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field}>
                                            <InputOTPGroup>
                                                <InputOTPSlot className='text-xl size-10' index={0} />
                                                <InputOTPSlot className='text-xl size-10' index={1} />
                                                <InputOTPSlot className='text-xl size-10' index={2} />
                                                <InputOTPSlot className='text-xl size-10' index={3} />
                                                <InputOTPSlot className='text-xl size-10' index={4} />
                                                <InputOTPSlot className='text-xl size-10' index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='mb-3'>
                        <ButtonLoading 
                            loading={loading} 
                            type="submit" 
                            text="Verify" 
                            className="w-full cursor-pointer" 
                        />
                        <div className='text-center mt-5'>
                            {!isResendOtp ? (
                                <button  
                                    onClick={reSendOTP} 
                                    type='button' 
                                    className='text-blue-500 hover:underline cursor-pointer'
                                > 
                                    Resend OTP
                                </button>
                            ) : (
                                <span className='text-md'>Resending...</span>
                            )}
                        </div>
                    </div>

                </form>
            </Form>
        </div>
    )
}

export default OTPVarification
