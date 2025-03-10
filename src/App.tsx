import React from 'react';
import AuthPage from './pages/common/auth-page';
import './index.css'; // Tailwind styles
// import {BrowserRouter as Router , Routes ,Route ,Link} from "react-router-dom";

const App: React.FC = () => {
  return (
     <div >
      <AuthPage />
    </div>
  );
};

export default App;