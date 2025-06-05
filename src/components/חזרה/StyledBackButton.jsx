

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StyledBackButton.css';


const StyledBackButton = ()=>{ 
 
  const navigate = useNavigate();

  const goToHome = () => {
        navigate(`/`);
        window.location.reload();
      }
   



  return (



    <button 
      onClick={goToHome}
      className={`styled-back-button`}
      type="button"
    >
      <span className="back-button-icon">←</span>
      <span className="back-button-text">חזרה לדף הבית</span>
    </button>
  );
};



export default StyledBackButton;