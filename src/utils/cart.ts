import { CartData } from "../models/cart";

export const calculateTotal = (cart: CartData) => {
  return cart.item.reduce((total, item) => {
    let itemPrice = item.price || 0;
    item.customizations.forEach((customization) => {
      itemPrice += customization.price_modifier || 0;
    });
    return total + itemPrice * item.quantity;
  }, 0);
};
