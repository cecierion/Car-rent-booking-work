"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminHeader } from "@/components/admin-header"
import { AuthGuard } from "@/components/auth-guard"
import { CustomerDetailsModal } from "@/components/admin/customers/customer-details-modal"
import { AddCustomerModal } from "@/components/admin/customers/add-customer-modal"
import { EditCustomerModal } from "@/components/admin/customers/edit-customer-modal"
import { DeleteCustomerDialog } from "@/components/admin/customers/delete-customer-dialog"
import { useData } from "@/lib/data-context"
import type { Customer } from "@/lib/types"
import { Edit, Eye, Trash2, UserPlus } from "lucide-react"

export default function CustomersPage() {
  const { customers, bookings, cars, updateCustomer, deleteCustomer } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Modal states
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Filter customers based on search term and status
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || customer.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Handle view customer details
  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDetailsModalOpen(true)
  }

  // Handle edit customer
  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsEditModalOpen(true)
  }

  // Handle delete customer
  const handleDeleteCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDeleteDialogOpen(true)
  }

  // Handle add customer
  const handleAddCustomer = (customerData: Omit<Customer, "id" | "totalBookings" | "totalSpent" | "bookingIds">) => {
    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      ...customerData,
      totalBookings: 0,
      totalSpent: 0,
      bookingIds: [],
    }
    updateCustomer(newCustomer)
  }

  // Handle save customer
  const handleSaveCustomer = (updatedCustomer: Customer) => {
    updateCustomer(updatedCustomer)
  }

  // Handle delete customer confirmation
  const handleDeleteConfirm = (customerId: string) => {
    deleteCustomer(customerId)
  }

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success"
      case "inactive":
        return "secondary"
      case "blacklisted":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <AdminHeader />
        <div className="container mx-auto p-4 py-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>View and manage your customer accounts</CardDescription>
              </div>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" /> Add New Customer
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="blacklisted">Blacklisted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Bookings</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No customers found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Customer since{" "}
                              {new Date(customer.joinedDate).toLocaleDateString("en-US", { dateStyle: "medium" })}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>{customer.email}</div>
                            <div className="text-sm text-muted-foreground">{customer.phone}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(customer.status)} className="capitalize">
                              {customer.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{customer.totalBookings}</TableCell>
                          <TableCell>${customer.totalSpent}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="icon" onClick={() => handleViewCustomer(customer)}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                              <Button variant="outline" size="icon" onClick={() => handleEditCustomer(customer)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleDeleteCustomer(customer)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Customer Details Modal */}
      <CustomerDetailsModal
        customer={selectedCustomer}
        bookings={bookings}
        cars={cars}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />

      {/* Add Customer Modal */}
      <AddCustomerModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddCustomer} />

      {/* Edit Customer Modal */}
      <EditCustomerModal
        customer={selectedCustomer}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveCustomer}
      />

      {/* Delete Customer Dialog */}
      <DeleteCustomerDialog
        customer={selectedCustomer}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={handleDeleteConfirm}
      />
    </AuthGuard>
  )
}
