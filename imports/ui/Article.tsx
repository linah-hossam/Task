import React, { Fragment, useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
export interface IArticle {
        title: string;
        description:string;
        createdById: string;
        _id: string;
        createdOn:Date;
        modifiedOn:Date,
       user:Meteor.User,
       commentsCount:Number
      }

interface ArticleProps {
  article: IArticle;
  onDeleteClick: (article: { _id: string }) => void;
}

export const Article: React.FC<ArticleProps> = ({ article, onDeleteClick }) => {
    
  const [candelete, setCandelete] = useState(false);
  const[author,setAuthor]=useState("");
  const { currentUser } = useTracker(() => {
    const userId = Meteor.userId();
    const user = userId ? Meteor.users.findOne({ _id: userId }) : undefined;
    return { currentUser: user };
  });

  const [userid, setUserid] = useState<string | null>(null);

  useEffect(() => {
    setUserid(Meteor.userId());
      if (article.createdById) {
        if(article.createdById===currentUser?._id){
            setAuthor("Added by you");
            setCandelete(true);
        }else{
            // console.log("creator");
            // console.log(creator);
            if(article.user?.profile){
                setAuthor(article.user.profile?.name);
            }else{
                setAuthor("Unknown");
            }
        }
      
    }
    // console.log(Meteor.users.findOne(currentUser?._id));
  }, []);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  }));
// const comments=Meteor.call('articleComments',article._id);
// console.log(article._id);
// console.log("comment count");
// console.log(comments);
  return (
    <Item style={{ backgroundColor: 'white' }}>
      <div style={{ display: 'flex' }}>
        <div style={{display:'flex',flexDirection:'column'}}>
        <Typography gutterBottom variant="h5" component="div">
          {article.title}
          ({article?.commentsCount})
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          {article.createdOn.toLocaleString()}
          {"added by:" +author}
        </Typography>
        </div>
        {candelete ? (
            <Fragment>
          <Button
            startIcon={<DeleteForeverIcon />}
            onClick={() => onDeleteClick(article)}
          >
            Delete
          </Button>
           <Button
           style={{ marginLeft: 'auto' }}
           variant="outlined"
           component={Link}
           to={`/articles/${article._id}/edit`}
         >
           edit
         </Button>
         </Fragment>
        ) : (
          <Fragment />
        )}

        <Button
          style={{ marginLeft: 'auto' }}
          variant="outlined"
          component={Link}
          to={`/articles/${article._id}`}
        >
          View
        </Button>
      </div>
    </Item>
  );
};
