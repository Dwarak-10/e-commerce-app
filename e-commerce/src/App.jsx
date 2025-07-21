import Body from "./components/Body";
import LoginForm from "./components/LoginForm"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./utlis/appStore";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

function App() {
  const queryClient = new QueryClient()

  return (
    <>
      <Provider store={appStore}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter basename="/" >
            <Routes>
              <Route path="/" element={<Body />}>
                <Route path="/" element={<LoginForm />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </>
  )
}

export default App
