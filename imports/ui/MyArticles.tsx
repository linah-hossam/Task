import React,{useEffect, useState} from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Article,IArticle } from './Article';
import { FormArticle } from './FormArticle';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import { Meteor } from 'meteor/meteor';
import Pagination from '@mui/material/Pagination';
import { useQuery } from 'react-query';

const getArticles = (id:string,page:number): Promise<[IArticle]> => {
    return new Promise<[IArticle]>((resolve, reject) => {
      Meteor.call("articles.getMyArticles",id,page,(error: Error | Meteor.Error, result: [IArticle]) => {
        if (error) {
            console.log(error.message);
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };
export const MyArticles = () => {
    const userId = Meteor.userId(); // Retrieve the userId
    const[count,setCount]=useState(0);
    const[page,setPage]=useState(1);
    const deleteArticle = ({ _id }: { _id: string }) => {
        Meteor.call('articles.remove', _id)
     setCount(count-1)};
   
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        console.log("page changed");
      };
    const { data } = useQuery<[IArticle]>(['Myarticles', userId, page,count], () => getArticles(userId, page), {
        refetchOnMount: true,
        refetchOnWindowFocus: true
    });
   

    useEffect(() => {
       if(data){
        setCount(data.length);
       }
      }, [page]);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };
 
 

  

return(
    <div style={{padding:'10px 200px',backgroundColor: 'white',textAlign:'center'}} >
    <Typography variant="h2" gutterBottom>
       Your Articles
     </Typography>
   <Stack spacing={2} sx={{backgroundColor: 'lightgray',height:'100vh',padding:20,overflow:'scroll' }}> 
     {data?.map(task => {
        return <Article key={task._id} article={task as IArticle} onDeleteClick={deleteArticle} />
        }
          
    )}
   <IconButton color="inherit" component={Link} to={`/articles/add`}>
 <AddIcon></AddIcon> ADD ARTICLE
</IconButton>
</Stack>
<Pagination
        page={page} 
        count={10} // Calculate the number of pages based on the number of articles
        shape="rounded"
        onChange={handlePageChange}
      />

 </div>
);

    
};
