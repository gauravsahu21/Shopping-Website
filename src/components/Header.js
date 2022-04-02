import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useHistory, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  InputAdornment,
  TextField,
} from "@mui/material";
import { Search, SentimentDissatisfied } from "@mui/icons-material";
const Header = (props) => {
  
  
  const history=useHistory();
  
 const handleLogout=(e)=>{
  localStorage.clear();
  history.push("/");
  window.location.reload();

 }

    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        <Box>{props.children &&<TextField
        className="search-desktop"
        size="small"
        fullWidth
         value={props.name}
          onChange={(e)=>props.handle(e,props.time)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      /> }</Box>
       <Box>
        {localStorage.getItem("token")!==null?<Stack direction="row" spacing={2} alignItems="center">
    <img src="avatar.png" alt={localStorage.getItem("username")}></img>
       <p>{localStorage.getItem("username")}</p>
        <Button
          className="explore-button"
          variant="text"
          onClick={handleLogout}
        >
        logout</Button></Stack> :props.hasHiddenAuthButtons?<Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={()=>history.push("/")}
        >
          Back to explore
        </Button>:<Stack direction="row" spacing={2}><Button
          className="explore-button"
          variant="text"
          onClick={()=>history.push("/login")}
        >
        LOGIN</Button><Button 
        className="button" variant="contained" 
        onClick={()=>history.push("/register")} >
               REGISTER
           </Button></Stack>}
      </Box></Box>
    );
};

export default Header;
