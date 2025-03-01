import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router";
import LoginPage from "./pages/login/index.jsx";
import RegisterPage from "./pages/register/index.jsx";
import { ToastContainer } from "react-toastify";
import AdminLayout from "./components/layouts/adminLayout.jsx";
import ManageProduct from "./pages/admin/manage-product.jsx";
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

// document.getElementById('root')
// 1. Tìm tới root
// 2. Lấy code ở trong App gắn vào root

const router = createBrowserRouter([
  {
    path:"",
    element: <MainLayout/>,
    children: [
      
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
      {path:"/pregnancy-care",
        element: <PregnancyCare/>
    
      },
      {path:"/parenting-education",
        element: <ParentingEducation/>
    
      },
     
    
      // ... 
      {
        path:"/faq",
        element: <FAQ/>
      },
      {
        path: "/membership",
        element: <Membership/>
      },
      
    ]
  },
  {
    path:"/Profile",
    element: <Profile/>
  },
  {path:"/pregnancy-care",
    element: <PregnancyCare/>

  },
  {path:"/parenting-education",
    element: <ParentingEducation/>

  },
 

  // ... 
  {
    path:"/faq",
    element: <FAQ/>
  },
  {
    path: "/membership",
    element: <Membership/>
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
    path: "/homepage",
    element:<HomePage />
  },
  {
    path: "/dashboard",
    element: <AdminLayout/>,
    children:[
      {
        path: "/dashboard/product",
        element: <ManageProduct/>
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
