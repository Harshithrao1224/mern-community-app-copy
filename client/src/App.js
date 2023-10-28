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
function App() {
  
  return (
    <div className="App">
      <Router>
        <Navbar />
        <SearchBar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/saved-posts" element={<SavedPosts />} />
          <Route path="/myposts" element={<MyPosts />} />
          <Route path="/searchresults/:searchTerm" element={<SearchResults />} />
          <Route path="/editPost/:postId" element={<EditPost/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
