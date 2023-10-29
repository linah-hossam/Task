import React, { Fragment } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Link ,useNavigate} from 'react-router-dom';
import { AppBar, Toolbar, Typography, makeStyles, Button } from '@material-ui/core';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));
 
  const NavBar: React.FC = () => {
    // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
    const { currentUser } = useTracker(() => {
        const userId = Meteor.userId();
        const user = userId ? Meteor.users.findOne({ _id: userId }) : undefined;
        return { currentUser: user };
      });
      const navigate = useNavigate();
  // console.log(currentUser.email);
//   console.log(Meteor.user().username);
console.log(`user: ${JSON.stringify(currentUser)}`);
const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handlesignout=()=>{
    // console.log(currentUser);
    Meteor.logout();
    navigate('/login');
    // console.log("user:"+Meteor.user())
  }
  const classes = useStyles();

  return (
    <AppBar position="static">
        <Toolbar>
            {currentUser?(
                 <Typography variant="h6" className={classes.title}>
                 { "Hello,"+currentUser?.profile?.name}
               </Typography>
            ):
            (
                <Typography variant="h6" className={classes.title}>
                Articles Hub
              </Typography>
            )}
         
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          {currentUser?(
            <Fragment>
             <Button color="inherit" component={Link} to="/articles/mine">
             MyArticles
           </Button>
              <Button color="inherit" onClick={handlesignout}>
              SignOut
            </Button>
            </Fragment>
          ):(
            <div>
            <Button
              id="fade-button"
              aria-controls={open ? 'fade-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              LogIn/Register
            </Button>
            <Menu
              id="fade-menu"
              MenuListProps={{
                'aria-labelledby': 'fade-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              TransitionComponent={Fade}
            >
              <MenuItem component={Link} to="/login">LogIn</MenuItem>
              <MenuItem component={Link} to="/register" >Register</MenuItem>
            </Menu>
          </div>          
          )}
        
        
        </Toolbar>
      </AppBar>
  );
};

export default NavBar;
