"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Category } from "@prisma/client"

import { categorySchema, CategoryInput } from "@repo/services/validations/category"
import { createCategory, updateCategory } from "@/app/admin/categories/actions"

import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { Checkbox } from "@repo/ui/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form"
import { useToast } from "@repo/ui/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { ImageUploader } from "@repo/ui/components/admin/ui/image-uploader"
import { useTranslation } from "@repo/services/i18n/LanguageContext"

interface CategoryFormProps {
  categories: Category[]
  initialData?: Category | null
}

export function CategoryForm({ categories, initialData }: CategoryFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, setIsPending] = useState(false)
  const { t } = useTranslation()

  const form = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData ? {
      name: initialData.name,
      slug: initialData.slug,
      description: initialData.description || "",
      imageUrl: initialData.imageUrl || "",
      parentId: initialData.parentId || "",
      isActive: initialData.isActive,
      sortOrder: initialData.sortOrder,
    } : {
      name: "",
      slug: "",
      description: "",
      imageUrl: "",
      parentId: "",
      isActive: true,
      sortOrder: 0,
    },
  })

  async function onSubmit(data: CategoryInput) {
    setIsPending(true)
    try {
      const result = initialData 
        ? await updateCategory(initialData.id, data)
        : await createCategory(data)

      if (result.success) {
        toast({
          title: t("admin.success") || "Success",
          description: initialData ? (t("admin.categoryUpdated") || "Category updated successfully.") : (t("admin.categoryCreated") || "Category created successfully."),
        })
        router.push("/admin/categories")
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("admin.name") || "Name"}</FormLabel>
              <FormControl>
                <Input placeholder={t("admin.categoryNamePlaceholder") || "e.g. Cables"} {...field} onBlur={() => {
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
                <Input placeholder="cables" {...field} />
              </FormControl>
              <FormDescription>{t("admin.slugDesc") || "Unique URL friendly identifier."}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("admin.parentCategory") || "Parent Category"}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin.selectParentCategory") || "Select a parent category (optional)"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">{t("admin.noneTopLevel") || "None (Top Level)"}</SelectItem>
                  {categories.filter(c => c.id !== initialData?.id).map((category) => (
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("admin.description") || "Description"}</FormLabel>
              <FormControl>
                <Input placeholder={t("admin.categoryDescPlaceholder") || "Category description..."} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("admin.categoryImage") || "Category Image"}</FormLabel>
              <FormControl>
                <ImageUploader 
                  value={field.value ? [field.value] : []} 
                  onChange={(urls) => field.onChange(urls[0] || "")} 
                  onRemove={() => field.onChange("")}
                  maxFiles={1}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sortOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("admin.sortOrder") || "Sort Order"}</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{t("admin.active") || "Active"}</FormLabel>
                <FormDescription>
                  {t("admin.activeDesc") || "This category will be visible on the website."}
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? (t("admin.saveChanges") || "Save Changes") : (t("admin.createCategory") || "Create Category")}
        </Button>
      </form>
    </Form>
  )
}
