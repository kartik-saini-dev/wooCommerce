"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Category } from "@prisma/client"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"

import { Button } from "@repo/ui/components/ui/button"
import { Badge } from "@repo/ui/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu"
import { deleteCategory } from "./actions"
import { useToast } from "@repo/ui/hooks/use-toast"

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: function HeaderName() {
      const { t } = require("@repo/services/i18n/LanguageContext").useTranslation();
      return <>{t("admin.name") || "Name"}</>;
    },
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("name")}</div>
        <div className="text-xs text-muted-foreground">{row.original.slug}</div>
      </div>
    ),
  },
  {
    accessorKey: "sortOrder",
    header: function HeaderOrder() {
      const { t } = require("@repo/services/i18n/LanguageContext").useTranslation();
      return <>{t("admin.order") || "Order"}</>;
    },
  },
  {
    accessorKey: "isActive",
    header: function HeaderStatus() {
      const { t } = require("@repo/services/i18n/LanguageContext").useTranslation();
      return <>{t("admin.status") || "Status"}</>;
    },
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean
      const { t } = require("@repo/services/i18n/LanguageContext").useTranslation();
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? (t("admin.activeStatus") || "Active") : (t("admin.hiddenStatus") || "Hidden")}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original
      const { toast } = useToast()
      const { t } = require("@repo/services/i18n/LanguageContext").useTranslation();

      const handleDelete = async () => {
        if (!confirm(t("admin.confirmDeleteCategory") || "Are you sure you want to delete this product category?")) return
        const result = await deleteCategory(category.id)
        if (result.success) {
          toast({ title: t("admin.deleted") || "Deleted", description: t("admin.categoryRemoved") || "Category removed." })
        } else {
          toast({ title: t("admin.error") || "Error", description: 'error' in result ? result.error : (t("admin.unknownError") || "Unknown error"), variant: "destructive" })
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground">
            <span className="sr-only">{t("admin.openMenu") || "Open menu"}</span>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("admin.actions") || "Actions"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.location.href = `/admin/categories/${category.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" /> {t("admin.edit") || "Edit"}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground" onClick={handleDelete}>
              <Trash className="mr-2 h-4 w-4" /> {t("admin.delete") || "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

