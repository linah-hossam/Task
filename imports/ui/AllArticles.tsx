import React, { Fragment, useState,useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Article, IArticle } from './Article';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import { Meteor } from 'meteor/meteor';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery,useQueryClient } from 'react-query';
import {useLocation } from 'react-router-dom';
// import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button } from '@mui/material';
// import { InsertDriveFileRounded } from '@mui/icons-material';


  const getCount = (): Promise<number> => {
    return new Promise<number>((resolve, reject) => {
      Meteor.call("articles.count" ,(error: Error | Meteor.Error, result: number) => {
        if (error) {
            console.log(error.message);
          reject(error);
        } else {
            resolve(result);
        }
      });
    });
  };
  const filterArticles = (search:string,page:number): Promise<[IArticle]> => {
    return new Promise<[IArticle]>((resolve, reject) => {
      Meteor.call("articles.filter" ,search,page,(error: Error | Meteor.Error, result: [IArticle]) => {
        if (error) {
            console.log(error.message);
            getCount();
          reject(error);
        } else {
            resolve(result);
        }
      });
    });
  };
export const AllArticles: React.FC = () => {
    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
      const[search,setSearch]=useState("");
      const location = useLocation();
      const queryParams = new URLSearchParams(location.search);
    //   console.log(queryParams.get('page'));
    //   console.log(queryParams.get('search'));
      const searchval=queryParams.get('search');
      const pageval=parseInt(queryParams.get('page'));
      useEffect(() => {
        if (searchval !== null && search !== searchval) {
          setSearch(searchval);
        }else{
            setSearch("");
        }
        if (pageval !== null && page !== pageval) {
            setPage(pageval);
          }else{
            setPage(1);
          }      
        }, [searchval,pageval]);
      const queryClient = useQueryClient()
    const[page,setPage]=useState(1);
    // const navigate = useNavigate();
    const[open,setOpen]=useState(false);
    const[id,setId]=useState("");
      const { data:counter } = useQuery('count', getCount);
      if(counter){
        console.log("counter!");
        console.log(counter);
      }
     const{data} =useQuery<[IArticle]>(['articles',search, page,counter], () => filterArticles(search,page));
    console.log("data size")
    //  console.log(data?.length);
  const { currentUser } = useTracker(() => {
    const userId = Meteor.userId();
    const user = userId ? Meteor.users.findOne({ _id: userId }) : undefined;
    return { currentUser: user };
  });
 
  const deleteArticle = ({ _id }: { _id: string }) => 
  {
    setOpen(true);
    setId(_id);
};
const handleClose=()=>{
    setOpen(false);
} 
const handleconfirmDelete=()=>{
    Meteor.call('comments.articledelete',id);
    Meteor.call('articles.remove', id);
    queryClient.invalidateQueries({ queryKey: ['count'] });
    setOpen(false);
}
  const handleSearch=()=>{
        console.log(search);
        setPage(1);        
  }
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  return (
    <Fragment>
    <div style={{ padding: '10px 100px', backgroundColor: 'white', textAlign: 'center' ,height:'100vh'}}>
      <Typography variant="h2" gutterBottom>
        All Articles({counter})
      </Typography>
      <Stack spacing={2} sx={{ backgroundColor: 'lightgray', height: '100vh', padding: 20,overflow:'scroll' }}>
        <div style={{display:'flex'}}>
      <TextField fullWidth label="search" id="fullWidth" value={search} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }} />
      <IconButton color="inherit" onClick={handleSearch} > 
            <SearchIcon />
      </IconButton>     
          
             </div>
        {data?.map(task  => {
        return <Article key={task._id} article={task as IArticle} onDeleteClick={deleteArticle} />
        }
          
        )}
        {search==""?(
             <Pagination
             page={page} 
             count={Math.ceil(counter/10)} // Calculate the number of pages based on the number of articles
             shape="rounded"
             onChange={handlePageChange}
           />
        ):(
            <Pagination
            page={page} 
            count={Math.ceil(data?.length/10)} // Calculate the number of pages based on the number of articles
            shape="rounded"
            onChange={handlePageChange}
          />
        )}
          
        {currentUser ? ( 
           <IconButton color="inherit" component={Link} to={`/articles/add`}> 
            <AddIcon />
            ADD ARTICLE
           </IconButton> 
         ) : ( 
          <Fragment></Fragment>
        )} 
      </Stack>
   
    </div>
    <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Are You sure you want to delete this article?
      </Typography>
     <Button onClick={handleconfirmDelete}> Yes</Button>
     <Button onClick={handleClose}>Cancel</Button>
    </Box>
  </Modal>
  </Fragment>
  );
};
