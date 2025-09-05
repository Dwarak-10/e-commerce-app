import Body from "./components/Body";
import LoginForm from "./pages/LoginForm"
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./utlis/appStore";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AdminDashboard from "./pages/AdminDashboard";
import VendorProducts from "./components/VendorProducts";
import VendorDashboard from "./pages/VendorDashboard";
import Profile from "./pages/Profile";
import HomePage from "./pages/HomePage";
import ProductView from "./pages/ProdcutView";
import CartPage from "./pages/CartPage";
import AddProductPage from "./pages/AddProductPage";
import AddVendor from "./pages/AddVendor";
import VendorList from "./pages/VendorList";
import { SnackbarProvider } from "notistack";
import RoleGuard from "./components/RoleGaurd";
import VendorAnalytics from "./pages/VendorAnalytics";
import EditProduct from "./pages/EditProduct";
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from './utlis/appStore'
import MyProducts from "./pages/MyProducts";
import RoleRedirect from "./components/RoleRedirect";
import VendorOrders from "./pages/VendorOrders";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";
import WebSocketListener from "./components/WebSocketListener";

function App() {
  const queryClient = new QueryClient()

  return (
    <>
      <Provider store={appStore}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <SnackbarProvider maxSnack={3} autoHideDuration={2000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
              <BrowserRouter basename="/" >
               <WebSocketListener /> 
                <Routes>
                  <Route path="/" element={<Body />}>

                    <Route path="/" element={<RoleRedirect />} />
                    <Route path="/login" element={<LoginForm />} />

                    <Route path="/admin" element={
                      <RoleGuard allowedRoles={["admin"]}>
                        <Outlet />
                      </RoleGuard>
                    } >
                      <Route index element={<AdminDashboard />} />
                      <Route path="/admin/vendor/:vendorId" element={<VendorProducts />} />
                      <Route path="/admin/add-vendor" element={<AddVendor />} />
                      <Route path="/admin/vendor-list" element={<VendorList />} />
                      <Route path="/admin/vendor/:id/analytics" element={<VendorAnalytics />} />
                      <Route path="/admin/vendor/:vendorId" element={<VendorProducts />} />
                      <Route path="/admin/my-orders" element={<AdminOrders />} />
                      <Route path="/admin/my-customers" element={<AdminUsers />} />

                    </Route>

                    <Route path="/vendor" element={
                      <RoleGuard allowedRoles={["vendor"]}>
                        <Outlet />
                      </RoleGuard>
                    } >
                      <Route index element={<VendorDashboard />} />
                      <Route path="/vendor/add-product" element={<AddProductPage />} />
                      <Route path="/vendor/products/:id/edit" element={<EditProduct />} />
                      <Route path="/vendor/my-orders" element={<VendorOrders />} />
                      <Route path="/vendor/my-products" element={<MyProducts />} />

                    </Route>

                    <Route element={<RoleGuard allowedRoles={["customer"]} >
                      <Outlet />
                    </RoleGuard>}>
                      <Route path="/home" element={<HomePage />} />
                      <Route path="/cart" element={<CartPage />} />
                    </Route>


                    <Route element={<RoleGuard allowedRoles={["admin", "vendor", "customer"]} >
                      <Outlet />
                    </RoleGuard>}>
                      <Route path="/products/:id" element={<ProductView />} />
                      <Route path="/profile" element={<Profile />} />
                    </Route>
                  </Route>
                </Routes>
              </BrowserRouter>
            </SnackbarProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </>
  )
}

export default App

