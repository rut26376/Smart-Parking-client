import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Container } from "@mui/material";
import { Home, ArrowBack } from "@mui/icons-material";
import "./pageNotFound.css";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <Container className="not-found-container">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
          textAlign: "center",
          padding: 1,
          marginTop: 10,
        }}
      >
        <div className="error-code">404</div>
        
        <Typography variant="h4" component="h1" gutterBottom>
          הדף לא נמצא
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4 }}>
          מצטערים, הדף שחיפשת אינו קיים.
        </Typography>
        
        <div className="buttons-container">
          <Button
            variant="contained"
            color="primary"
            startIcon={<Home />}
            onClick={() => navigate("/")}
            sx={{ m: 1 }}
          >
            חזרה לדף הבית
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{ m: 1 }}
          >
            חזרה לדף הקודם
          </Button>
        </div>
      </Box>
    </Container>
  );
};

export default PageNotFound;
