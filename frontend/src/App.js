import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from './Components/userContext';
import Header from "./Components/Header";
import FeatureSection from "./Components/FeatureSection";
import Testimonials from "./Components/Testimonials";
import Footer from "./Components/Footer";
import Partnership from "./Components/PartnershipSection";
import BecomeDasher from "./Components/BecomeDasher";
import BecomeMerchant from "./Components/BecomeMerchant";
import UseMobileApp from "./Components/UseMobileApp";
import HomePage from "./Components/HomePage";
import MerchantHome from "./Components/MerchantHome";
import Menu from "./Components/Menu";
import Profile from "./Components/Profile";
import Sidebar from "./Components/Sidebar";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import Transaction from "./Components/Transaction"; // Transaction component
import Cart from "./Components/Cart"; // Cart component
import Help from "./Components/Help"; // Help component
import "./Styles/App.css";

const App = () => {
  const location = useLocation();

  // Define routes that require the Sidebar, excluding MerchantHome
  const routesWithSidebar = [
    "/home-page",
    "/menu",
    "/account",
    "/wallet",
    "/cart",
  ];

  const showSidebar = routesWithSidebar.includes(location.pathname);

  return (
    <div className="App">
      {location.pathname === "/" && <Header />}

      <div className="main-container" style={{ display: 'flex', width: '100%' }}>
        {showSidebar && <Sidebar />} {/* Render Sidebar for specific routes */}

        <div className="content" style={{ flexGrow: 1, overflowX: 'hidden' }}> {/* Wrap routes in a content div */}
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <FeatureSection />
                  <Partnership />
                  <Testimonials />
                  <Footer />
                </>
              }
            />
            <Route path="/become-dasher" element={<BecomeDasher />} />
            <Route path="/become-merchant" element={<BecomeMerchant />} />
            <Route path="/use-mobile-app" element={<UseMobileApp />} />

            {/* Protected Routes */}
            <Route
              path="/home-page"
              element={
                <ProtectedRoutes allowedRoles={['Merchant', 'User']}>
                  <HomePage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/merchanthome"
              element={
                <ProtectedRoutes allowedRoles={['Merchant']}>
                  <MerchantHome /> {/* Sidebar is included here */}
                </ProtectedRoutes>
              }
            />
            <Route
              path="/menu"
              element={
                <ProtectedRoutes>
                  <Menu />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoutes allowedRoles={['User']}>
                  <Profile />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/wallet"
              element={
                <ProtectedRoutes allowedRoles={['User']}>
                  <Transaction />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoutes allowedRoles={['User']}>
                  <Cart />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/help"
              element={<Help />}
            />
          </Routes>
        </div> {/* End content div */}
      </div>
    </div>
  );
};

const WrappedApp = () => (
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
);

export default WrappedApp;