import { Session } from "next-auth";

export function isAdmin(session: Session) {
  return session?.user?.role === "admin";
}

export function isOperador(session: Session) {
  return session?.user?.role === "operador";
}

export function isConsultor(session: Session) {
  return session?.user?.role === "consultor";
}

export function isUser(session: Session) {
  return session?.user?.role === "user";
}
