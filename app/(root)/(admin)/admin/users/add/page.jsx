'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { zSchema } from '@/lib/zodSchema'
import { Input } from "@/components/ui/input"
import ButtonLoading from '@/components/Application/ButtonLoading'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { 
  ADMIN_DASHBOARD, 
  ADMIN_CUPON_SHOW, 
  ADMIN_CUPON_ADD
 } from '@/routes/AdminPanelRoute'
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

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_CUPON_SHOW, label: 'Cupon' },
  { href: ADMIN_CUPON_ADD, label: 'Add Cupon' },
]

const AddCupon = () => {
  const [loading, setLoading] = useState(false)
  

  const formSchema = zSchema.pick({
    code: true,
    discountPercent: true,
    minShoppingAmount: true,
    validity: true,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      discountPercent: 0,
      minShoppingAmount: 0,
      validity: "",
    }
  })



  const onSubmit = async (values) => {
    setLoading(true)
    try {

      const { data: response } = await axios.post('/api/cupon/create', values)
      if (!response.success) throw new Error(response.message || 'Something went wrong')

      form.reset()
      showToast('success', response.message || 'Cupon added successfully')
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
          <h4 className="font-semibold text-xl">Add Cupon</h4>
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
                  text="Add Cupon"
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

export default AddCupon
