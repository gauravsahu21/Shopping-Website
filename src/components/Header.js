import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useHistory, Link } from "react-router-dom";
import { useEffect, useState } from "react";
const Header = ({ children, hasHiddenAuthButtons }) => {
   //const [isloged,setisloged]=useState(false);
  
  const history=useHistory();
  // const name=localStorage.getItem("username");
  // useEffect(()=>{
  //   if(name!==null)
  //     {
  //       setisloged(true);
  //     }
  //    else
  //    {
  //      setisloged(false);
  //    } 
  //    return isloged;
  // })
 const handleLogout=(e)=>{
  localStorage.clear();

  window.location.reload();

   console.log("logout");
 }
//  const Loged=()=>{
//    if(localStorage.getItem("token")!==null)
//    {  
//      return (<Stack direction="row" spacing={2} alignItems="center">
//      <img src="avatar.png" alt="gaurav"></img>
//         <p>{localStorage.getItem("username")}</p>
//          <Button
//            className="explore-button"
//            variant="text"
//            onClick={handleLogout}
//          >
//          logout</Button></Stack>)
//    }
//    else {
//      return (<Stack direction="row" spacing={2}><Button
//      className="explore-button"
//      variant="text"
//      onClick={()=>history.push("/login")}
//    >
//    LOGIN</Button><Button 
//    className="button" variant="contained" 
//    onClick={()=>history.push("/register")} >
//           REGISTER
//       </Button></Stack>)
//    }
//  }

    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {localStorage.getItem("token")!==null?<Stack direction="row" spacing={2} alignItems="center">
    <img src="avatar.png" alt={localStorage.getItem("username")}></img>
       <p>{localStorage.getItem("username")}</p>
        <Button
          className="explore-button"
          variant="text"
          onClick={handleLogout}
        >
        logout</Button></Stack> :hasHiddenAuthButtons?<Button
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
      </Box>
    );
};

export default Header;
