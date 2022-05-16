import {
  LOAD_PRODUCTS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from "../actions";

const filter_reducer = (state, action) => {
  switch (action.type) {
    case LOAD_PRODUCTS:
      let maxPrice = action.payload.map((product) => product.price);
      maxPrice = Math.max(...maxPrice);
      //spread operator to copy the values instead of pointing them and moving
      return {
        ...state,
        all_products: [...action.payload],
        filtered_products: [...action.payload],
        filters: { ...state.filters, max_price: maxPrice, price: maxPrice },
      };
    case SET_LISTVIEW:
      return { ...state, grid_view: false };
    case SET_GRIDVIEW:
      return { ...state, grid_view: true };
    case UPDATE_SORT:
      return { ...state, sort: action.payload };
    case SORT_PRODUCTS:
      const { sort, filtered_products } = state;
      let tempProducts = [...filtered_products];
      if (sort === "price-lowest") {
        tempProducts = tempProducts.sort((a, b) => a.price - b.price);
      }
      if (sort === "price-highest") {
        tempProducts = tempProducts.sort((a, b) => b.price - a.price);
      }
      if (sort === "name-a") {
        tempProducts = tempProducts.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
      }
      if (sort === "name-z") {
        tempProducts = tempProducts.sort((a, b) => {
          return b.name.localeCompare(a.name);
        });
      }
      return { ...state, filtered_products: tempProducts };
    case UPDATE_FILTERS:
      const { name, value } = action.payload;

      return { ...state, filters: { ...state.filters, [name]: value } };
    case FILTER_PRODUCTS:
      const { all_products } = state;
      const { text, category, company, color, price, shipping } = state.filters;
      let temp_products = [...all_products];
      // filtering search text
      if (text) {
        temp_products = temp_products.filter((product) =>
          product.name.toLowerCase().startsWith(text)
        );
      }
      // filtering category
      if (category !== "all") {
        temp_products = temp_products.filter(
          (product) => product.category === category
        );
      }

      // filtering company
      if (company !== "all") {
        temp_products = temp_products.filter(
          (product) => product.company === company
        );
      }

      // filtering colors
      if (color !== "all") {
        temp_products = temp_products.filter((product) => {
          return product.colors.find((c) => c === color);
        });
      }
      // filtering price
      temp_products = temp_products.filter((product) => {
        return product.price <= price;
      });
      // filtering shipping
      if (shipping) {
        temp_products = temp_products.filter(
          (product) => product.shipping === true
        );
      }

      return { ...state, filtered_products: temp_products };
    case CLEAR_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          text: "",
          company: "all",
          category: "all",
          color: "all",
          price: state.filters.max_price,
          shipping: false,
        },
      };
    default:
      throw new Error(`No Matching "${action.type}" - action type`);
  }
};

export default filter_reducer;
