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
import AddVendor from "./pages/AddVendor";
import VendorList from "./pages/VendorList";
import { SnackbarProvider } from "notistack";
import RoleGuard from "./components/RoleGaurd";
import VendorAnalytics from "./pages/VendorAnalytics";

function App() {
  const queryClient = new QueryClient()

  return (
    <>
      <Provider store={appStore}>
        <QueryClientProvider client={queryClient}>
          <SnackbarProvider maxSnack={3} autoHideDuration={2000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <BrowserRouter basename="/" >
              <Routes>
                <Route path="/" element={<Body />}>
                  <Route path="/" element={<LoginForm />} />
                  <Route path="/admin" element={
                    // <RoleGuard allowedRoles={["admin"]}>
                    <AdminDashboard />
                    // </RoleGuard>
                  } />
                  <Route path="/admin/vendor/:vendorId" element={<VendorProducts />} />
                  <Route path="/vendor" element={<VendorDashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/feed" element={<Feed />} />
                  <Route path="/products/:id" element={<ProductView />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/vendor/add-product" element={<AddProductPage />} />
                  <Route path="/admin/add-vendor" element={<AddVendor />} />
                  <Route path="/admin/vendor-list" element={<VendorList />} />
                  <Route path="/admin/vendor/:id/analytics" element={<VendorAnalytics />} />

                </Route>
              </Routes>
            </BrowserRouter>
          </SnackbarProvider>
        </QueryClientProvider>
      </Provider>
    </>
  )
}

export default App

