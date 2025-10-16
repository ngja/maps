import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { APIProvider } from '@vis.gl/react-google-maps'

import Header from '../components/Header'

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

export const Route = createRootRoute({
  component: () => (
    <APIProvider apiKey={apiKey}>
      <Header />
      <Outlet />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </APIProvider>
  ),
})
