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
import { USER_DASHBOARD, WEBSITE_REGISTER, WEBSITE_RESETPASSWORD } from '@/routes/WebsiteRoute'
import { showToast } from '@/lib/showToast'
import OTPVarification from '@/components/Application/OTPVarification'
import { useDispatch } from 'react-redux'
import { login } from '@/store/reducer/authReducer'
import { useRouter, useSearchParams } from 'next/navigation'
import { ADMIN_DASHBOARD } from '@/routes/AdminPanelRoute'




const LoginPage = () => {

  const searchParams = useSearchParams()

  const router = useRouter()
  const dispach = useDispatch()
  const [loading, setloading] = useState(false);
  const [otpVarificationLoading, setOtpVarificationLoading] = useState(false);
  const [isTypePassword, setIsTypePassword] = useState(true)

  const [otpEmail, setOtpEmail] = useState()


  const formSchema = zSchema.pick({
    email: true,

  }).extend({
    password: z.string().min('3', 'Password Field is Required!')
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const handleLoginSubmit = async (values) => {
    console.log(values);


    try {
      setloading(true)
      const { data: loginResponse } = await axios.post('/api/auth/login', values)
      if (!loginResponse.success) {
        throw new Error(loginResponse.message)
      }
      setOtpEmail(values.email)

      form.reset()
      showToast('success', loginResponse.message)
    } catch (error) {
      // Use error object, not loginResponse
      showToast('error', error.response?.data?.message || error.message || 'Login failed')
    } finally {
      setloading(false)
    }


  }


  const handleOtpVarification = async (values) => {
    // console.log(values);

    try {
      setOtpVarificationLoading(true)
      const { data: otpResponse } = await axios.post('/api/auth/verify-otp', values)
      if (!otpResponse.success) {
        throw new Error(otpResponse.message)
      }
      setOtpEmail('')

      showToast('success', otpResponse.message)
      dispach(login(otpResponse.data))


      //  console.log(otpResponse.data);

      const userRole = otpResponse.data?.user?.role || otpResponse.data?.role;


      if (searchParams.has('callback')) {
        router.push(searchParams.get('callback'))
      } else {
        userRole === 'admin' ? router.push(ADMIN_DASHBOARD) : router.push(USER_DASHBOARD)
      }

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
              <h1 className='text-2xl font-semibold'>Login into Account</h1>
              <p> Login to yoyr acount by filling out the form below </p>
            </div>


            <div className='mt-5'>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleLoginSubmit)} className="">
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
                  <div className="mb-5">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="relative"  >
                          <FormLabel>password</FormLabel>
                          <FormControl>
                            <Input type={isTypePassword ? 'password' : 'text'} placeholder="*******" {...field} />
                          </FormControl>

                          <button type='button' className='absolute top-1/2 right-2 cursor-pointer' onClick={() => setIsTypePassword(!isTypePassword)}>

                            {isTypePassword ? <FaRegEyeSlash /> : <FaRegEye />}
                          </button>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='mb-3'>
                    <ButtonLoading loading={loading} type="submit" text="Login" className="w-full cursor-pointer" />

                  </div>

                  <div className="text-center">
                    <div className="flex justify-center item-center gap-1">
                      <p>Dont Have an Account ?</p>
                      <Link className='text-primary underline' href={WEBSITE_REGISTER} > Create one </Link>


                    </div>

                    <div className="mt-3">
                      <Link className='text-primary underline' href={WEBSITE_RESETPASSWORD} > Forget Password ? </Link>
                    </div>

                  </div>

                </form>
              </Form>
            </div>


          </> :

          <>
            <OTPVarification email={otpEmail} loading={otpVarificationLoading} onSubmit={handleOtpVarification} />

          </>


        }


      </CardContent>

    </Card>
  )
}

export default LoginPage
