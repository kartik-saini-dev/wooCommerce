"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Trash, MailOpen, Mail } from "lucide-react"

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
import { ConfirmDialog } from "@repo/ui/components/admin/ui/confirm-dialog"
import { toggleMessageReadStatus, deleteMessage } from "@repo/services/actions/admin-messages"
import { useToast } from "@repo/ui/hooks/use-toast"
import { useTransition } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog"

export type MessageColumnData = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  isRead: boolean
  createdAt: Date
}

export const columns: ColumnDef<MessageColumnData>[] = [
  {
    accessorKey: "name",
    header: "Sender",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("name")}</div>
        <div className="text-xs text-muted-foreground">{row.original.email}</div>
      </div>
    ),
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => {
      const subject = row.getValue("subject") as string
      return (
        <div className="max-w-[200px] truncate font-medium" title={subject}>
          {subject}
        </div>
      )
    }
  },
  {
    accessorKey: "createdAt",
    header: "Received",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date
      return (
        <div className="text-sm text-muted-foreground">
          {date.toLocaleDateString()}
        </div>
      )
    },
  },
  {
    accessorKey: "isRead",
    header: "Status",
    cell: ({ row }) => {
      const isRead = row.getValue("isRead") as boolean
      return (
        <Badge variant={isRead ? "outline" : "default"}>
          {isRead ? "Read" : "New"}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const message = row.original
      const { toast } = useToast()
      const [isPending, startTransition] = useTransition()

      const handleToggleStatus = () => {
        startTransition(async () => {
          const result = await toggleMessageReadStatus(message.id, message.isRead)
          if (result.success) {
            toast({ title: "Status updated" })
          } else {
            toast({ title: "Error", description: result.error, variant: "destructive" })
          }
        })
      }

      const handleDelete = async () => {
        const result = await deleteMessage(message.id)
        if (result.success) {
          toast({ title: "Message deleted" })
        } else {
          toast({ title: "Error", description: result.error, variant: "destructive" })
        }
      }

      return (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              
              <DialogTrigger render={<DropdownMenuItem />}>
                Read Message
              </DialogTrigger>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={handleToggleStatus} disabled={isPending}>
                {message.isRead ? (
                  <><Mail className="mr-2 h-4 w-4" /> Mark as unread</>
                ) : (
                  <><MailOpen className="mr-2 h-4 w-4" /> Mark as read</>
                )}
              </DropdownMenuItem>
              
              <ConfirmDialog 
                title="Delete Message" 
                description="Are you sure you want to delete this message? This action cannot be undone."
                onConfirm={handleDelete}
              >
                <DropdownMenuItem 
                  className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </ConfirmDialog>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{message.subject}</DialogTitle>
              <DialogDescription>
                From: {message.name} &lt;{message.email}&gt;
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 whitespace-pre-wrap text-sm border-y mt-2 bg-muted/20 px-4 rounded-md min-h-[150px] max-h-[400px] overflow-y-auto">
              {message.message}
            </div>
            <div className="text-xs text-muted-foreground text-right">
              Received: {message.createdAt.toLocaleString()}
            </div>
          </DialogContent>
        </Dialog>
      )
    },
  },
]

