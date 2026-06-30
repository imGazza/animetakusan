import { RouterProvider } from 'react-router';
import './App.css'
import { routes } from './router/routes';
import RootErrorFallback from './features/error/RootErrorFallback';

function App() {
  return (
    <RootErrorFallback>
      <RouterProvider router={routes} />
    </RootErrorFallback>
  )
}

export default App
