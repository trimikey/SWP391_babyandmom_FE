import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router";
import LoginPage from "./pages/login/index.jsx";
import RegisterPage from "./pages/register/index.jsx";
import { ToastContainer } from "react-toastify";
import AdminLayout from "./components/layout/adminLayout.jsx";
import ManageUser from "./pages/admin/manage-user.jsx";
import HomePage from "./pages/homepage/homepage.jsx";
import FAQ from "./pages/faq/faq.jsx"
import Membership from "./pages/membership/Membership.jsx"
import PregnancyCare from "./pages/homepage/pregnancy-care.jsx"
import ParentingEducation from "./pages/homepage/parenting-education.jsx"
import Profile from "./pages/profiles/Profile.jsx";
import FAQManagement from './pages/admin/FAQManagement.jsx';
import MembershipPackages from './pages/admin/MembershipPackages.jsx';
import MainLayout from "./components/layout/MainLayout.jsx";
import PregnancyProfile from "./pages/profiles/PregnancyProfile.jsx";
import BlogManagement from "./pages/admin/BlogManagement.jsx";
import Blog from "./pages/blog/Blog.jsx";
import ForgotPassword from "./pages/login/ForgotPassword.jsx";
import ChangePassword from "./pages/profiles/ChangePassword.jsx";
import PaymentCallback from "./pages/membership/PaymentCallback.jsx";
import Payment from "./pages/membership/Payment.jsx";
import BlogDetail from "./pages/blog/BlogDetail.jsx";
import GrowthUpdate from "./pages/growth/GrowthUpdate.jsx";
import OrderManagement from "./pages/admin/OrderManagement.jsx";
// document.getElementById('root')
// 1. Tìm tới root
// 2. Lấy code ở trong App gắn vào root

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/blog",
        element: <Blog/>,
      },
      {
        path: "/",
        element: <HomePage/>,
      },
      {
        path:"/Profile",
        element: <Profile/>
      },
      {
        path:"/Profile/pregnancy-profile",
        element: <PregnancyProfile/>
      },
      {
        path:"/Profile/pregnancy-profile/:id",
        element: <PregnancyProfile/>
      },
      {path:"/pregnancy-care",
        element: <PregnancyCare/>
    
      },
      {path:"/parenting-education",
        element: <ParentingEducation/>
    
      },
      {
        path: "/payment-callback",
        element: <PaymentCallback/>
      },
      {
        path: "/payment",
        element: <Payment/>
      },
      {
        path: "/blog-detail/:id",
        element: <BlogDetail/>
      },
      {
        path: "growth-records/profile/",
        element: <GrowthUpdate />
      },
      {
        path: "growth-records/profile/:id",
        element: <GrowthUpdate />
      },
     
      {
        path:"/faq",
        element: <FAQ/>
      },
      {
        path: "/membership",
        element: <Membership/>
      },
      {
        path: "/change-password",
        element: <ChangePassword/>
      },
    ]
  },

  {
    path: "/forgot-password",
    element: <ForgotPassword/>
  },

  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  
  {
    path: "/dashboard",
    element: <AdminLayout/>,
    children:[
      {
        path: "/dashboard/order",
        element: <OrderManagement/>
      },
      
      {
        path: "/dashboard/user",
        element: <ManageUser/>
      },
      {
        path: '/dashboard/faq',
        element: <FAQManagement />,
      },
        {
          path: '/dashboard/membership',
          element: <MembershipPackages />,
        },
        {
          path: '/dashboard/blog',
          element: <BlogManagement />,
        },
      

    ]
  },

]);

createRoot(document.getElementById("root")).render(
  <>
    <RouterProvider router={router} />
    <ToastContainer/>
  </>
);

// Single Page Application
// client side rendering
// SEO
