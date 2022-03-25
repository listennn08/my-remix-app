import { createCookieSessionStorage } from "remix";
import { Theme, isTheme } from "./useTheme";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) throw new Error("SESSION_SECRET must be set")

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: "theme",
    secure: true,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

export async function getThemeSession(request: Request) {
  const session = await themeStorage.getSession(request.headers.get("Cookie"));

  return {
    getTheme: () => {
      const themeValue = session.get("theme");
      return isTheme(themeValue) ? themeValue : null;
    },
    setTheme: (theme: Theme) => session.set("theme", theme),
    commit: () => themeStorage.commitSession(session)
  }
}