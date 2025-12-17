import { jwtDecode } from "jwt-decode";

export interface TokenPayload {
  name: string;
  phone: string;
  roles: string[];
  iat: number;
  exp: number;
}

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);

    const now = Date.now() / 1000;
    if (decoded.exp && decoded.exp < now) {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return null;
  }
};

export const getRedirectPath = (roles: string[]): string => {
  if (roles.includes("manager")) {
    return "/gerente";
  }
  if (roles.includes("barber")) {
    return "/barbeiro";
  }
  if (roles.includes("client")) {
    return "/cliente";
  }
  return "/unauthorized";
};
