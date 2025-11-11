'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { zSchema } from '@/lib/zodSchema'
import { Input } from "@/components/ui/input"
import ButtonLoading from '@/components/Application/ButtonLoading'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import {
  ADMIN_DASHBOARD,
  ADMIN_PRODUCT_VARIANT_SHOW,
  ADMIN_PRODUCT_VARIANT_ADD
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
import useFetch from '@/hooks/useFetch'
import Select from '@/components/Application/Select'
import Editor from '@/components/Application/Admin/Editor'
import MediaModal from '@/components/Application/Admin/MediaModal'
import Image from 'next/image'
import { sizes } from '@/lib/utils'
const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_PRODUCT_VARIANT_SHOW, label: 'Product Variant' },
  { href: ADMIN_PRODUCT_VARIANT_ADD, label: 'Add Product Variant' },
]

const AddProductVariant = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [productOption, setProductOption] = useState([])
  const { data: getProduct } = useFetch('/api/product?deleteType=SD&size=100')

  console.log(getProduct);

  const [open, setOpen] = useState(false)

  const [selectedMedia, setSelectedMedia] = useState([])

  useEffect(() => {
    if (getProduct) {
      const data = getProduct.data
      const options = data.map((product) => ({
        value: product._id,
        label: product.name,
      }))
      //  console.log(options);

      setProductOption(options)
    }
  }, [getProduct])

  const formSchema = zSchema.pick({
    product: true,
    sku: true,
    color: true,
    size: true,
    mrp: true,
    sellingPrice: true,
    discountPercent: true,

  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: "",
      sku: "",
      color: "",
      size: "",
      mrp: "",
      sellingPrice: "",
      discountPercent: ""

    }
  })

  const nameValue = form.watch('name')


  useEffect(() => {
    const mrp = form.watch('mrp')
    const sellingPrice = form.watch('sellingPrice')

    if (mrp && sellingPrice) {
      const discount = ((mrp - sellingPrice) / mrp) * 100
      form.setValue('discountPercent', Number(discount.toFixed(2)))
    } else {
      form.setValue('discountPercent', 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch('mrp'), form.watch('sellingPrice')])




  const onSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      if (selectedMedia.length <= 0) {
        showToast('error', 'Please select at least one media')
        setIsSubmitting(false)
        return
      }

      const mediaIds = selectedMedia.map((media) => media._id)
      values.media = mediaIds
      console.log(values);

      const { data: response } = await axios.post('/api/product-variant/create', values)
      if (!response.success) throw new Error(response.message || 'Something went wrong')


      // form.reset()
      showToast('success', response.message || 'Product-variant added successfully')
    } catch (error) {
      console.log(error);

      showToast('error', error.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div className="p-3 sm:p-4 md:p-6">
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="border-b pb-2 pt-3 px-4">
          <h4 className="font-semibold text-xl">Add Product-variant</h4>
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
                name="product"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Product <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>

                      <Select
                        options={productOption}
                        selected={field.value}
                        setSelected={field.onChange}
                        isMulti={false}
                      />

                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              {/* Product Name */}
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      SKU <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter sku" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug */}
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Color <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter color" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Size */}
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Size <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        options={sizes}
                        selected={field.value}
                        setSelected={field.onChange}
                        isMulti={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              {/* MRP */}
              <FormField
                control={form.control}
                name="mrp"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      MRP <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter MRP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Selling Price */}
              <FormField
                control={form.control}
                name="sellingPrice"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Selling Price <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter selling price" {...field} />
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
                      <Input readOnly type="number" placeholder="Enter discount percent" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />





              <div className="md:col-span-2 border border-dashed p-5 rounded flex flex-col items-center text-center gap-4">
                {/* Media Modal */}
                <MediaModal
                  open={open}
                  setOpen={setOpen}
                  selectedMedia={selectedMedia}
                  setSelectedMedia={setSelectedMedia}
                  isMultiple={true}
                />

                {/* Selected Media */}
                {selectedMedia.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mb-3">
                    {selectedMedia.map((media) => (
                      <div key={media._id} className="relative w-24 h-24 border rounded overflow-hidden">
                        <Image
                          src={media.secure_url}
                          alt={media._id}
                          fill

                          style={{ objectFit: 'contain' }}
                          className="rounded"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Media Button */}
                <div
                  onClick={() => setOpen(true)}
                  className="p-1  rounded cursor-pointer flex items-center justify-center w-30
           bg-gray-500/10 dark:bg-white/10 hover:bg-gray-500/20 dark:hover:bg-white/20
           transition border border-gray-300/30 dark:border-gray-700/50"

                >
                  <span className="font-medium text-lg text-gray-700 dark:text-gray-200">
                    Add Media
                  </span>
                </div>

              </div>




              <div className="md:col-span-2 flex flex-col space-y-3">
                <ButtonLoading
                  loading={isSubmitting}
                  type="submit"
                  text="Add Variant"
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

export default AddProductVariant
