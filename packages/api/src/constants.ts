// our super secret key
export const SECRET_KEY = 'gandalf';
export const PORT = 3000;

/** How long a login lasts. Override with `TOKEN_TTL=30s` if you need to test expiry. */
export const TOKEN_TTL = process.env.TOKEN_TTL || '1h';
