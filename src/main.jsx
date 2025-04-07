import React from 'react';
import ReactDOM from 'react-dom/client';
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
import PregnancyProfileManager from "./pages/profiles/PregnancyProfile.jsx";
import BlogManagement from "./pages/admin/BlogManagement.jsx";
import Blog from "./pages/blog/Blog.jsx";
import ForgotPassword from "./pages/login/ForgotPassword.jsx";
import ChangePassword from "./pages/profiles/ChangePassword.jsx";
import Payment from "./pages/membership/Payment.jsx";
import PaymentSuccess from "./pages/membership/PaymentSuccess.jsx";
import PaymentCancel from "./pages/membership/PaymentCancel.jsx";
import BlogDetail from "./pages/blog/BlogDetail.jsx";
import GrowthUpdate from "./pages/growth/GrowthUpdate.jsx";
import WeightGainChart from "./pages/growth/WeightGainChart.jsx";
import OrderManagement from "./pages/admin/OrderManagement.jsx";
import RemindersPage from "./pages/reminders/RemindersPage.jsx";
import CommentManagement from "./pages/admin/CommentManagement.jsx";
import Transaction from "./pages/transactions/Transaction.jsx";
import Contact from './components/Footer/Contact.jsx';
import PrivacyPolicy from './components/Footer/PrivacyPolicy.jsx';
import TermsOfService from './components/Footer/TermsOfService.jsx';

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
        path: "/blog-detail/:id",
        element: <BlogDetail/>,
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
        element: <PregnancyProfileManager/>
      },
      {
        path:"/Profile/pregnancy-profile/:id",
        element: <PregnancyProfileManager/>
      },
      {path:"/pregnancy-care",
        element: <PregnancyCare/>
    
      },
      {path:"/parenting-education",
        element: <ParentingEducation/>
    
      },
     
      {
        path: "/payment",
        element: <Payment/>
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
        path: "growth-records/weight-chart/",
        element: <WeightGainChart />
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
      {
        path: "/reminders",
        element: <RemindersPage/>
      },
      {
        path: "/reminders/:id",
        element: <RemindersPage/>
      },
    {
      path: "/payment/success/:orderId",
      element: <PaymentSuccess/>
    },
    {
      path: "/payment/cancel/:orderId",
      element: <PaymentCancel/>
    },
   
    {
      path: "/transactions",
      element: <Transaction/>
    },
    {
      path: "/contact",
      element: <Contact/>
    },
    {
      path: "/privacy-policy",
      element: <PrivacyPolicy/>
    },
    {
      path: "/terms-of-service",
      element: <TermsOfService/>
    }
    
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
        {
          path: '/dashboard/comment',
          element: <CommentManagement />,
        },
      

    ]
  },

]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
        <ToastContainer/>
    </React.StrictMode>
);

// Single Page Application
// client side rendering
// SEO
