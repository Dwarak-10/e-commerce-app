import Body from "./components/Body";
import LoginForm from "./pages/LoginForm"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./utlis/appStore";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AdminDashboard from "./pages/AdminDashboard";
import VendorProducts from "./components/VendorProducts";
import VendorDashboard from "./pages/VendorDashboard";
import Profile from "./pages/Profile";
import Feed from "./pages/Feed";
import ProductView from "./pages/ProdcutView";
import CartPage from "./pages/CartPage";
import AddProductPage from "./pages/AddProductPage";

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
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/vendor/:vendorId" element={<VendorProducts />} />
                <Route path="/vendor" element={<VendorDashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/products/:id" element={<ProductView />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/vendor/add-product" element={<AddProductPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </>
  )
}

export default App
