import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from './CartContext'; // Import CartProvider
import HomePage from './HomePage';
import Register from './Register';
import Login from './Login';
import Search from './Search';  // Ensure this matches the actual file name
// import Home2 from './Home2';
import FavoritesPage from './FavoritesPage';
import UserDashBoard from './UserDashBoard';
import AdminDashboard from './AdminDashboard';
// import Books from './Books';
// import Users from './Users';
import ManageBooks from './ManageBooks';
import SearchBooks from'./SearchBooks';
import CartPage from './CartPage';
import OrdersPage from './OrdersPage';

const App = () => {
  return (
    <CartProvider> {/* Wrap Routes with CartProvider */}
<Router future={{ v7_startTransition: true }}>
<Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/home2" element={<Home2 />} /> */}
          <Route path="/favorites" element={<FavoritesPage/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/Search" element={<Search/>} />
          <Route path="/UserDashBoard" element={<UserDashBoard/>} />
          <Route path="/AdminDashboard" element={<AdminDashboard/>}/>
          {/* <Route path="/Books" element={<Books/>}/> */}
          {/* <Route path="/Users" element={<Users/>}/> */}
          <Route path="/ManageBooks" element={<ManageBooks/>}/>
          <Route path="/SearchBooks" element={<SearchBooks/>}/>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/vieworders" element={<OrdersPage/>}/>
           
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
