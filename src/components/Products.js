import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard.js";
import Cart from "./Cart.js";
import {generateCartItemsFrom} from "./Cart.js";
// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [product,setproduct]=useState([]);
  const [load,setload]=useState(true);
  const [find,setfind]=useState("");
  const [debounceTimeout, setdebouncetimeout] = useState(500);
  const [cartItem,setcartItem]=useState([]);
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
 
  useEffect(()=>{
    async function Test()
     {  
      const res=await performAPICall();
      setproduct(res);
     setload(false);
    }
    Test();
  },[]);
 
  useEffect(()=>{
    async function Onload(){
      if(localStorage.getItem("token")!==null)
      {
        const cartData=await fetchCart(localStorage.getItem("token"));
        //console.log(cartData);
        const productData=await performAPICall();
        //console.log(productData);
       const cartItemList=generateCartItemsFrom(cartData,productData);
        setcartItem(cartItemList);
      }
    }
    Onload();
  },[])

  const performAPICall = async () => {
  
    try{

     
      const re=await axios.get(`${config.endpoint}/products`);
        return re.data;
  }
    catch(e){
      
    }
    
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
  
    try{

     
      const re=await axios.get(`${config.endpoint}/products/search?value=${text}`);
         setproduct(re.data);
  }
    catch(e){
      setproduct([]);
    }

  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
   let search=event.target.value;
   setfind(search);
   if(debounceTimeout!==0)
   {
     clearTimeout(debounceTimeout);
   }
   const newTimeout=setTimeout(()=>performSearch(search),500);
   setdebouncetimeout(newTimeout);

  };

/**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const result= await axios.get(`${config.endpoint}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(result.data);
      return result.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    for(let i=0;i<items.length;i++)
    {
      if(items[i]._id===productId)
      {
        return true;
      }
    }
    return false;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const handleaddToCart= async(productId)=>{
    ;
    addToCart(localStorage.getItem("token"),cartItem,product,productId,1,{preventDuplicate:true});
  }
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if(!token)
    {
      enqueueSnackbar( "Login to add an item to the Cart");
    }
    else if(options.preventDuplicate && isItemInCart(items,productId))
    {
      enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.");
    }
    else{
       try{
         const res=await axios.post(`${config.endpoint}/cart`, 
         {
          productId:productId,
           qty:qty
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
        if(options.preventDuplicate)
        {
          enqueueSnackbar("Item added successfully to the cart!",{variant:"success"});
        }
        const cartlist=generateCartItemsFrom(res.data,products);
        setcartItem(cartlist);
  
        }
        catch(e){
          if (e.response && e.response.status === 400) {
            enqueueSnackbar(e.response.data.message, { variant: "error" });
          } else {
            enqueueSnackbar(
              "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
              {
                variant: "error",
              }
            );
          }
          return null;

        }

    }
    
  };
  const handlequantity= async(action,productId,value)=>{
   
    let qty = parseInt(value);
    if (action === "add") {
      qty = qty + parseInt(1);
    } else {
      qty = qty - parseInt(1);
    }
    
    addToCart(localStorage.getItem("token"),cartItem, product, productId, qty, {
      preventDuplicate: false,
    });
  }
  





  return (
    <div>
      <Header children={true}  hasHiddenAuthButtons={false} name={find} handle={debounceSearch} time={debounceTimeout} />
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        
      

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        value={find}
          onChange={(event)=>{debounceSearch(event,debounceTimeout)}}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
       {localStorage.getItem("token")!=null?<Grid container spacing={2}>
        <Grid item  md={9}>
         <Grid container spacing={2}>
            <Grid item className="product-grid">
                <Box className="hero">
                 <p className="hero-heading">
                  India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                   to your door step
                   </p>
                  </Box>
              </Grid>
                {load?<div style={{alignItems:"center"}}><CircularProgress />Loading Products</div>:product.length===0?<div className="center">
                <div><SentimentDissatisfied/></div> <div>No products found</div>
                  </div>:
            product.map((cart)=>{
             return (
               <Grid item xs={6} md={3}  key={cart._id}>
               <ProductCard key={cart._id} cart={cart} handleaddToCart={handleaddToCart}/>
                </Grid>
                )
                })

                 }
          </Grid>
      </Grid>
      <Grid item  md={3}>
           <Cart products={product}  items={cartItem} handlequantity={handlequantity}/>
         </Grid>
  </Grid>
     :<Grid container spacing={2}>
     
       
           <Grid item className="product-grid">
               <Box className="hero">
                <p className="hero-heading">
                 India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                  to your door step
                  </p>
                 </Box>
             </Grid>
               {load?<div style={{alignItems:"center"}}><CircularProgress />Loading Products</div>:product.length===0?<div className="center">
               <div><SentimentDissatisfied/></div> <div>No products found</div>
                 </div>:
           product.map((cart)=>{
            return (
              <Grid item xs={6} md={3}  key={cart._id}>
              <ProductCard key={cart._id} cart={cart} handleaddToCart={handleaddToCart}/>
               </Grid>
               )
               })

                }
         </Grid>
     
    }
      <Footer />
    </div>
  );
};

export default Products;