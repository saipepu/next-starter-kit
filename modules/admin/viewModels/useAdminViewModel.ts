import { DefaultApiResponse, getRequest } from "@/lib/domain/api/NetworkManager";
import { Admin } from "@/lib/domain/models/AdminModel";
import { useEffect, useState } from "react";

export interface IAdminViewModel {
  admins: Admin[]
  loading: boolean
  error: string | null
  fetchAdmins: () => Promise<void>
}

export const useAdminViewModel = (): IAdminViewModel => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await getRequest<DefaultApiResponse>("/admins");
      if (!response.success) {
        throw new Error("Failed to fetch admins");
      }
      setAdmins(response.message.admins);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
      setError("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAdmins();
  }, [])

  return {
    admins,
    loading,
    error,
    fetchAdmins,
  }
  
}