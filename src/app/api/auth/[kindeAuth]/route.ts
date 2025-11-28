import {handleAuth} from "@kinde-oss/kinde-auth-nextjs/server";

export const GET = handleAuth();

/***
 * GET /api/auth/login 
 * GET /api/auth/logout
 * GET /api/auth/register
 * GET /api/auth/kinde_callback
 */