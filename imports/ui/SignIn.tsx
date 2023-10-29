import React,{ Fragment, useState } from 'react';
 import { Formik, Form, Field } from 'formik';
 import * as Yup from 'yup';
 import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor'; // Import Meteor if not already imported
import { useTracker } from 'meteor/react-meteor-data';
import { Link, Navigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Alert from '@mui/material/Alert'; 
 export const SignIn = () => {
  const users = useTracker(() => Meteor.users.find().fetch());
  console.log(users);
    const [error, setError] = useState('');
    const[redirect,setRedirect]=useState(false);
    const submit = (doc: { email: string; password: string }) => {      // console.log('submit', doc, redirect);
      const { email, password } = doc;
     console.log(email);
      Meteor.loginWithPassword(email, password, (error) => {
        if (error) {
            if ('reason' in error) {
              setError(error.reason || 'An error occurred');
              console.log(error.reason);
            } else {
              setError('An error occurred');
              console.log('An error occurred');
            }
          } else {
            console.log('signed in');
            setRedirect(true);
          }
      });
      // console.log('submit2', email, password, error, redirect);
    };
      const SignupSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      });
      if (redirect) {
        console.log("hi"+Meteor.user());
        return (<Navigate to="/" />);
      }else{
      return(
   <div style={{justifyContent:'center',display:'flex', backgroundColor: 'lightgray',height: '100vh'}}>
     <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        height:'50vh',
      }}
    >
           <Paper elevation={3} sx={{ width: 300,textAlign: 'center',padding: '10px 60px' }} >

     <h1>SignIn</h1>
     <AccountCircleIcon style={{ fontSize: 60,marginBottom:20 }}></AccountCircleIcon>
     <Formik
        initialValues={{
            email: '',
            password:'',
            confirmpassword:''
          }}
          validationSchema={SignupSchema}
          onSubmit={values => {
            console.log(values);
            submit(values);
          }}
     >
       {({ errors, touched }) => (
         <Form style={{display:'flex',flexDirection:'column',textAlign:'left'}}>
           <label> Email*</label>
           <Field name="email" type="email" />
           {errors.email && touched.email ? <div><Alert severity="error">{errors.email}</Alert></div> : null}
           <label> Password*</label>
           <Field name="password" type="password" />
           {errors.password && touched.password ? <div>{<Alert severity="error">{errors.password}</Alert>}</div> : null}
           {error==""?(
      <Fragment></Fragment>
     ):(
      <Alert severity="error">{error}</Alert>

     )}
           <Button style={{marginTop:'30px'}} type="submit">SIgnIn</Button>
         </Form>

       )}
     </Formik>
   
     <Button variant="text"  component={Link} to={`/`}>Complete as a guest</Button>

     </Paper> 
         </Box>
   </div>
      );
       }
 };