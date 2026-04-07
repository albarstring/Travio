"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CheckCircle2,
  DollarSign,
  FileText,
  Settings,
  Shield,
  AlertCircle,
  TrendingUp,
  Tag,
  Ticket,
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Users & Instructors",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Courses",
    href: "/admin/courses",
    icon: BookOpen,
  },
  {
    name: "Course Review",
    href: "/admin/courses/review",
    icon: CheckCircle2,
  },
  {
    name: "Review Moderation",
    href: "/admin/reviews",
    icon: AlertCircle,
  },
  {
    name: "Reports & Complaints",
    href: "/admin/reports/complaints",
    icon: FileText,
  },
  {
    name: "Payments",
    href: "/admin/payments",
    icon: DollarSign,
  },
  {
    name: "Analytics",
    href: "/admin/reports",
    icon: TrendingUp,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: Tag,
  },
  {
    name: "Vouchers",
    href: "/admin/vouchers",
    icon: Ticket,
  },
  {
    name: "Audit Log",
    href: "/admin/audit-log",
    icon: FileText,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-16">
      <div className="flex-1 flex flex-col min-h-0 border-r border-border bg-background">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="flex-1 px-3 space-y-1">
            {navigation.map((item) => {
              // Determine active state: exact match or starts with (with exceptions)
              let isActive = pathname === item.href
              
              // For routes that can have child routes, check if pathname starts with href
              // But exclude parent routes when on specific child routes
              if (!isActive && item.href !== "/admin") {
                if (pathname?.startsWith(item.href + "/")) {
                  // Special handling for routes with specific child routes
                  if (item.href === "/admin/courses" && pathname?.startsWith("/admin/courses/review")) {
                    isActive = false
                  } else if (item.href === "/admin/reports" && pathname?.startsWith("/admin/reports/complaints")) {
                    isActive = false
                  } else {
                    isActive = true
                  }
                }
              }
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5",
                      isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-border p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Admin Panel</span>
          </div>
        </div>
      </div>
    </div>
  )
}

