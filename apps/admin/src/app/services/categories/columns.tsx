"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ServiceCategory } from "@prisma/client"
import { MoreHorizontal, Pencil, Trash, GripVertical } from "lucide-react"

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
import { deleteServiceCategory } from "./actions"
import { useToast } from "@repo/ui/hooks/use-toast"

export const columns: ColumnDef<ServiceCategory>[] = [
  {
    accessorKey: "sortOrder",
    header: "Order",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground">
        <GripVertical className="h-4 w-4 cursor-grab active:cursor-grabbing" />
        {row.getValue("sortOrder")}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("slug")}</div>
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Hidden"}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original
      const { toast } = useToast()

      const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this category?")) return
        const result = await deleteServiceCategory(category.id)
        if (result.success) {
          toast({ title: "Deleted", description: "Category removed." })
        } else {
          toast({ title: "Error", description: 'error' in result ? result.error : "Unknown error", variant: "destructive" })
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(category.id)}>
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.location.href = `/admin/services/categories/${category.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground" onClick={handleDelete}>
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

