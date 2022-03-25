import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "remix";
import GlobalStyle from "~/styles/global.css";
import HeaderStyle from "~/styles/layout/header.css";
import Layout from "~/components/Layout";
import { ThemeProvider, useTheme, NonFlashOfWrongThemeEls } from "~/utils/useTheme";
import { getThemeSession } from "~/utils/theme.server";

import type { LoaderFunction, MetaFunction } from "remix";
import type { Theme } from "~/utils/useTheme";

type LoadData = {
  theme: Theme | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request);

  const data: LoadData = {
    theme: themeSession.getTheme(),
  }

  return data;
}

export const links = () => [
  { rel: "stylesheet", href: "https://fonts.googleapis.com/icon?family=Material+Icons" },
  { rel: "stylesheet", href: GlobalStyle },
  { rel: "stylesheet", href: HeaderStyle },
]

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export function App() {
  const data = useLoaderData<LoadData>();
  const [theme] = useTheme();

  return (
    <html lang="en" data-theme={theme}>
      <head>
        <Meta />
        <Links />
        <NonFlashOfWrongThemeEls ssrTheme={Boolean(data.theme)} />
      </head>
      <body>
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function WithThemeProvider() {
  const data = useLoaderData<LoadData>();
  return (
    <ThemeProvider specifiedTheme={data.theme}>
      <App />
    </ThemeProvider>
  )
}