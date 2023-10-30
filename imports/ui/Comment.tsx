import React, { Fragment, useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import Box from '@mui/material/Box';
import { Meteor } from 'meteor/meteor';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, CardActions, Button, TextField } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useQuery } from 'react-query';

export interface IComment {
    _id: string;
    text:string;
    createdById: string;
    createdOn:Date;
  }
  interface CommentProps {
    comment: IComment;
    onDeleteClick: (comment: { _id: string }) => void;
  }
  
  const getCreator = (createdById: string): Promise<Meteor.User> => {
    return new Promise((resolve, reject) => {
      Meteor.users.findOne({ _id: createdById }, (error, result) => {
        console.log("entered");
        if (error) {
            console.log(error);
          reject(error);
        } else {
            console.log(result);
          resolve(result as Meteor.User);
        }
      });
    });
  };
export const Comment: React.FC <CommentProps> = ({comment,onDeleteClick}) => {
    const { currentUser } = useTracker(() => {
        const userId = Meteor.userId();
        const user = userId ? Meteor.users.findOne({ _id: userId }) : undefined;
        return { currentUser: user };
      });
      const { data, error, isLoading } = useQuery<Meteor.User, Error>(['creator', comment.createdById], () =>
      getCreator(comment.createdById)
    );
    if(error){
        console.log(error);
    }
    if(data){
        console.log("data");
    }
    if(isLoading){
        console.log("loading");
    }
      console.log(comment.createdById);
    //   const commentOwner =Meteor.users.find({_id:comment.createdById}).fetch();
    //   console.log(commentOwne);
 return(
    <Fragment>
    <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
        <AccountCircleIcon></AccountCircleIcon>
        {comment?.profile?.name}
        </div>
    <Box sx={{ bgcolor: 'white',margin:'10px',height:'10vh',justifyContent:'left',width:'350px',padding:'0px 10px'}} 
  >
    
          <Typography style={{textAlign:'center'}} variant="h6" color="text.secondary">
                {comment.text}
                </Typography>
                <Typography style={{textAlign:'right'}}variant="body2" color="text.secondary">
                 {comment.createdOn.toLocaleString()} 
                </Typography>
                {currentUser?._id===comment.createdById?(
                    <Button onClick={() => onDeleteClick(comment)}>
                     Delete</Button>
                ):(
                    <Fragment></Fragment>
                )}
            

    </Box>
    </Fragment>
 );

};
