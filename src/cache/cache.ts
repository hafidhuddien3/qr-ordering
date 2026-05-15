import { MenuItem } from "../models/menuResponse";

export const menuCache = new Map();

export const cacheObject = {
  currentMenuItem: null as MenuItem | null,
  shouldAnimateCart: false,
  cartItemLength: 0
};