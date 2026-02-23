import { BrowserRouter,Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Product from "./pages/Product" 
import Cart from "./pages/Cart"
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Checkout from "./pages/Checkout";
import CustomerService from "./pages/CustomerService";
import Profile from "./pages/Profile";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AddProduct from "./pages/admin/AddProduct";
import ViewProducts from "./pages/admin/ViewProducts";
import ViewUsers from "./pages/admin/ViewUsers";
import ViewOrders from "./pages/admin/ViewOrders";
import ViewReports from "./pages/admin/Reports";
import NotificationsPage from "./pages/admin/NotificationsPage";  
import { Toaster } from "react-hot-toast";
import CategoryPage from "./pages/admin/CategoryPage";

function App() {
  return (
    <>
          <Toaster position="top-right" reverseOrder={false} />
    
    <BrowserRouter>
      <div >
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/customer-service" element={<CustomerService />} />
        {/* <Route path="/adminproduct" element={<AdminProducts />} /> */}
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/admin" element={<AdminLayout />}>

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="products" element={<ViewProducts />} />
          <Route path="users" element={<ViewUsers />} />
          <Route path="orders" element={<ViewOrders />} />
          <Route path="reports" element={<ViewReports />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="/admin/categories" element={<CategoryPage />} />


        </Route>

      </Routes>
      </div>
      
    </BrowserRouter>
  </>
  )
}

export default App
