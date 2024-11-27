import { Session } from "next-auth";

export function isAdmin(session: Session) {
  return session?.user?.role === "admin";
}

export function isOperador(session: Session) {
  return session?.user?.role === "operador";
}
