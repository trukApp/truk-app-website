import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const { url } = req;

    // Skip middleware for login or public paths
    if (url.includes('/login') || url.includes('/public')) {
        return NextResponse.next();
    }

    // If there is no token, redirect to the login page with the current URL as callback
    if (!token) {
        const loginUrl = new URL('/login', url); // Redirect to the login page
        loginUrl.searchParams.set('callbackUrl', url); // Include the current URL as callback
        return NextResponse.redirect(loginUrl);
    }

    // If there is a token, allow the request to continue
    return NextResponse.next();
}

 
export const config = {
    matcher: ['/createorder'], // Add more paths as needed
};
