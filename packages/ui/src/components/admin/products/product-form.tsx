"use client"

import { useTranslation } from "@repo/services/i18n/LanguageContext"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"

import { productSchema, type ProductInput } from "@repo/services/validations/product"
import { createProductAction, updateProductAction } from "@/app/admin/products/actions"
import { ImageUploader } from "@repo/ui/components/admin/ui/image-uploader"
import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { Textarea } from "@repo/ui/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs"
import { Checkbox } from "@repo/ui/components/ui/checkbox"
import { useToast } from "@repo/ui/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface ProductFormProps {
  initialData?: {
    id: string;
    price: string | number;
    comparePrice?: string | number | null;
    discount?: string | number | null;
    inventory?: { quantity: number; lowStock: number };
    images?: { url: string }[];
    [key: string]: unknown;
  } | null // Full product object if editing
  categories: { id: string, name: string }[]
  brands: { id: string, name: string }[]
}

export function ProductForm({ initialData, categories, brands }: ProductFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, setIsPending] = React.useState(false)
  const { t } = useTranslation()

  const defaultValues: Partial<ProductInput> = initialData ? {
    ...initialData,
    price: Number(initialData.price),
    comparePrice: initialData.comparePrice ? Number(initialData.comparePrice) : undefined,
    discount: initialData.discount ? Number(initialData.discount) : undefined,
    inventoryQuantity: initialData.inventory?.quantity || 0,
    lowStockThreshold: initialData.inventory?.lowStock || 5,
    images: initialData.images?.map((img) => img.url) || [],
  } : {
    name: "",
    slug: "",
    sku: "",
    description: "",
    shortDescription: "",
    price: 0,
    isActive: true,
    isFeatured: false,
    inventoryQuantity: 0,
    lowStockThreshold: 5,
    images: [],
  }

  const form = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues,
  })

  async function onSubmit(data: ProductInput) {
    setIsPending(true)
    try {
      let result
      if (initialData) {
        result = await updateProductAction(initialData.id, data)
      } else {
        result = await createProductAction(data)
      }

      if (result && 'error' in result) {
        toast({ title: t("admin.error") || "Error", description: result.error, variant: "destructive" })
      } else {
        toast({ title: t("admin.success") || "Success", description: initialData ? (t("admin.productUpdated") || "Product successfully updated.") : (t("admin.productCreated") || "Product successfully created.") })
        router.push("/admin/products")
      }
    } catch (error) {
      toast({ title: t("admin.error") || "Error", description: t("admin.errorOccurred") || "Something went wrong.", variant: "destructive" })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="basic">{t("admin.tabBasicInfo") || "Basic Info"}</TabsTrigger>
            <TabsTrigger value="pricing">{t("admin.tabPricingStock") || "Pricing & Stock"}</TabsTrigger>
            <TabsTrigger value="images">{t("admin.tabImages") || "Images"}</TabsTrigger>
            <TabsTrigger value="seo">{t("admin.tabSEOStatus") || "SEO & Status"}</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("admin.name") || "Name"} *</FormLabel>
                    <FormControl><Input placeholder="Product name" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("admin.slug") || "Slug"} *</FormLabel>
                    <FormControl><Input placeholder="product-url-slug" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.shortDescription") || "Short Description"}</FormLabel>
                  <FormControl><Input placeholder="Brief summary" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.fullDescription") || "Full Description"} *</FormLabel>
                  <FormControl><Textarea className="min-h-[150px]" placeholder="Detailed product description" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("admin.category") || "Category"} *</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="">{t("admin.selectCategory") || "Select Category"}</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brandId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("admin.brand") || "Brand"}</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                        value={field.value || ""}
                      >
                        <option value="">{t("admin.selectBrand") || "Select Brand"}</option>
                        {brands.map((b) => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("admin.price") || "Final Price"} *</FormLabel>
                    <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comparePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("admin.comparePrice") || "Compare at Price (Original MRP)"}</FormLabel>
                    <FormControl><Input type="number" step="0.01" {...field} value={field.value || ""} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("admin.sku") || "SKU"} *</FormLabel>
                    <FormControl><Input placeholder="STOCK-KEEPING-UNIT" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="inventoryQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("admin.inventoryQuantity") || "Stock Quantity"}</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lowStockThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("admin.lowStockThreshold") || "Low Stock Alert Threshold"}</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="images" className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.productImages") || "Product Images (Max 5)"}</FormLabel>
                  <FormDescription>{t("admin.primaryImageDesc") || "The first image will be used as the primary image."}</FormDescription>
                  <FormControl>
                    <ImageUploader 
                      value={field.value} 
                      onChange={field.onChange} 
                      onRemove={(url) => field.onChange(field.value.filter(u => u !== url))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="seo" className="space-y-4 mt-4">
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{t("admin.activeProduct") || "Active Product"}</FormLabel>
                      <FormDescription>{t("admin.activeProductDesc") || "This product will be visible in the storefront."}</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{t("admin.featuredProduct") || "Featured Product"}</FormLabel>
                      <FormDescription>{t("admin.featuredProductDesc") || "Highlight this product on the homepage."}</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="seoTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.seoTitle") || "SEO Title"}</FormLabel>
                  <FormControl><Input placeholder="Optimized title" {...field} value={field.value || ""} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="seoDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.seoDescription") || "SEO Description"}</FormLabel>
                  <FormControl><Textarea placeholder="Meta description" {...field} value={field.value || ""} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
            {t("admin.cancel") || "Cancel"}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? (t("admin.updateProduct") || "Update Product") : (t("admin.createProduct") || "Create Product")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
