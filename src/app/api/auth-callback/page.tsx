"use client"

import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { getAuthStatus } from "./actions"

export default function Page() {
  const [configId, setConfigId ] = useState<string| null>(null)

  useEffect(() => {
    const configId = localStorage.getItem("configurationId")
    if(configId) {
      setConfigId(configId)
    }
  }, [])

  const  { } = useQuery({
    queryKey: ["auth-callback"],
    queryFn: async () => {
      await getAuthStatus()
    },
  })

  return (
    <div>
      <h1>Auth Callback</h1>
      <p>
        This page is used to handle the authentication callback from the
        authentication provider.
      </p>
    </div>
  )
}