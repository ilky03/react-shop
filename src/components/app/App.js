import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import AppProvider from '../context/AppProvider';
import Header from '../header/Header';
import MainPage from "../pages/MainPage";
import CategoryPage from "../pages/CategoryPage";
import ProductPage from "../pages/ProductPage";
import Footer from "../footer/Footer";

function App() {

  return (
    <>
      <Router>
        <AppProvider>
        <Header />
        <HelmetProvider>
            <Routes>
                <Route path='/' element={<MainPage />} />
                <Route path='/category/:categoryId' element={<CategoryPage />} />
                <Route path='/product/:productID' element={<ProductPage />} />
            </Routes>
        </HelmetProvider>
        </AppProvider>
        <Footer />
      </Router>
    </>
  );
}

export default App;
