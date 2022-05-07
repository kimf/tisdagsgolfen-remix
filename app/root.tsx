import type { MetaFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { createTheme, CssBaseline, NextUIProvider } from '@nextui-org/react';
import useDarkMode from '@fisch0920/use-dark-mode';

import IndexCss from '~/styles/index.css';

const lightTheme = createTheme({
  type: 'light',
  theme: {
    fonts: {
      sans: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto','Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;",
    },
  },
});

const darkTheme = createTheme({
  type: 'dark',
  theme: {
    fonts: {
      sans: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto','Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;",
    },
  },
});

export const links = () => {
  return [
    {
      rel: 'stylesheet',
      href: IndexCss,
    },
  ];
};

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Tisdagsgolfen',
  viewport: 'width=device-width,initial-scale=1',
});

export default function App() {
  const darkMode = useDarkMode(false);

  return (
    <html lang="sv">
      <head>
        <Meta />
        {CssBaseline.flush()}
        <Links />
      </head>
      <body>
        <NextUIProvider theme={darkMode.value ? darkTheme : lightTheme}>
          <div className="page-content">
            <Outlet />
          </div>
        </NextUIProvider>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
