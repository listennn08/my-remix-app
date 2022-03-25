import { json, redirect } from "remix";
import type { ActionFunction, LoaderFunction } from "remix";
import { getThemeSession } from "~/utils/theme.server";
import { isTheme } from "~/utils/useTheme";

export const action: ActionFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request);
  const requestText = await request.text();
  const form = new URLSearchParams(requestText);
  const theme = form.get("theme");

  if (!isTheme(theme)) {
    return json({
      success: false,
      message: `theme value of ${theme} is not valid theme`,
    });
  }

  themeSession.setTheme(theme);
  return json(
    { success: true },
    { 
      headers: {
        "Set-Cookie": await themeSession.commit(),
      },
    },
  );
}

export const loader: LoaderFunction = async () => redirect("/", { status: 404 })