"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Service, ServiceImage, ServiceCategory } from "@prisma/client"

import { serviceSchema, ServiceInput } from "@repo/services/validations/service"
import { createService, updateService } from "@/app/admin/services/actions"

import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { Textarea } from "@repo/ui/components/ui/textarea"
import { Checkbox } from "@repo/ui/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs"
import { useToast } from "@repo/ui/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useTranslation } from "@repo/services/i18n/LanguageContext"

import { ImageUploader } from "@repo/ui/components/admin/ui/image-uploader"

interface ServiceFormProps {
  categories: ServiceCategory[]
  initialData?: (Service & { images: ServiceImage[] }) | null
}

export function ServiceForm({ categories, initialData }: ServiceFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, setIsPending] = useState(false)
  const { t } = useTranslation()

  const defaultValues: Partial<ServiceInput> = initialData ? {
    name: initialData.name,
    slug: initialData.slug,
    categoryId: initialData.categoryId,
    shortDescription: initialData.shortDescription || "",
    description: initialData.description,
    basePrice: Number(initialData.basePrice),
    estimatedHrs: initialData.estimatedHrs || undefined,
    availableAreas: initialData.availableAreas,
    isEmergency: initialData.isEmergency,
    isHomeVisit: initialData.isHomeVisit,
    isFeatured: initialData.isFeatured,
    isActive: initialData.isActive,
    seoTitle: initialData.seoTitle || "",
    seoDescription: initialData.seoDescription || "",
    images: initialData.images.map(img => img.url),
  } : {
    name: "",
    slug: "",
    categoryId: "",
    shortDescription: "",
    description: "",
    basePrice: 0,
    estimatedHrs: undefined,
    availableAreas: [],
    isEmergency: false,
    isHomeVisit: true,
    isFeatured: false,
    isActive: true,
    seoTitle: "",
    seoDescription: "",
    images: [],
  }

  const form = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues,
  })

  async function onSubmit(data: ServiceInput) {
    setIsPending(true)
    try {
      const result = initialData 
        ? await updateService(initialData.id, data)
        : await createService(data)

      if (result.success) {
        toast({
          title: t("admin.success") || "Success",
          description: initialData ? (t("admin.serviceUpdated") || "Service updated successfully.") : (t("admin.serviceCreated") || "Service created successfully."),
        })
        router.push("/admin/services")
        router.refresh()
      } else {
        toast({
          title: t("admin.error") || "Error",
          description: 'error' in result ? result.error : (t("admin.errorOccurred") || "Something went wrong."),
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t("admin.error") || "Error",
        description: t("admin.unexpectedError") || "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  const generateSlug = () => {
    const name = form.getValues("name")
    if (name && !form.getValues("slug")) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      form.setValue("slug", slug, { shouldValidate: true })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">{t("admin.tabBasicInfo") || "Basic Info"}</TabsTrigger>
            <TabsTrigger value="details">{t("admin.tabPricingDetails") || "Details & Pricing"}</TabsTrigger>
            <TabsTrigger value="images">{t("admin.tabImages") || "Media"}</TabsTrigger>
            <TabsTrigger value="seo">{t("admin.tabSEOStatus") || "SEO"}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6 pt-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("admin.serviceName") || "Service Name"}</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Electrical Panel Upgrade" {...field} onBlur={() => {
                        field.onBlur()
                        generateSlug()
                      }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("admin.slug") || "Slug"}</FormLabel>
                    <FormControl>
                      <Input placeholder="electrical-panel-upgrade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.category") || "Category"}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("admin.selectCategory") || "Select a category"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.shortDescription") || "Short Description"}</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief summary of the service" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.fullDescription") || "Full Description"}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detailed description of what the service includes..." 
                      className="min-h-[150px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="details" className="space-y-6 pt-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("admin.basePrice") || "Base Price (₹)"}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimatedHrs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("admin.estimatedDuration") || "Estimated Duration (Hrs)"}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="availableAreas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.availableAreas") || "Available Areas (Comma separated)"}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Downtown, Uptown, Suburbs" 
                      value={field.value?.join(", ")}
                      onChange={(e) => {
                        const val = e.target.value
                        field.onChange(val ? val.split(",").map(s => s.trim()).filter(Boolean) : [])
                      }}
                    />
                  </FormControl>
                  <FormDescription>{t("admin.availableAreasDesc") || "Leave empty if available everywhere."}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{t("admin.activeStatus") || "Active Status"}</FormLabel>
                      <FormDescription>{t("admin.activeStatusDesc") || "Is this service available to book?"}</FormDescription>
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
                      <FormLabel>{t("admin.featuredService") || "Featured Service"}</FormLabel>
                      <FormDescription>{t("admin.featuredServiceDesc") || "Show this on the homepage."}</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isEmergency"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{t("admin.emergencyService") || "Emergency Service"}</FormLabel>
                      <FormDescription>{t("admin.emergencyServiceDesc") || "Available for 24/7 emergency dispatch."}</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isHomeVisit"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{t("admin.homeVisit") || "Home Visit"}</FormLabel>
                      <FormDescription>{t("admin.homeVisitDesc") || "Technician visits customer location."}</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="images" className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.serviceImages") || "Service Images"}</FormLabel>
                  <FormControl>
                    <ImageUploader 
                      value={field.value} 
                      onChange={field.onChange} 
                      onRemove={(url) => field.onChange(field.value.filter((u: string) => u !== url))}
                      maxFiles={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="seo" className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="seoTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.seoTitle") || "SEO Title"}</FormLabel>
                  <FormControl>
                    <Input placeholder="Custom title for search engines" {...field} />
                  </FormControl>
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
                  <FormControl>
                    <Textarea 
                      placeholder="Custom description for search engines" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.push("/admin/services")} disabled={isPending}>
            {t("admin.cancel") || "Cancel"}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? (t("admin.saveChanges") || "Save Changes") : (t("admin.createService") || "Create Service")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
