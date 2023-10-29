import React,{useState} from 'react';
import { AllArticles } from './AllArticles';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
// import { Roles } from 'meteor/alanning:roles';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './NavBar';
import { SignUp } from './SignUp';
import { ArticleCard } from './ArticleCard';
import { FormArticle } from './FormArticle';
import { MyArticles } from './MyArticles';
import { SignIn } from './SignIn';
import { NotFound } from './NotFound';
import { EditArticle } from './EditArticle';
import { QueryClient, QueryClientProvider } from 'react-query';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isLogged = Meteor.userId() !== null;
  return isLogged ? <>{children}</> : <Navigate to="/login" />;
};
export const App = () => {
  const queryClient = new QueryClient();

return(
  <QueryClientProvider client={queryClient}>
  <Router>
      <div className="d-flex flex-column min-vh-100">
        <NavBar></NavBar>
        <Routes>
          <Route  path="/" element={<AllArticles />} />
          <Route  path="/login" element={<SignIn/>}></Route>
          <Route  path="/register" element={<SignUp/>}></Route>
          <Route  path="/articles/:_id" element={<ArticleCard/>}></Route>
          <Route  path="/articles/add" element={<ProtectedRoute><FormArticle/></ProtectedRoute>}></Route>
          <Route  path="/articles/mine" element={<ProtectedRoute><MyArticles/></ProtectedRoute>}></Route>
          <Route path="/articles/:_id/edit"   element={<ProtectedRoute><EditArticle/></ProtectedRoute>} > </Route>
          <Route  path="*" element={<NotFound></NotFound>}></Route>

        </Routes>
      </div>
    </Router>  
    </QueryClientProvider>

);

};
