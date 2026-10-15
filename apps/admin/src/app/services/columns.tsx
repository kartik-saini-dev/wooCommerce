"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Service, ServiceCategory } from "@prisma/client"
import { MoreHorizontal, Pencil, Trash, Copy } from "lucide-react"

import { Badge } from "@repo/ui/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu"
import { deleteService } from "./actions"
import { useToast } from "@repo/ui/hooks/use-toast"

type ServiceWithCategory = Service & { category: ServiceCategory }

export const columns: ColumnDef<ServiceWithCategory>[] = [
  {
    accessorKey: "name",
    header: "Service Name",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("name")}</div>
        <div className="text-xs text-muted-foreground">{row.original.slug}</div>
      </div>
    ),
  },
  {
    accessorKey: "category.name",
    header: "Category",
    cell: ({ row }) => <Badge variant="outline">{row.original.category.name}</Badge>
  },
  {
    accessorKey: "basePrice",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("basePrice"))
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(price)
      return <div className="font-medium">{formatted}</div>
    },
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
      const service = row.original
      const { toast } = useToast()

      const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this service?")) return
        const result = await deleteService(service.id)
        if (result.success) {
          toast({ title: "Deleted", description: "Service removed." })
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
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.location.href = `/admin/services/${service.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.href = `/admin/services/new?duplicate=${service.id}`}>
              <Copy className="mr-2 h-4 w-4" /> Duplicate
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

