import React, { Fragment, useState } from 'react';
import { Meteor } from 'meteor/meteor'; // Import Meteor if not already imported
import { Navigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import DescriptionIcon from '@mui/icons-material/Description';
import { useNavigate } from 'react-router-dom';

export const FormArticle: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [addArticle, setAddArticle] = useState<boolean>(true);
  const [redirect, setRedirect] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleClose = () => {
    setAddArticle(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title||!description) {
      setError("Both Title and description are required!");
      return;
    }
    Meteor.call('articles.insert', title, description);
    // navigate(`/articles/${id}`)
    setRedirect(true);
  };

  if (redirect) {
    console.log("hi", Meteor.user());
    return <Navigate to="/" />;
  } else {
    return (
      <div style={{ justifyContent: 'center', backgroundColor: 'lightgray', height: '100vh', display: 'flex', textAlign: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', height: '50vh' }}>
          <Paper elevation={3} sx={{ width: 300, textAlign: 'center', padding: '10px 60px' }}>
            <h1> New Article</h1>
            <DescriptionIcon style={{ fontSize: 60, marginBottom: 20 }} />
            <form className="task-form" style={{ textAlign: 'left' }} onSubmit={handleSubmit}>
              <label> Article's Title*</label>
              <input
                type="text"
                placeholder="Add Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            
              <label> Article's Description</label>
              <input
                type="text"
                placeholder="Add Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button type="submit">Add Task</Button>
            </form>
            {error === '' ? (
                <Fragment></Fragment>
              ) : (
                <Alert severity="error">{error}</Alert>
              )}
          </Paper>
          
        </Box>
      </div>
    );
  }
};
