'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb';
import useFetch from '@/hooks/useFetch';
import React, { use, useEffect, useState } from 'react'
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW, ADMIN_MEDIA_EDIT } from '@/routes/AdminPanelRoute';
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import ButtonLoading from '@/components/Application/ButtonLoading';
import { zSchema } from '@/lib/zodSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from "@/components/ui/input"
import Image from 'next/image';
import { showToast } from '@/lib/showToast';
import axios from 'axios';

const breadcrumbData = [
  { label: 'Home', href: ADMIN_DASHBOARD },
  { label: 'Media', href: ADMIN_MEDIA_SHOW },
  { label: 'Edit Media', href: '' },
];

const EditMedia = ({ params }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id } = use(params);
  const { data: mediaData, loading, error } = useFetch(`/api/media/get/${id}`);

  console.log(mediaData);

  const formSchema = zSchema.pick({
    _id: true,
    alt: true,
    title: true,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: "",
      alt: "",
      title: "",
    }
  })

  useEffect(() => {
    if (mediaData?.success && mediaData?.data) {
      console.log('Populating form with:', mediaData.data);
      const data = mediaData.data;
      form.reset({
        _id: data._id || "",
        alt: data.alt || "",
        title: data.title || "",
      });
      console.log('Form values after reset:', form.getValues());
    }
  }, [mediaData, form])

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const { data: updateResponse } = await axios.put('/api/media/update', values);
      if (!updateResponse.success) {
        throw new Error(updateResponse.message);
      }
      showToast('success', updateResponse.message);
      form.reset();

      console.log(values);
    } catch (error) {
      console.error(error);
      showToast('error', error.response?.data?.message || error.message || 'Update failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return <div className="p-4">Loading media...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className='py-0 rounded shadow-sm'>
        <CardHeader className='border-b pb-2 pt-3 px-3'>
          <h4 className='font-semibold text-xl'>Edit Media</h4>
        </CardHeader>

        <CardContent className="pb-5 pt-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl">

              {/* ✅ Original Image rendering */}
              {mediaData?.data?.secure_url && (
                <div className="mb-5">
                  <Image
                    src={mediaData.data.secure_url}
                    width={500}
                    height={500}
                    alt={mediaData.data.alt || mediaData.data.public_id || 'Media Image'}
                    className='rounded shadow-md'
                    priority
                  />
                </div>
              )}

              {/* ✅ Constrained width input fields */}
              <div className="mb-5 w-[400px]">
                <FormField
                  control={form.control}
                  name="alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alt Text</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter alt text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-5 w-[400px]">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='mb-3'>
                <ButtonLoading
                  loading={isSubmitting}
                  type="submit"
                  text="Update"
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

export default EditMedia
