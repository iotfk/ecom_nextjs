'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { LuSearch } from "react-icons/lu"
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import {
    ADMIN_CUPON_ADD,
    ADMIN_CUPON_SHOW,
    ADMIN_DASHBOARD,
    ADMIN_MEDIA_SHOW,
    ADMIN_CATEGORY_SHOW,
    ADMIN_CATEGORY_ADD,
    ADMIN_PRODUCT_SHOW,
    ADMIN_PRODUCT_ADD,
    ADMIN_PRODUCT_VARIANT_SHOW,
    ADMIN_PRODUCT_VARIANT_ADD,
    ADMIN_USERS_SHOW,
    ADMIN_REVIEW_SHOW,
    ADMIN_ORDERS_SHOW,
    ADMIN_ORDERS_ADD,
} from '@/routes/AdminPanelRoute'



const SearchBar = () => {
    const router = useRouter()
    const [query, setQuery] = useState('')
    const [open, setOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)
    const [mobileVisible, setMobileVisible] = useState(false)
    const containerRef = useRef(null)
    const mobileInputRef = useRef(null)

    const ROUTES = useMemo(() => ([
        { label: 'Dashboard', path: ADMIN_DASHBOARD, keywords: ['home', 'main'] },
        { label: 'Media', path: ADMIN_MEDIA_SHOW, keywords: ['files', 'images', 'assets'] },
        { label: 'Category', path: ADMIN_CATEGORY_SHOW, keywords: ['categories'] },
        { label: 'Add Category', path: ADMIN_CATEGORY_ADD, keywords: ['new category', 'create category'] },
        { label: 'Products', path: ADMIN_PRODUCT_SHOW, keywords: ['product', 'pro', 'items'] },
        { label: 'Add Product', path: ADMIN_PRODUCT_ADD, keywords: ['new product', 'create product'] },
        { label: 'Product Variants', path: ADMIN_PRODUCT_VARIANT_SHOW, keywords: ['variants', 'variant'] },
        { label: 'Add Product Variant', path: ADMIN_PRODUCT_VARIANT_ADD, keywords: ['new variant', 'create variant'] },
        { label: 'Cupons', path: ADMIN_CUPON_SHOW, keywords: ['coupon', 'discount', 'promo'] },
        { label: 'Add Cupon', path: ADMIN_CUPON_ADD, keywords: ['new coupon', 'create coupon', 'discount'] },
        { label: 'Customers', path: ADMIN_USERS_SHOW, keywords: ['user', 'users', 'customer', 'customers', 'client', 'clients'] },
        { label: 'Reviews', path: ADMIN_REVIEW_SHOW, keywords: ['review', 'reviews', 'rating', 'ratings', 'rate', 'stars', 'feedback'] },
        { label: 'Orders', path: ADMIN_ORDERS_SHOW, keywords: ['order', 'orders', 'purchase'] },
        { label: 'Add Order', path: ADMIN_ORDERS_ADD, keywords: ['new order', 'create order'] },
    ]), [])

    const damerauLevenshtein = (a, b) => {
        const al = a.length, bl = b.length
        const dp = Array.from({ length: al + 2 }, () => Array(bl + 2).fill(0))
        const INF = al + bl
        dp[0][0] = INF
        const da = {}
        for (let i = 0; i <= al; i++) dp[i + 1][1] = i
        for (let j = 0; j <= bl; j++) dp[1][j + 1] = j
        for (let i = 1; i <= al; i++) {
            let db = 0
            for (let j = 1; j <= bl; j++) {
                const i1 = da[b[j - 1]] || 0
                const j1 = db
                let cost = 1
                if (a[i - 1] === b[j - 1]) { cost = 0; db = j }
                dp[i + 1][j + 1] = Math.min(
                    dp[i][j] + cost,
                    dp[i + 1][j] + 1,
                    dp[i][j + 1] + 1,
                    dp[i1][j1] + (i - i1 - 1) + 1 + (j - j1 - 1)
                )
            }
            da[a[i - 1]] = i
        }
        return dp[al + 1][bl + 1]
    }

    const isSubsequence = (needle, hay) => {
        let i = 0
        for (let c of hay) if (i < needle.length && needle[i] === c) i++
        return i === needle.length
    }

    const scoreRoute = (r, q) => {
        const terms = [r.label, r.path, ...(r.keywords || [])].map(t => t.toLowerCase())
        if (terms.some(t => t.includes(q))) return 0
        let best = Infinity
        for (const t of terms) {
            const d = damerauLevenshtein(q, t)
            best = Math.min(best, d)
        }
        if (terms.some(t => isSubsequence(q, t))) best = Math.min(best, Math.max(0, Math.floor(q.length / 3)))
        return best
    }

    const results = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return []
        const withScores = ROUTES.map(r => ({ r, s: scoreRoute(r, q) }))
        const threshold = Math.max(2, Math.floor(q.length * 0.4))
        return withScores
            .filter(x => x.s <= threshold)
            .sort((a, b) => a.s - b.s)
            .slice(0, 8)
            .map(x => x.r)
    }, [ROUTES, query])

    useEffect(() => {
        setOpen(results.length > 0 && query.length > 1)
        setActiveIndex(0)
    }, [results.length, query])

    useEffect(() => {
        const onClick = (e) => {
            if (!containerRef.current) return
            if (!containerRef.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', onClick)
        return () => document.removeEventListener('mousedown', onClick)
    }, [])

    useEffect(() => {
        const handler = () => {
            setMobileVisible(true)
            setTimeout(() => mobileInputRef.current?.focus(), 0)
        }
        window.addEventListener('open-admin-search', handler)
        return () => window.removeEventListener('open-admin-search', handler)
    }, [])

    const go = (path) => {
        setOpen(false)
        setMobileVisible(false)
        setQuery('')
        router.push(path)
    }

    const onKeyDown = (e) => {
        if (!open || results.length === 0) return
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveIndex((i) => (i + 1) % results.length)
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveIndex((i) => (i - 1 + results.length) % results.length)
        } else if (e.key === 'Enter') {
            e.preventDefault()
            const item = results[activeIndex]
            if (item) go(item.path)
        } else if (e.key === 'Escape') {
            setOpen(false)
        }
    }

    return (
        <>
        <div ref={containerRef} className="relative hidden md:block md:max-w-md flex-1">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search..."
                className="pl-9 pr-4"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setOpen(results.length > 0 && query.length > 1)}
                onKeyDown={onKeyDown}
            />

            {open && (
                <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
                    <ul className="max-h-64 overflow-auto py-1">
                        {results.map((r, idx) => (
                            <li
                                key={r.path}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => go(r.path)}
                                className={`flex cursor-pointer items-center justify-between px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground ${idx === activeIndex ? 'bg-accent text-accent-foreground' : ''}`}
                            >
                                <span>{r.label}</span>
                                <span className="text-muted-foreground">{r.path}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>

        {/* Mobile overlay with backdrop */}
        <div className={`md:hidden fixed inset-0 z-50 pointer-events-none`}>
            {/* Backdrop with fade, non-interactive when closed */}
            <div
                className={`absolute inset-0 bg-black/30 backdrop-blur-[1px] transition-opacity duration-300 ${mobileVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => { setMobileVisible(false); setOpen(false) }}
            />
            {/* Sliding centered search bar with width constraints and fade */}
            <div className={`absolute top-2 left-1/2 -translate-x-1/2 w-[92vw] max-w-sm rounded-lg bg-background border shadow-md transition-all duration-300 ${mobileVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
                <div className="relative p-3">
                    <LuSearch className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        ref={mobileInputRef}
                        type="search"
                        placeholder="Search..."
                        className="h-10 pl-12 pr-4"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setOpen(results.length > 0 && query.length > 1)}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') { setMobileVisible(false); setOpen(false); return }
                            onKeyDown(e)
                        }}
                    />


                    {open && (
                        <div className="absolute left-3 right-3 top-[calc(100%+4px)] z-50 rounded-md border bg-popover text-popover-foreground shadow-md">
                            <ul className="max-h-64 overflow-auto py-1">
                                {results.map((r, idx) => (
                                    <li
                                        key={r.path}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => { go(r.path); setMobileVisible(false) }}
                                        className={`flex cursor-pointer items-center justify-between px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground ${idx === activeIndex ? 'bg-accent text-accent-foreground' : ''}`}
                                    >
                                        <span>{r.label}</span>
                                        <span className="text-muted-foreground">{r.path}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>
    )
}

export default SearchBar