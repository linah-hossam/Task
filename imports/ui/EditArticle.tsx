import { Card, CardContent, Typography, CardActions, Button, TextField } from '@mui/material';
import { IArticle } from './Article';
import Divider from '@mui/material/Divider';
import { useState ,useEffect} from 'react';
import { Meteor } from 'meteor/meteor';
import { useParams } from 'react-router-dom';
import React from 'react';
import { useQuery } from 'react-query';


export const EditArticle: React.FC = () => {
    const {_id} = useParams<{ _id: string }>(); 
    const[articles,setArticles]=useState<any>();
    const[description,setDescription]=useState("");

    const getArticleData = (_id: string): Promise<IArticle> => {
        return new Promise<IArticle>((resolve, reject) => {
          Meteor.call("articles.getArticle", _id, (error: Error | Meteor.Error, result: IArticle) => {
            if (error) {
              reject(error);
            } else {
                console.log(result);
              resolve(result);
            }
          });
        });
      };
      const {data,isLoading,error}= useQuery<IArticle>(['articleFind',_id], () => getArticleData(_id));
      useEffect(() => {
        if (data) {
          console.log(data);
          setDescription(data.description);
        }
      }, [data]);
    const handlechange = (event: React.ChangeEvent<HTMLInputElement>)=>{
        setDescription(event.target.value);
        console.log(description);
    }
    const updateArticle = (_id: string, description: string): void => {
        Meteor.call('articles.update', _id, description);
      };
    const handledone=()=>{
        if (data?._id) {
          updateArticle(data?._id, description);
        }
    }
    return(
        <div style={{justifyContent:'center',display:'flex',backgroundColor: 'lightgray',textAlign:'center',overflow:'auto',height:'100vh'}}>
        <Card sx={{ maxWidth: 500 ,margin:3,padding:'20px 100px'}}>        
        <CardContent>
        <Typography gutterBottom variant="h2" component="div" style={{ textAlign: 'center',marginBottom:'120px',wordWrap: 'break-word' }}>
            {data?.title}
          </Typography>
          <Divider />
          <Typography variant="h4" color="text.secondary" style={{textAlign:'left',wordWrap: 'break-word'}}>
          </Typography>
          <TextField
          style={{wordWrap: 'break-word' }}
             type="text"
             value={description}
            onChange={handlechange}
           />    
           </CardContent>
        <CardActions>
          <Button size="small" onClick={handledone}>Done</Button>
        </CardActions>
        </Card>
        </div>

    );
    }
