import React from "react"
import { IAdminViewModel } from "../viewModels/useAdminViewModel"
import { Admin } from "@/lib/domain/models/AdminModel"
import { Loader } from "lucide-react"

type AdminViewProps = {
  vm: IAdminViewModel
}

const AdminView = ({ vm }: AdminViewProps) => {
  const { admins, loading, error } = vm

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Admins</h1>
      {loading && <Loader className="animate-spin" />}
      {error && <div className="text-red-600">Error: {error}</div>}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {admins.map((admin: Admin, index: number) => (
          <div key={index} className="rounded-lg border bg-card p-4 shadow">
            <h2 className="text-lg font-semibold">{admin.name}</h2>
            <p className="text-sm text-muted-foreground">{admin.email}</p>
            <p className="mt-2 text-xs font-medium text-primary">{admin.role}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminView
