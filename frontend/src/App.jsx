import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './componenets/Navbar';
import Footer from './componenets/Footer';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import ProtectedRoute from './componenets/ProtectedRoute';
import Checkout from './pages/Checkout';
import OrderDetail from './pages/OrderDetail';
import OrderList from './pages/OrderList';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPayments from './pages/admin/AdminPayments';
import ScrollToTop from './componenets/ScrollToTop';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800"> */}
        <Navbar />
        {/* <main className="flex-1"> */}
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products/:slug" element={<ProductDetail />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

          <Route path="/orders" element={<ProtectedRoute><OrderList /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />

          <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/payments" element={<ProtectedRoute adminOnly><AdminPayments /></ProtectedRoute>} />
        </Routes>
        {/* </main> */}
        <Footer />
        {/* </div> */}
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;