import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  name: string;
  phone: string;
  roles: string[];
}

interface DecodedJwt {
  name: string;
  phone: string;
  roles: string[];
  iat: number;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const createFakeToken = (
  role: string,
  expiresInMs: number = 3600 * 1000 // 1 hora
): string => {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const exp = now + expiresInMs / 1000;

  const payload: DecodedJwt = {
    iat: now,
    exp: exp,
    name: "Vinicius",
    phone: "16997008655",
    roles: [role],
  };
  const encode = (data: object) =>
    btoa(JSON.stringify(data))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

  return `${encode(header)}.${encode(payload)}.fakesignature`;
};

const isValidToken = (token: string): User | null => {
  try {
    const decoded = jwtDecode<DecodedJwt>(token);

    if (decoded.exp * 1000 < Date.now()) {
      console.warn("Token expirado.");
      return null;
    }

    return {
      name: decoded.name,
      phone: decoded.phone,
      roles: decoded.roles,
    };
  } catch (error) {
    console.error("Token inválido:", error);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("authToken");
  }, []);

  const login = (token: string) => {
    const userData = isValidToken(token);
    if (userData) {
      localStorage.setItem("authToken", token);
      setUser(userData);
    } else {
      logout();
    }
  };

  useEffect(() => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        const userData = isValidToken(token);
        if (userData) {
          setUser(userData);
        } else {
          localStorage.removeItem("authToken");
        }
      }
    } catch (error) {
      console.error("Falha ao carregar autenticação:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "authToken") {
        if (event.newValue === null) {
          setUser(null);
        } else {
          const userData = isValidToken(event.newValue);
          setUser(userData);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

// --- Exportando o helper de simulação ---
// eslint-disable-next-line react-refresh/only-export-components
export { createFakeToken, isValidToken };
