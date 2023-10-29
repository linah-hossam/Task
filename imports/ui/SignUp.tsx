import React, { Fragment, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {Accounts} from 'meteor/accounts-base';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import { Link,useNavigate} from 'react-router-dom';
import Alert from '@mui/material/Alert';
import { Meteor } from 'meteor/meteor'; // Import Meteor if not already imported
export const SignUp: React.FC = () => {
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  
  const submit = (doc: { email: string; password: string,name:string}) => {
    const { email, password,name } = doc;
    Accounts.createUser({ email: email, password: password, profile: {
        // The profile is writable by the user by default.
        name: name
      }
     }, (error) => {
        if (error) {
            if ('reason' in error) {
              setError(error.reason || 'An error occurred');
              console.log(error.reason);
            } else {
              setError('An error occurred');
              console.log('An error occurred');
            }
          } else {
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
                    navigate('/');
                  }
              });
            console.log('signed up');
          }
        });
        // Meteor.users.update({_id:Meteor.user()?._id}, {$set:{"profile.name":name}});
        // console.log(Meteor.user);

  }
  

  const SignupSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmpassword: Yup.string()
      .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
      .required('Please confirm your password'),
      name:Yup.string().required("Name is required"),
  });

  return (
    <div style={{ justifyContent: 'center', display: 'flex', backgroundColor: 'lightgray', height: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', height: 'auto' }}>
        <Paper elevation={3} sx={{ width: 300, textAlign: 'center', padding: '10px 60px' }}>
          <h1>SignUp</h1>
          <AccountCircleIcon style={{ fontSize: 60, marginBottom: 20 }}></AccountCircleIcon>
          <Formik
            initialValues={{
                name:'',
              email: '',
              password: '',
              confirmpassword: '',
            }}
            validationSchema={SignupSchema}
            onSubmit={values => {
              console.log(values);
              submit(values);
            }}
          >
            
              <Form style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <label> Name*</label>
                <Field name="name" type="name" />
                <ErrorMessage name="name" component={Alert}  />
                <label> Email*</label>
                <Field name="email" type="email" />
                <ErrorMessage name="email" component={Alert}  />
                <label> Password*</label>
                <Field name="password" type="password" />
                <ErrorMessage name="password" component={Alert}  />
                <label>Confirm Password*</label>
                <Field name="confirmpassword" type="password" />
                <ErrorMessage name="confirmpassword" component={Alert} />
                {error === "" ? <Fragment></Fragment> : <Alert severity="error">{error}</Alert>}
                <Button style={{ marginTop: '30px' }} type="submit">
                  Sign Up
                </Button>
              </Form>
            
          </Formik>
          <Button variant="text" component={Link} to={`/`}>
            Complete as a guest
          </Button>
        </Paper>
      </Box>
    </div>
  );
};

