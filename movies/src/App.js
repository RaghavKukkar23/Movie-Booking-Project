import { Route, Routes } from "react-router-dom";
import Header from "./components/Header.js";
import HomePage from "./components/HomePage.js";
import Movies from "./components/Movies/Movies.js";
import Admin from "./components/Admin/Admin.js";
import Auth from "./components/Auth/Auth.js"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { adminActions, userActions } from "./store/index.js";
import Booking from "./components/Bookings/Booking.js";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import the toastify CSS
import UserProfile from "./Profile/UserProfile.js";
import Payment from "./components/Payment.js";
import Confirmation from "./components/Confirmation.js";
import AdminProfile from "./Profile/AdminProfile.js";
import AddMovie from "./components/Movies/AddMovie.js";
import AddShow from "./components/Shows/AddShow.js";

function App() {
  const dispatch = useDispatch();
  
  const isAdminLoggedIn = useSelector((state)=>state.admin.isLoggedIn);
  const isUserLoggedIn = useSelector((state)=>state.user.isLoggedIn);

  console.log("isAdminLoggedIn",isAdminLoggedIn);
  console.log("isUserLoggedIn",isUserLoggedIn);

  useEffect(() => {
    if(localStorage.getItem("userId")){
      dispatch(userActions.login());
    }
    else if(localStorage.getItem("adminId")){
      dispatch(adminActions.login());
    }
  });

  return (
    <div>
    <Header/>
    <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
    <section>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/user" element={<UserProfile />} />
        <Route path="/user-admin" element={<AdminProfile />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/addMovie" element={<AddMovie />} />
        <Route path="/addShow" element={<AddShow />} />
        <Route path="/payment/:amount" element={<Payment />} />
        <Route path="/confirmation/" element={<Confirmation />} />
      </Routes>
    </section>
    </div>
  );
}

export default App;
