import { useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import useDB from '../../services/useDB';

const AppProvider = ({ children }) => {
  const [productsData, setProductsData] = useState([]);
  const [categories, setCategories] = useState();
  const [wishlist, setWishlist] = useState(() => {
    const savedWish = localStorage.getItem('wishlist');
    return savedWish ? savedWish.split(',') : [];
  });
  const [shoppingCart, setShoppingCart] = useState(() => {
    const savedShoppingCart = localStorage.getItem('shoppingCart');
    return savedShoppingCart ? savedShoppingCart.split(',') : [];
  });
  const [banners, setBanners] = useState();
  const [windowWidth, setWindowWidth] = useState();

  const [profileData, setProfileData] = useState();

  const { makeQuery, isLoading, get, auth } = useDB();

  useEffect(() => {
      makeQuery('banners/').then(data => setBanners(data));
      makeQuery('/products').then(data => setProductsData(data));
      makeQuery('/categories').then(data => setCategories(data));
      auth.onAuthStateChanged(async (user) => {
        try {
          get(`users/${user.uid}`).then(data => setProfileData(data));
        } catch(e) {
        }

     });
      //eslint-disable-next-line
  }, []);

  
  useEffect(() => {
    wishlist && localStorage.setItem('wishlist', wishlist.filter(wish => wish !== '').concat(','));
  }, [wishlist]);

  useEffect(() => {
    shoppingCart && localStorage.setItem('shoppingCart', shoppingCart.filter(item => item !== '').concat(','));
  }, [shoppingCart]);

  useEffect(() => {
    function handleResize() {
        setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
        window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handleItemToggle = (e, id, location) => {
    e.preventDefault();
    e.stopPropagation();

    if (location === 'wishlist') {
      if (wishlist.includes(id)) {
        setWishlist(wishlist.filter(wishId => wishId !== id));
      } else {
        setWishlist([...wishlist, id]);
      }
    } else if (location === 'shopping-cart') {
      if (shoppingCart.includes(id)) {
        setShoppingCart(shoppingCart.filter(cartId => cartId !== id));
      } else {
        setShoppingCart([...shoppingCart, id]);
      }
    }
  }

  const handleClickUpBtn = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  const clearShoppingCart = () => {
    setShoppingCart('');
    localStorage.removeItem('shoppingCart');
  }

  return (
    <AppContext.Provider value={{ productsData, wishlist, shoppingCart, banners, categories, windowWidth, profileData, setProfileData, handleItemToggle, clearShoppingCart, handleClickUpBtn, isLoading }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
