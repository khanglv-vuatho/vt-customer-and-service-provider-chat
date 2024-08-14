import { Route, Routes } from 'react-router-dom'

import { lazy, Suspense } from 'react'
import { CircularProgress } from '@nextui-org/react'
import HomePage from './pages'

const Redirect = lazy(() => import('./pages/redirect'))
const InvalidPage = lazy(() => import('./pages/invalid'))

const routes = [
  { path: '/', element: <Redirect /> },
  { path: '/chat', element: <HomePage /> },
  { path: '/invalid', element: <InvalidPage /> }
]

// const routes = [
//   { path: '/', element: <HomePage /> },
//   { path: '/invalid', element: <InvalidPage /> }
// ]
// test

function App() {
  return (
    <Suspense
      fallback={
        <div className='flex h-dvh w-full items-center justify-center'>
          <CircularProgress
            classNames={{
              svg: 'h-8 w-8 text-primary-blue'
            }}
          />
        </div>
      }
    >
      <Routes>
        {routes.map(({ path, element }, index) => (
          <Route key={index} path={path} element={element} />
        ))}
      </Routes>
    </Suspense>
  )
}

export default App
