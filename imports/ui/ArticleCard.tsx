import React, { Fragment, useEffect, useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, CardActions, Button, TextField } from '@mui/material';
import Container from '@mui/material/Container';
import { Comments } from '../api/Comments';
import Divider from '@mui/material/Divider';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import { IComment } from './Comment';
import { Comment } from './Comment';
import { IArticle } from './Article';
import { useQuery } from 'react-query';

const getArticleData = (_id: string): Promise<IArticle> => {
    return new Promise<IArticle>((resolve, reject) => {
      Meteor.call("articles.getArticle", _id, (error: Error | Meteor.Error, result: IArticle) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };
export const ArticleCard: React.FC = () => {
  const { _id } = useParams<{ _id: string }>(); 
  const deleteComment = ({ _id }: { _id: string }) => Meteor.call('comments.remove', _id);

  // Added type for _id in useParams
  console.log(_id);
  const[articles,setArticles]=useState<any>();
  const{data,isLoading} =useQuery<IArticle>(['articleCard',_id], () => getArticleData(_id));
  
  useEffect(() => {
    
   if(data){
    console.log(data);
    setArticles(data);
   }

  }, [_id]);
  const { currentUser } = useTracker(() => {
    const userId = Meteor.userId();
    const user = userId ? Meteor.users.findOne({ _id: userId }) : undefined;
    return { currentUser: user };
  });
//    console.log(article);
 // Added type assertion for the article
  const [comment, setComment] = useState<string>(""); // Added type for the comment state
  const [opencomments, setopencomments] = useState<boolean>(false); // Added type for the opencomments state

  const handleAddComment=()=>{
    try {
      Meteor.call('comments.insert',comment,_id)
      console.log('Comment added successfully.');
      setComment("");
    } catch (error) {
      console.error('Error adding comment:', error);
    }
   }
  
const handlecomment=()=>{
  setopencomments(!opencomments);
}
  const handlecommentchange=(event: React.ChangeEvent<HTMLInputElement>)=>{
setComment(event.target.value);
  }  
    const handler = Meteor.subscribe('comments');

     const { comments } = useTracker(() => {
      const comments = Comments?.collection.find({ articleId:_id }).fetch();
      return { comments };
    });
//   console.log(article);  
 console.log(_id);
 if(isLoading){
    return(
        <p>"loading..</p>
    )
 }
 else{
    console.log(comments);
return(
  
  <div style={{justifyContent:'center',display:'flex',backgroundColor: 'lightgray'}}>
    <Card sx={{ maxWidth: 600 ,padding:'20px 100px',margin:'0px 200px',height:'100vh',textAlign:'center',overflow:'auto'}}>  
    <CardContent>
      <Typography gutterBottom variant="h2" component="div" style={{ textAlign: 'center',marginBottom:'120px',wordWrap: 'break-word' }}>
         {data?.title} 
      </Typography>
      <Divider />

      <Typography variant="h4" color="text.secondary" style={{textAlign:'left',wordWrap: 'break-word'}}>
         {data?.description}
      </Typography>
      <Typography variant="h6" color="text.secondary" style={{textAlign:'left',wordWrap: 'break-word'}}>
      {data?.createdOn.toLocaleString()}
      </Typography>
    </CardContent>
             <Button
             variant="outlined"
             startIcon={<TextsmsOutlinedIcon />}
             onClick={handlecomment}
           >
             Comments
           </Button>
    
      {opencomments?(
 <Container  sx={{bgcolor:'lightgray',padding:'10px',overflow: 'auto',justifyContent:'center'}}>
 <h4> Comments :</h4>
 {comments.map((comment) => (
            <Comment  comment={comment as IComment} onDeleteClick={deleteComment} />
            ))}
{currentUser?(
    <div>
      <TextField
      type="text"
      value={comment}
     onChange={handlecommentchange}
    />    
          <Button size="small"onClick={handleAddComment} >Add Comment</Button>
          </div>
):(
    <Fragment></Fragment>
)}
           
</Container>    
         ):(
<Fragment></Fragment>
         )}
    </Card>
    </div>
);
         }
};
