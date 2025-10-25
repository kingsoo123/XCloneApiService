import { registerAs } from "@nestjs/config";

export default registerAs('auth',()=>({
    secret:process.env.JWT_TOKEN_SECRET || 'some-secret-string-value',
    expiresIn:parseInt(process.env.JWT_TOKEN_EXPIRESIN ?? '3600', 10),
    refreshToeknExpiresIn:parseInt(process.env.REFRESH_TOKEN_EXPIRESIN ?? '36400', 10),
    audience:process.env.JWT_TOKEN_AUDIENCE || 'https://nestjs-api.onrender.com',
    issuer:process.env.JWT_TOKEN_ISSUER || 'https://nestjs-api.onrender.com'
}))