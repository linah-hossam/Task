import React, { Fragment, useState } from 'react';
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
import { useQuery } from 'react-query';
import {useLocation } from 'react-router-dom';
// import { useHistory } from 'react-router-dom';

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
    const[page,setPage]=useState(1);
    // const navigate = useNavigate();

   const [articles,setArticles]=useState<[IArticle]>();
    const[count,setCount]=useState(0);
    const[search,setSearch]=useState("");
    const[pageCount,setPageCount]=useState(0);

   
      const countArticles=async()=>{
        try {
            const result = await getCount(); 
            console.log("hey result "+result);
            setCount(result);
            setPageCount(Math.ceil(count/10));
            console.log(count);
          } catch (error) {
            // Handle the error
            console.error("Error fetching article data:", error);
          }
      }
   
     const{data} =useQuery<[IArticle]>(['articles',search, page,count], () => filterArticles(search,page));
     console.log(data);
     countArticles();
  const { currentUser } = useTracker(() => {
    const userId = Meteor.userId();
    const user = userId ? Meteor.users.findOne({ _id: userId }) : undefined;
    return { currentUser: user };
  });
 


  const deleteArticle = ({ _id }: { _id: string }) => 
  {
    Meteor.call('articles.remove', _id)
    countArticles();
};

 
  const handleSearch=()=>{
        console.log(search);
        // filtering(search);
        setPage(1);
        // navigate(`/${1}/${search}`)
  }
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
   
    // navigate(`/${value}`)

        // navigate(`/${value}`)
    
    console.log("page changed");
  };
  return (
    <div style={{ padding: '10px 100px', backgroundColor: 'white', textAlign: 'center' ,height:'100vh'}}>
      <Typography variant="h2" gutterBottom>
        All Articles({count})
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
           <Pagination
        page={page} 
        count={pageCount} // Calculate the number of pages based on the number of articles
        shape="rounded"
        onChange={handlePageChange}
      />
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
  );
};
