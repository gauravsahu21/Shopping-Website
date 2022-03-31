import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = (props) => {
  return (
    <Card className="card">
       <CardMedia
        component="img"
        height="100%"
        image={props.cart.image}
        alt={props.cart.image}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props.cart.name}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
        ${props.cart.cost}
        </Typography>
        <Rating name="read-only" value={props.cart.rating} readOnly />
      </CardContent>
      <CardActions>
      <Button className="button" variant="contained" style={{width:"400px"}} onClick={()=>props.handleaddToCart(props.cart._id)}>
     <AddShoppingCartOutlined/> ADD TO CART
           </Button>
        
      </CardActions>
    </Card>
  );
};

export default ProductCard;
