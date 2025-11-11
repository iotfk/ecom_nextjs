'use client'  // 👈 must be the very first line

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import slugify from 'slugify'
import { zodResolver } from '@hookform/resolvers/zod'
import { zSchema } from '@/lib/zodSchema'
import { Input } from "@/components/ui/input"
import ButtonLoading from '@/components/Application/ButtonLoading'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { ADMIN_CATEGORY_ADD, ADMIN_DASHBOARD, ADMIN_CATEGORY_SHOW } from '@/routes/AdminPanelRoute'
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
  { href: ADMIN_CATEGORY_SHOW, label: 'Category' },
  { href: ADMIN_CATEGORY_ADD, label: 'Add Category' },
]

const AddCategory = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formSchema = zSchema.pick({
    name: true,
    slug: true,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    }
  })


 
  const nameValue = form.watch('name');

  useEffect(() => {
    if (nameValue) {
      const slug = slugify(nameValue, {
        lower: true,
        strict: true,
        trim: true,
        replacement: '-'
      });
      form.setValue('slug', slug);
    }
  }, [nameValue, form]);

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const {data: response} =  await axios.post('/api/category/create', values);
      if(!response.success){
        throw new Error(response.message || 'Something went wrong');
      }
      form.reset();
      showToast('success', response.message || 'Category added successfully');
    } catch (error) {
      showToast('error', error.message || 'Something went wrong');
      
    }finally{
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="border-b pb-2 pt-3 px-3">
          <h4 className="font-semibold text-xl">Add Category</h4>
        </CardHeader>

        <CardContent className="pb-5 pt-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl">

              <div className="mb-5 w-[400px]">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter category name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-5 w-[400px]">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-3">
                <ButtonLoading
                  loading={isSubmitting}
                  type="submit"
                  text="Add Category"
                  className="cursor-pointer"
                />
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddCategory
