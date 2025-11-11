'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { zSchema } from '@/lib/zodSchema'
import { Input } from "@/components/ui/input"
import ButtonLoading from '@/components/Application/ButtonLoading'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { ADMIN_DASHBOARD, ADMIN_CUPON_SHOW } from '@/routes/AdminPanelRoute'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import useFetch from '@/hooks/useFetch'
import { useParams } from 'next/navigation'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_CUPON_SHOW, label: 'Cupon' },
  { href: ADMIN_CUPON_SHOW, label: 'Edit Cupon' },
]

const EditCupon = () => {
  const { id } = useParams()
  
  const [loading, setLoading] = useState(false)
  const { data: getCupon } = useFetch(id ? `/api/cupon/get/${id}` : null)

  const formSchema = zSchema.pick({
    _id: true,
    code: true,
    discountPercent: true,
    minShoppingAmount: true,
    validity: true,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: '',
      code: "",
      discountPercent: 0,
      minShoppingAmount: 0,
      validity: "",
    }
  })

  useEffect(() => {
    if (getCupon && getCupon.success) {
      const cupon = getCupon.data
      form.reset({
        _id: cupon?._id,
        code: cupon?.code,
        discountPercent: cupon?.discountPercent,
        minShoppingAmount: cupon?.minShoppingAmount,
        validity: cupon?.validity ? new Date(cupon.validity).toISOString().slice(0,10) : "",
      })
    }
  }, [getCupon, form])

  const onSubmit = async (values) => {
    setLoading(true)
    try {
      const { data: response } = await axios.put(`/api/cupon/update`, values)
      if (!response.success) throw new Error(response.message || 'Something went wrong')

      showToast('success', response.message || 'Cupon updated successfully')
    } catch (error) {
      showToast('error', error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="border-b pb-2 pt-3 px-4">
          <h4 className="font-semibold text-xl">Edit Cupon</h4>
        </CardHeader>

        <CardContent className="pb-6 pt-4 px-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >

              {/* Slug */}
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Code <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Discount Percent */}
              <FormField
                control={form.control}
                name="discountPercent"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Discount Percent <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter discount percent" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Min Shopping Amount */}
              <FormField
                control={form.control}
                name="minShoppingAmount"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Min Shopping Amount <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter min shopping amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Validity */}
              <FormField
                control={form.control}
                name="validity"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Validity <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date"  {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

<div className="md:col-span-2 flex flex-col space-y-3">
  <ButtonLoading
                  loading={loading}
                  type="submit"
                  text="Update Cupon"
                  className="cursor-pointer self-start"
                />

</div>
              
             
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditCupon
