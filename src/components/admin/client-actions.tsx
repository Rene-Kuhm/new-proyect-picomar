'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { approveClient, blockClient } from '@/lib/actions/admin'
import { useRouter } from 'next/navigation'

interface ClientActionsProps {
  clientId: string
  status: string
}

export function ClientActions({ clientId, status }: ClientActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleApprove() {
    setIsLoading(true)
    const result = await approveClient(clientId)
    if (result.success) {
      toast.success('Cliente aprobado')
      router.refresh()
    } else {
      toast.error(result.error)
    }
    setIsLoading(false)
  }

  async function handleBlock() {
    setIsLoading(true)
    const result = await blockClient(clientId)
    if (result.success) {
      toast.success('Cliente bloqueado')
      router.refresh()
    } else {
      toast.error(result.error)
    }
    setIsLoading(false)
  }

  return (
    <div className="flex gap-1">
      {status !== 'APPROVED' && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleApprove}
          disabled={isLoading}
          title="Aprobar"
        >
          <CheckCircle className="h-4 w-4 text-green-600" />
        </Button>
      )}
      {status !== 'BLOCKED' && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBlock}
          disabled={isLoading}
          title="Bloquear"
        >
          <XCircle className="h-4 w-4 text-red-600" />
        </Button>
      )}
    </div>
  )
}
