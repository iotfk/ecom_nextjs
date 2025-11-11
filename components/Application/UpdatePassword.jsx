'use client'
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { zSchema } from '@/lib/zodSchema'
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import ButtonLoading from '@/components/Application/ButtonLoading'
import z from 'zod'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import { useRouter } from 'next/navigation'
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoute'

const UpdatePassword = ({ email }) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const formSchema = zSchema.pick({
        email: true,
        password: true
    }).extend({
        confirmPassword: z.string().min(1, 'Confirm password is required')
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords must match",
        path: ['confirmPassword']
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: email || "",
            password: "",
            confirmPassword: ""
        }
    })

    const handlePasswordUpdate = async (values) => {
        console.log('Submitting:', values)

        try {
            setLoading(true)
            
            const { data: passwordUpdateResponse } = await axios.put(
                '/api/auth/reset-password/update-password', 
                {
                    email: values.email,
                    password: values.password
                }
            )
            
            console.log('Response:', passwordUpdateResponse)
            
            if (!passwordUpdateResponse.success) {
                throw new Error(passwordUpdateResponse.message)
            }
            
            showToast('success', passwordUpdateResponse.message)
            form.reset()
            
            setTimeout(() => {
                router.push(WEBSITE_LOGIN)
            }, 1500)
            
        } catch (error) {
            console.error('Error:', error)
            showToast('error', error.response?.data?.message || error.message || 'Failed to update password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div className='text-center'>
                <h1 className='text-2xl font-semibold'>Update Password</h1>
                <p>Reset your password</p>
            </div>

            <div className='mt-5'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handlePasswordUpdate)}>
                        
                        {/* Hidden email field */}
                        <input 
                            type="hidden" 
                            {...form.register('email')} 
                            value={email}
                        />
                        
                        <div className="mb-5">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="relative">
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type={showPassword ? 'text' : 'password'} 
                                                placeholder="Enter new password" 
                                                {...field} 
                                            />
                                        </FormControl>

                                        <button 
                                            type='button' 
                                            className='absolute top-1/2 right-2 cursor-pointer' 
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                        </button>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        <div className="mb-5">
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem className="relative">
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type={showConfirmPassword ? 'text' : 'password'} 
                                                placeholder="Confirm new password" 
                                                {...field} 
                                            />
                                        </FormControl>

                                        <button 
                                            type='button' 
                                            className='absolute top-1/2 right-2 cursor-pointer' 
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                        </button>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        <div className='mb-3'>
                            <ButtonLoading 
                                loading={loading} 
                                type="submit" 
                                text="Update Password" 
                                className="w-full cursor-pointer" 
                            />
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default UpdatePassword
