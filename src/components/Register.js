import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [username,setUserName]=useState("");
  const [password,setpassword]=useState("");
  const [confirmpass,setconfirmpass]=useState("");
  const [isloading,setisloading]=useState(false);
 
  const handlename=(e)=>{
    setUserName(e.target.value);
  }
  const handlepass=(e)=>{
    setpassword(e.target.value);
  }
  const handleconfirmpass=(e)=>{

    setconfirmpass(e.target.value);
  }

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
     const formData={
       "username":username,
       "password":password,
       "confirmpass":confirmpass
       
     }
  const register = async () => {
    setisloading(true);
    if(validateInput(formData))
   {     const postData={
            username:formData.username,
            password:formData.password
          }

      await axios.post(`${config.endpoint}/auth/register`,postData).then((response)=>{
           setisloading(false);
           enqueueSnackbar("Registered successfully", {variant:"success"});
         
      }).catch((error=>{
        setisloading(false);
        enqueueSnackbar("Username is already taken",{variant:"error"});
      }))
     
    }
    else{
     
      if(formData.username.length===0 )
      {    setisloading(false);
        enqueueSnackbar("Username is a required field");
      }
      else if(formData.username.length<6)
      {  setisloading(false);
        enqueueSnackbar("Username must be at least 6 characters");
      }
      else if(formData.password.length===0)
      {setisloading(false);
        enqueueSnackbar("Password is a required field");
      }
      else if(formData.password.length<6)
      {setisloading(false);
        enqueueSnackbar("Password must be at least 6 characters");
      }
      else if(formData.password!==formData.confirmpass)
      {setisloading(false);
        enqueueSnackbar("Passwords do not match");
      }
    }

    
        
      

  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *  
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
      if(data.username.length===0 ||data.username.length<6)
        {
          return false;
        }
      else if(data.password.length===0 ||data.password.length<6)
      {
        return false;
      }
      else if(data.confirmpass.length===0 || data.confirmpass.length<6) 
      {
        return false;
      }
    else if(data.password!==data.confirmpass)
    {
      return false;
    }
    return true;
   
      
  };
  

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
             value={username}
             onChange={(e)=>handlename(e)}
           
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={password}
            onChange={(e)=>handlepass(e)}
           
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={confirmpass}
            onChange={(e)=>handleconfirmpass(e)}
           
          />{isloading?<CircularProgress />:
           <Button className="button" variant="contained" onClick={register} >
            Register Now
           </Button>}
          <p className="secondary-action">
            Already have an account?{" "}
             <a className="link" href="#">
              Login here
             </a>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
