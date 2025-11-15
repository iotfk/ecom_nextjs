import { NextResponse } from "next/server"
import { USER_DASHBOARD, WEBSITE_HOME, WEBSITE_LOGIN } from "./routes/WebsiteRoute"
import { jwtVerify } from "jose"
import { ADMIN_DASHBOARD } from "./routes/AdminPanelRoute"

export async function proxy(request) {
    try {
        const pathname = request.nextUrl.pathname
        const access_token = request.cookies.get('access_token')

        // ✅ Check if route requires authentication
        
        const isBaseRoute = pathname === WEBSITE_HOME
        const isAuthRoute = pathname.startsWith('/auth')
        const isAdminRoute = pathname.startsWith('/admin')
        const isUserRoute = pathname.startsWith('/my-account')
        const isProtectedRoute = isAdminRoute || isUserRoute

      

        // ✅ If no token and trying to access protected route
        if (!access_token && isProtectedRoute) {
            return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl))
        }

        // ✅ If no token and on auth page, allow through
        if (!access_token && isAuthRoute) {
            return NextResponse.next()
        }

        // ✅ If no token and not on protected/auth route, allow through
        if (!access_token) {
            return NextResponse.next()
        }

        // ✅ Verify JWT token
        let payload
        try {
            const secret = new TextEncoder().encode(process.env.SECRET_KEY)
            const verified = await jwtVerify(access_token.value, secret)
            payload = verified.payload
        } catch (jwtError) {
            // ✅ Invalid token - clear cookie and redirect to login
            const response = NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl))
            response.cookies.delete('access_token')
            return response
        }

        // ✅ Check if token has required fields
        if (!payload.role || !payload._id) {
            const response = NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl))
            response.cookies.delete('access_token')
            return response
        }

        const role = payload.role

        // ✅ Prevent logged-in users from accessing auth routes
        if (isAuthRoute) {
            const redirectUrl = role === 'admin' ? ADMIN_DASHBOARD : USER_DASHBOARD
            return NextResponse.redirect(new URL(redirectUrl, request.nextUrl))
        }

        // ✅ Protected admin routes - only admin can access
        if (isAdminRoute) {
            if (role !== 'admin') {
                return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl))
            }
            return NextResponse.next()
        }

        // ✅ Protected user routes - only regular users can access
        if (isUserRoute) {
            if (role !== 'user') {
                return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl))
            }
            return NextResponse.next()
        }

        // ✅ Allow through if no restrictions
        return NextResponse.next()

    } catch (error) {
        console.error('Middleware error:', error)
        // ✅ On any error, clear token and redirect
        const response = NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl))
        response.cookies.delete('access_token')
        return response
    }
}

export const config = {
    matcher: [
        '/',
        '/admin/:path*',
        '/my-account/:path*',
        '/auth/:path*',
    ],
}
