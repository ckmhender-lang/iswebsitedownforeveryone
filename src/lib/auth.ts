import { cookies } from "next/headers";
import {
  createSession,
  deleteSession,
  findUserByEmail,
  getSessionUser,
  type LocalUser,
} from "@/lib/local-store";

export const SESSION_COOKIE_NAME = "iswd_session";

export type AppSession = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

function toSession(user: LocalUser): AppSession {
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    },
  };
}

export async function auth(): Promise<AppSession | null> {
  const sessionToken = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = getSessionUser(sessionToken);
  return user ? toSession(user) : null;
}

export function createSessionForUser(user: LocalUser): string {
  return createSession(user.id);
}

export function clearSessionToken(token: string | undefined): void {
  deleteSession(token);
}

export function getUserByEmail(email: string): LocalUser | null {
  return findUserByEmail(email);
}
