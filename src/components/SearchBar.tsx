'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useEffect, useState, useCallback } from 'react'

export default function SearchBar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialQuery = searchParams.get('query') || ''
    const [query, setQuery] = useState<string>(initialQuery)

    // Sync query state with URL search params
    useEffect(() => {
        setQuery(searchParams.get('query') || '')
    }, [searchParams])

    // Debounce function to limit request frequency
    const debounce: <T extends (...args: Parameters<T>) => void>(
        func: T,
        delay: number
    ) => ((...args: Parameters<T>) => void) = <T extends (...args: Parameters<T>) => void>(
        func: T,
        delay: number
    ) => {
            let timeoutId: NodeJS.Timeout
            return (...args: Parameters<T>) => {
                clearTimeout(timeoutId)
                timeoutId = setTimeout(() => func(...args), delay)
            }
        }

    // Handle search with debounce
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleSearch = useCallback(
        debounce((value: string) => {
            const newParams = new URLSearchParams(searchParams.toString())
            if (value.trim()) {
                newParams.set('query', value.trim())
            } else {
                newParams.delete('query')
            }
            router.push(`/search?${newParams.toString()}`)
        }, 300),
        [router, searchParams]
    )

    // Update query state and trigger debounced search
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setQuery(value)
        handleSearch(value)
    }

    return (
        <div className="relative mb-6">
            <Input
                type="search"
                name="query"
                placeholder="Search perfumes..."
                value={query}
                onChange={handleChange}
                className="w-full pr-10 bg-white py-5 rounded-2xl"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
        </div>
    )
}