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
    const fetchData = async () => {
      const [bannersData, productsData, categoriesData] = await Promise.all([
        makeQuery('banners/'),
        makeQuery('/products'),
        makeQuery('/categories')
      ]);
      
      setBanners(bannersData);
      setProductsData(productsData);
      setCategories(categoriesData);
    };
  
    const handleAuthStateChanged = async (user) => {
      if (user && user.emailVerified) {
        const profileData = await get(`users/${user.uid}`);
        setProfileData(profileData);
      }
    };
  
    fetchData();
    const unsubscribe = auth.onAuthStateChanged(handleAuthStateChanged);
  
    return () => unsubscribe();
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
