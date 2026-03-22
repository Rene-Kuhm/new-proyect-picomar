'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useCallback, useState } from 'react'

interface SearchBarProps {
  defaultValue?: string
}

export function SearchBar({ defaultValue = '' }: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(defaultValue)

  const handleSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (term) {
        params.set('search', term)
      } else {
        params.delete('search')
      }
      params.delete('page')
      router.push(`/catalogo?${params.toString()}`)
    },
    [router, searchParams]
  )

  return (
    <div className="relative flex-1 w-full sm:max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar productos..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSearch(value)
        }}
        className="pl-10 h-9 sm:h-10 text-sm"
      />
    </div>
  )
}
