import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/home';
import { Login } from './pages/login';
import { Register } from './pages/register';
import { CreatePost } from './pages/create-post';
import { SavedPosts } from './pages/saved-posts';
import { Navbar } from './components/Navbar' ; 
import { SearchBar } from './SearchBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SearchResults } from './pages/SearchResults';
import { MyPosts } from './pages/myposts';
import { EditPost } from './pages/editPost';
import { AuthProvider, AuthContext } from './hooks/AuthProvider'; 
import React, { useContext } from 'react';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <SearchBar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-post" element={<ProtectedRoute component={CreatePost} />} />
          <Route path="/saved-posts" element={<ProtectedRoute component={SavedPosts} />} />
          <Route path="/myposts" element={<ProtectedRoute component={MyPosts} />} />
          <Route path="/searchresults/:searchTerm" element={<SearchResults />} />
          <Route path="/editPost/:postId" element={<ProtectedRoute component={EditPost} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const ProtectedRoute = ({ component: Component }) => {
  const { isLoggedIn } = useContext(AuthContext);

  return isLoggedIn ? <Component /> : <Login />;
};

export default App;
