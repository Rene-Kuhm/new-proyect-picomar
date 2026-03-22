import { Search, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getClients } from '@/lib/actions/admin'
import { ClientActions } from '@/components/admin/client-actions'

export const metadata = { title: 'Clientes - Admin' }

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  PENDING: { label: 'Pendiente', variant: 'secondary' },
  APPROVED: { label: 'Aprobado', variant: 'default' },
  BLOCKED: { label: 'Bloqueado', variant: 'destructive' },
}

interface Props {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>
}

export default async function AdminClientsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = Number(params.page) || 1

  const result = await getClients({
    search: params.search,
    status: params.status,
    page,
    limit: 25,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Clientes</h1>
        <p className="text-muted-foreground">{result.total} clientes registrados</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <form className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              placeholder="Buscar por nombre, email o CUIT..."
              defaultValue={params.search}
              className="pl-10"
            />
          </div>
          <Button type="submit" variant="secondary">Buscar</Button>
        </form>
        <div className="flex gap-1">
          <Button variant={!params.status ? 'default' : 'outline'} size="sm" asChild>
            <a href="/admin/clientes">Todos</a>
          </Button>
          <Button variant={params.status === 'PENDING' ? 'default' : 'outline'} size="sm" asChild>
            <a href="/admin/clientes?status=PENDING">Pendientes</a>
          </Button>
          <Button variant={params.status === 'APPROVED' ? 'default' : 'outline'} size="sm" asChild>
            <a href="/admin/clientes?status=APPROVED">Aprobados</a>
          </Button>
          <Button variant={params.status === 'BLOCKED' ? 'default' : 'outline'} size="sm" asChild>
            <a href="/admin/clientes?status=BLOCKED">Bloqueados</a>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>CUIT</TableHead>
              <TableHead>Ciudad</TableHead>
              <TableHead>Zona</TableHead>
              <TableHead className="text-center">Pedidos</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[120px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No se encontraron clientes
                </TableCell>
              </TableRow>
            ) : (
              result.data.map((client) => {
                const cfg = statusConfig[client.status] || statusConfig.PENDING
                return (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{client.businessName}</p>
                        <p className="text-sm text-muted-foreground">{client.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{client.cuit}</TableCell>
                    <TableCell>{client.city}, {client.province}</TableCell>
                    <TableCell>{client.zone?.name || '—'}</TableCell>
                    <TableCell className="text-center">{client._count.orders}</TableCell>
                    <TableCell>
                      <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <ClientActions
                        clientId={client.id}
                        status={client.status}
                      />
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
