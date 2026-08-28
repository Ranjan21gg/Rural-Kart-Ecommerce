import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';
import { fetchCart } from '../services/cart.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setCartCount(0);
      return;
    }
    try {
      const res = await fetchCart();
      const items = res.data?.items || [];
      const totalCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(totalCount);
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        refreshCartCount();
      } catch {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, [refreshCartCount]);

  const login = async (username, password) => {
    const res = await api.post('/auth/login/', {
      username,
      password,
    });

    // Save JWT tokens
    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);

    // Get complete authenticated user data
    const userRes = await api.get('/auth/me/');
    const userData = userRes.data;

    // Save user data
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    // Refresh cart count
    await refreshCartCount();

    return userData;
  };

  
  const register = async (username, email, password) => {
    await api.post('/auth/register/', { username, email, password });
    return login(username, password);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    setCartCount(0);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, cartCount, refreshCartCount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}