import React, { useEffect, useState } from "react"
import Home from "./components/Home";
import Login from "./Login"
import Shoes from "./components/Shoes.js";
import Men from "./components/Men.js";
import Women from "./components/Women.js";
import Kids from "./components/Kids.js";
import ProductDescription from "./pages/ProductDescription";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Signup from "./Signup";
import Footer from "./components/Footer";
import { data } from "./JsonData/data";
import Search from "./components/Search";
import ScrollToTop from "./ScrollToTop";
import { auth, onAuthStateChanged } from "./firebase";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { selectUser } from './features/userSlice';
import { login, logout } from './features/userSlice';
import Profile from "./components/Profile";

function App() {

  const [searchfield, setsearchfield] = useState("");

  const onSearchChange = (e) => {
    setsearchfield(e.target.value)
  };
  const filtereditems = data.filter((data) => {
    return (searchfield ? data.title
      .toLowerCase()
      .includes(searchfield.toLowerCase()) :
      {})
  });

  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User logged in");
        dispatch(login({
          uid: user.uid,
          email: user.email,
          name: user.displayName
        }))
      } else {
        // User is signed out
        // ...
        dispatch(logout());
        console.log("User logged out");
      }
    });
    return unsubscribe;
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar searchChange={onSearchChange} />
      <Routes>
        {!searchfield ? <Route path="/" element={<Home />} /> : <Route path="/" element={<Search data={filtereditems} />} />}
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/shoes" element={<Shoes data={filtereditems} />} />
        <Route path="/men" element={<Men data={filtereditems} />} />
        <Route path="/women" element={<Women data={filtereditems} />} />
        <Route path="/kids" element={<Kids data={filtereditems} />} />
        <Route path="/product/:id" element={<ProductDescription />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
