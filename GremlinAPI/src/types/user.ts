export interface User {
    sub: string; // Subject (User ID)
    name: String;
    email: string;
    jti: string;
    iat: number;
    exp: number;
    iss: string;
    aud:string;
}
