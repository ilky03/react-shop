import { createContext } from "react";

export const AppContext = createContext({
  productsData: [],
  wishlist: [],
  addToWishlist: () => {},
});
