import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import AppProvider from '../context/AppProvider';
import Header from '../header/Header';
import MainPage from "../pages/MainPage";
import CategoryPage from "../pages/CategoryPage";
import ProductPage from "../pages/ProductPage";
import Footer from "../footer/Footer";
import NotFound from '../404/NotFound';

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
                <Route path='*' element={<NotFound />} />
            </Routes>
            <Footer />
        </HelmetProvider>
        </AppProvider>
      </Router>
    </>
  );
}

export default App;
