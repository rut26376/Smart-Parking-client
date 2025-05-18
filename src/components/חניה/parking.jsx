  import React, { useEffect, useState, useRef } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { getAllParkingThunk } from "../../redux/Thunks/getParkingsThunk";
  import './parking.css'
  import { addRoutineThunk } from "../../redux/Thunks/addRoutineThunk";
  import { findDriverCarThunk } from "../../redux/Thunks/findDriverCarThunk";
  import { useNavigate } from "react-router-dom";
  import { getPriceThunk } from "../../redux/Thunks/getPriceThunk";
  import { getCarExists } from "../../redux/Thunks/getCarExists";
  import { setEnter } from "../../redux/slices/parkingSlice";
  import { Check, LocalParking, DirectionsCar, ExitToApp, Search, Payment, Info, ArrowForward, ArrowBack } from "@mui/icons-material";
  import {
      Box,
      Button,
      TextField,
      Typography,
      Container,
      Card,
      CardContent,
      Grid,
      AppBar,
      Toolbar,
      IconButton,
      Tabs,
      Tab,
      InputAdornment,
      Snackbar,
      Alert,
      Fade,
      Grow,
      Divider,
      Chip
  } from "@mui/material";
  export const Parking = () => {
      const navigate = useNavigate()
      const dispatch = useDispatch();
      const parkings = useSelector(state => state.parking.carParkings);
      const current = useSelector(state => state.routine.currentCode);
      const price = useSelector(state => state.routine.price);
      const available = useSelector(state => state.parking.avilable);
      const licensePlate = useSelector(state => state.driver.licensePlate)
      const enter = useSelector(state => state.parking.enter)
      const successCreate = useSelector(state => state.routine.successCreate);
      const [i, setI] = useState(0)
      const [secondss, setSeconds] = useState(new Date().getSeconds())
      const [showLegend, setShowLegend] = useState(true);
      const [highlightedSpot, setHighlightedSpot] = useState(null);
      const parkingGridRef = useRef(null);
      const [searchState, setSearchState] = useState("initial");
    
      useEffect(() => {
          const timerr = setInterval(() => {
              if (new Date().getSeconds() - 10 >= secondss) {
                  clearInterval(timerr);
              }
          }, 2000);
        
          // נקה את ה-interval כשהקומפוננטה מתפרקת
          return () => clearInterval(timerr);
      }, [secondss]);

      // תקן את הפונקציה aaa
      const aaa = () => {
          setSeconds(new Date().getSeconds());
          // אין צורך לנקות את timerr כאן כי הוא מוגדר בתוך useEffect
      };
    
      let routine = { licensePlate: licensePlate, parkingCode: available.code }
      useEffect(() => {
          window.addEventListener('click', aaa)
          dispatch(getAllParkingThunk("P1"));
        
          return () => window.removeEventListener('click', aaa);
      }, [])
    
      useEffect(() => {
          let color = setInterval(() => {
              setI(i + 1);
              clearInterval(color)
          }, 500)
      }, [i])
    
      // איפוס מצב החיפוש כאשר משתנה ה-current משתנה
      useEffect(() => {
          if (current === -1) {
              setSearchState("initial");
          }
      }, [current]);
    
      // פונקציה להדגשת מסלול לחניה - גרסה משופרת
      const highlightPathToParking = (spotId) => {
          console.log("מדגיש מסלול לחניה:", spotId);

          if (!parkingGridRef.current || !spotId) {
              console.log("אין אלמנט חניה או קוד חניה");
              return;
          }

          // הסרת מסלול קודם אם קיים
          const existingPath = document.querySelector('.highlighted-path');
          if (existingPath) {
              existingPath.remove();
          }

          // יצירת אלמנט למסלול המודגש
          const pathElement = document.createElement('div');
          pathElement.className = 'highlighted-path';
          pathElement.style.position = 'absolute';
          pathElement.style.top = '0';
          pathElement.style.left = '0';
          pathElement.style.width = '100%';
          pathElement.style.height = '100%';
          pathElement.style.pointerEvents = 'none';
          pathElement.style.zIndex = '20';

          // מציאת מיקום החניה המבוקשת
          let spotElement = null;
          document.querySelectorAll('.cp').forEach(el => {
              const spotNumber = el.querySelector('.spot-number');
              if (spotNumber && spotNumber.textContent === spotId.toString()) {
                  spotElement = el;
              }
          });

          if (!spotElement) {
              console.log("לא נמצא אלמנט חניה עם קוד:", spotId);
              return;
          }

          console.log("נמצא אלמנט חניה:", spotElement);

          // הדגשת החניה המבוקשת
          spotElement.classList.add('highlighted-spot');

          const spotRect = spotElement.getBoundingClientRect();
          const parkingRect = parkingGridRef.current.getBoundingClientRect();

          // חישוב המיקום היחסי של החניה בתוך אזור החניה
          const relativeX = (spotRect.left + spotRect.width / 2 - parkingRect.left) / parkingRect.width;
          const relativeY = (spotRect.top + spotRect.height / 2 - parkingRect.top) / parkingRect.height;

          console.log("מיקום יחסי:", relativeX, relativeY);

          // מיקומי הכבישים בדיוק כפי שהם מוגדרים ב-CSS
          const topRoadY = 0.015;       // top: 15px בערך 1.5% מגובה החניון
          const middleRoad1Y = 0.33;    // top: 33%
          const middleRoad2Y = 0.66;    // top: 66%
          const bottomRoadY = 0.97;     // top: 97%

          // ערכים מדויקים מה-CSS
          const leftEdgeX = 0.01;       // left: 1% - מהקוד .path-left
          const rightEdgeX = 0.99;      // left: 99% - מהקוד .path-right-1

          // נקודת התחלה - כניסה
          // לפי ה-CSS, הכניסה נמצאת ב-7% מהצד השמאלי של הכביש העליון
          const entranceX = 0.07;       // left: 7% - מהקוד .path-top

          // קביעת נקודות המסלול בדיוק על קווי הכביש
          const pathPoints = [];  // הגדרת המשתנה pathPoints

          // נקודת התחלה - כניסה
          pathPoints.push({ x: entranceX, y: topRoadY });

          // זיהוי השורה של החניה (0-5)
          const row = Math.floor(relativeY * 6);

          // זיהוי אם החניה בשורה זוגית או אי-זוגית (חשוב לקביעת כיוון הגישה)
          const isEvenRow = row % 2 === 0;

          // בחירת המסלול הקצר ביותר שעובר רק על קווי הכביש
          // ומתחשב בכך שהכניסה לחניה היא רק מהצד הלא צמוד

          if (row < 2) {
              // חניות בשורות העליונות (0-1)
              // בשורה 0 (זוגית) - הכניסה מלמעלה
              // בשורה 1 (אי-זוגית) - הכניסה מלמטה

              if (isEvenRow) {
                  // שורה 0 - כניסה מלמעלה
                  pathPoints.push({ x: relativeX, y: topRoadY });
                  pathPoints.push({ x: relativeX, y: relativeY });
              } else {
                  // שורה 1 - כניסה מלמטה (מהכביש האמצעי העליון)
                  pathPoints.push({ x: rightEdgeX, y: topRoadY });
                  pathPoints.push({ x: rightEdgeX, y: middleRoad1Y });
                  pathPoints.push({ x: relativeX, y: middleRoad1Y });
                  pathPoints.push({ x: relativeX, y: relativeY });
              }
          } else if (row < 4) {
              // חניות בשורות האמצעיות (2-3)
              // בשורה 2 (זוגית) - הכניסה מלמעלה
              // בשורה 3 (אי-זוגית) - הכניסה מלמטה

              if (isEvenRow) {
                  // שורה 2 - כניסה מלמעלה (מהכביש האמצעי העליון)
                  pathPoints.push({ x: leftEdgeX, y: topRoadY });
                  pathPoints.push({ x: leftEdgeX, y: middleRoad1Y });
                  pathPoints.push({ x: relativeX, y: middleRoad1Y });
                  pathPoints.push({ x: relativeX, y: relativeY });
              } else {
                  // שורה 3 - כניסה מלמטה (מהכביש האמצעי התחתון)
                  pathPoints.push({ x: leftEdgeX, y: topRoadY });
                  pathPoints.push({ x: leftEdgeX, y: middleRoad2Y });
                  pathPoints.push({ x: relativeX, y: middleRoad2Y });
                  pathPoints.push({ x: relativeX, y: relativeY });
              }
          } else {
              // חניות בשורות התחתונות (4-5)
              // בשורה 4 (זוגית) - הכניסה מלמעלה
              // בשורה 5 (אי-זוגית) - הכניסה מלמטה

              if (isEvenRow) {
                  // שורה 4 - כניסה מלמעלה (מהכביש האמצעי התחתון)
                  pathPoints.push({ x: rightEdgeX, y: topRoadY });
                  pathPoints.push({ x: rightEdgeX, y: middleRoad1Y });
                  pathPoints.push({ x: rightEdgeX, y: middleRoad2Y });
                  pathPoints.push({ x: relativeX, y: middleRoad2Y });
                  pathPoints.push({ x: relativeX, y: relativeY });
              } else {
                  // שורה 5 - כניסה מלמטה (מהכביש התחתון)
                  pathPoints.push({ x: rightEdgeX, y: topRoadY });
                  pathPoints.push({ x: rightEdgeX, y: middleRoad1Y });
                  pathPoints.push({ x: rightEdgeX, y: middleRoad2Y });
                  pathPoints.push({ x: rightEdgeX, y: bottomRoadY });
                  pathPoints.push({ x: rightEdgeX, y: bottomRoadY });
                  pathPoints.push({ x: rightEdgeX, y: bottomRoadY });
                  pathPoints.push({ x: rightEdgeX, y: bottomRoadY });
                  pathPoints.push({ x: relativeX, y: relativeY });
              }
          }

          // יצירת קווי המסלול
          for (let i = 0; i < pathPoints.length - 1; i++) {
              const start = pathPoints[i];
              const end = pathPoints[i + 1];

              // קביעה אם הקו אופקי או אנכי
              const isHorizontal = Math.abs(end.y - start.y) < 0.01;

              const lineElement = document.createElement('div');
              lineElement.className = `path-highlight-line ${isHorizontal ? 'horizontal' : 'vertical'}`;

              if (isHorizontal) {
                  // קו אופקי
                  const left = Math.min(start.x, end.x) * 100;
                  const width = Math.abs(end.x - start.x) * 100;

                  lineElement.style.left = `${left}%`;
                  lineElement.style.top = `${start.y * 100}%`;
                  lineElement.style.width = `${width}%`;
                  lineElement.style.height = '5px';
              } else {
                  // קו אנכי
                  const top = Math.min(start.y, end.y) * 100;
                  const height = Math.abs(end.y - start.y) * 100;

                  lineElement.style.left = `${start.x * 100}%`;
                  lineElement.style.top = `${top}%`;
                  lineElement.style.height = `${height}%`;
                  lineElement.style.width = '5px';
              }

              // הוספת סגנון ישירות לאלמנט
              lineElement.style.position = 'absolute';
              lineElement.style.backgroundColor = 'rgba(16, 185, 129, 0.7)';
              lineElement.style.zIndex = '15';
              lineElement.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.5)';

              pathElement.appendChild(lineElement);
          }

          // הוספת נקודות מודגשות לאורך המסלול
          pathPoints.forEach((point, index) => {
              const pointElement = document.createElement('div');
              pointElement.className = 'path-highlight-point';
              pointElement.style.position = 'absolute';
              pointElement.style.width = '15px';
              pointElement.style.height = '15px';
              pointElement.style.backgroundColor = 'rgba(16, 185, 129, 0.9)';
              pointElement.style.borderRadius = '50%';
              pointElement.style.left = `${point.x * 100}%`;
              pointElement.style.top = `${point.y * 100}%`;
              pointElement.style.transform = 'translate(-50%, -50%)';
              pointElement.style.zIndex = '16';
              pointElement.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.7)';
              pointElement.style.animation = 'pulse-highlight 1s infinite alternate';
              pointElement.style.animationDelay = `${index * 0.2}s`;

              pathElement.appendChild(pointElement);
          });

          // הוספת המסלול לאזור החניה
          parkingGridRef.current.appendChild(pathElement);

          // הוספת תיאור טקסטואלי של המסלול
          const instructionsElement = document.createElement('div');
          instructionsElement.className = 'path-instructions';
          instructionsElement.style.position = 'absolute';
          instructionsElement.style.bottom = '10px';
          instructionsElement.style.left = '10px';
          instructionsElement.style.backgroundColor = 'rgba(16, 185, 129, 0.9)';
          instructionsElement.style.color = 'white';
          instructionsElement.style.padding = '10px';
          instructionsElement.style.borderRadius = '5px';
          instructionsElement.style.zIndex = '25';
          instructionsElement.style.maxWidth = '300px';
          instructionsElement.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
          instructionsElement.style.direction = 'rtl';
          instructionsElement.style.textAlign = 'right';

          // יצירת הוראות ניווט בהתאם למסלול
          let instructions = '<strong>הוראות הגעה לחניה:</strong><ol>';

          if (row < 2) {
              // חניות בשורות העליונות (0-1)
              if (isEvenRow) {
                  // שורה 0 - כניסה מלמעלה
                  instructions += '<li>סע ישירות בכביש העליון עד לנקודה מעל החניה</li>';
                  instructions += '<li>רד ישירות לחניה</li>';
              } else {
                  // שורה 1 - כניסה מלמטה
                  instructions += '<li>סע ימינה בכביש העליון</li>';
                  instructions += '<li>רד בצד ימין לכביש האמצעי העליון</li>';
                  instructions += '<li>סע שמאלה עד לנקודה מתחת לחניה</li>';
                  instructions += '<li>עלה לחניה</li>';
              }
          } else if (row < 4) {
              // חניות בשורות האמצעיות (2-3)
              if (isEvenRow) {
                  // שורה 2 - כניסה מלמעלה
                  instructions += '<li>סע שמאלה בכביש העליון</li>';
                  instructions += '<li>רד בצד שמאל לכביש האמצעי העליון</li>';
                  instructions += '<li>סע ימינה עד לנקודה מעל החניה</li>';
                  instructions += '<li>רד לחניה</li>';
              } else {
                  // שורה 3 - כניסה מלמטה
                  instructions += '<li>סע שמאלה בכביש העליון</li>';
                  instructions += '<li>רד בצד שמאל לכביש האמצעי התחתון</li>';
                  instructions += '<li>סע ימינה עד לנקודה מתחת לחניה</li>';
                  instructions += '<li>עלה לחניה</li>';
              }
          } else {
              // חניות בשורות התחתונות (4-5)
              if (isEvenRow) {
                  // שורה 4 - כניסה מלמעלה
                  instructions += '<li>סע ימינה בכביש העליון</li>';
                  instructions += '<li>רד בצד ימין לכביש האמצעי העליון</li>';
                  instructions += '<li>המשך ירידה לכביש האמצעי התחתון</li>';
                  instructions += '<li>סע שמאלה עד לנקודה מעל החניה</li>';
                  instructions += '<li>רד לחניה</li>';
              } else {
                  // שורה 5 - כניסה מלמטה
                  instructions += '<li>סע ימינה בכביש העליון</li>';
                  instructions += '<li>רד בצד ימין לכביש האמצעי העליון</li>';
                  instructions += '<li>המשך ירידה לכביש האמצעי התחתון</li>';
                  instructions += '<li>המשך ירידה לכביש התחתון</li>';
                  instructions += '<li>סע שמאלה עד לנקודה מתחת לחניה</li>';
                  instructions += '<li>עלה לחניה</li>';
              }
          }

          instructions += '</ol>';
          instructionsElement.innerHTML = instructions;

          pathElement.appendChild(instructionsElement);

          // הוספת אנימציית רכב נוסע לאורך המסלול
          const carElement = document.createElement('div');
          carElement.className = 'moving-car';
          carElement.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" width="150" height="90" fill="none">
    <!-- רקע מטאלי מודרני -->
    <defs>
        <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#2c3e50;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#34495e;stop-opacity:1" />
        </linearGradient>
        
        <filter id="shadowEffect">
            <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
    </defs>

    <!-- גוף הרכב - עיצוב אווירודינמי מודרני -->
    <path 
        d="M20,50 
           Q40,30 60,25 
           Q100,20 140,25 
           Q160,30 180,50 
           Q190,60 190,70 
           L10,70 
           Q10,60 20,50" 
        fill="url(#metalGradient)" 
        filter="url(#shadowEffect)"
        stroke="#7f8c8d" 
        stroke-width="1"
    />

    <!-- חלונות בסגנון מודרני -->
    <path 
        d="M40,35 L80,35 Q90,30 100,35 Q110,40 140,35" 
        fill="#2980b9" 
        fill-opacity="0.7" 
        stroke="#3498db" 
        stroke-width="0.5"
    />

    <!-- פרטי אירודינמיקה -->
    <path 
        d="M10,65 Q20,55 30,60 
           Q40,65 50,60 
           Q60,55 70,60" 
        stroke="#34495e" 
        stroke-width="1" 
        fill="none" 
        stroke-dasharray="3,3"
    />

    <!-- גלגלים מודרניים -->
    <circle cx="50" cy="70" r="10" fill="#2c3e50" stroke="#7f8c8d" stroke-width="2"/>
    <circle cx="150" cy="70" r="10" fill="#2c3e50" stroke="#7f8c8d" stroke-width="2"/>

    <!-- פנסים קדמיים LED -->
    <path 
        d="M20,45 Q25,40 30,45 
           Q35,50 40,45" 
        stroke="#f1c40f" 
        stroke-width="3" 
        fill="none"
    />

    <!-- פנסים אחוריים מודרניים -->
    <path 
        d="M170,45 Q175,40 180,45 
           Q185,50 190,45" 
        stroke="#e74c3c" 
        stroke-width="3" 
        fill="none"
    />

    <!-- לוגו חברה דמיוני -->
    <text 
        x="100" 
        y="25" 
        text-anchor="middle" 
        fill="#ecf0f1" 
        font-size="10" 
        font-weight="bold"
    >
        SMART
    </text>
</svg>
`;
          carElement.style.position = 'absolute';
          carElement.style.width = '30px';
          carElement.style.height = '30px';
          carElement.style.backgroundColor = 'rgba(16, 185, 129, 0.9)';
          carElement.style.borderRadius = '50%';
          carElement.style.display = 'flex';
          carElement.style.alignItems = 'center';
          carElement.style.justifyContent = 'center';
          carElement.style.zIndex = '20';
          carElement.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.7)';

          // הגדרת מסלול האנימציה
          let keyframes = '';
          pathPoints.forEach((point, index) => {
              const percentage = index / (pathPoints.length - 1) * 100;
              keyframes += `${percentage}% { left: ${point.x * 100}%; top: ${point.y * 100}%; }\n`;
          });

          // יצירת סגנון אנימציה דינמי
          const styleElement = document.createElement('style');
          styleElement.textContent = `
              @keyframes move-car-custom {
                  ${keyframes}
              }
            
              @keyframes pulse-highlight {
                  0% {
                      transform: translate(-50%, -50%) scale(0.8);
                      box-shadow: 0 0 5px rgba(16, 185, 129, 0.7);
                  }
                  100% {
                      transform: translate(-50%, -50%) scale(1.2);
                      box-shadow: 0 0 15px rgba(16, 185, 129, 0.9);
                  }
              }
            
              .highlighted-spot {
                  animation: pulse-spot 1s infinite alternate;
                  z-index: 5;
                  box-shadow: 0 0 20px rgba(16, 185, 129, 0.8) !important;
              }
            
              @keyframes pulse-spot {
                  0% {
                      box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
                  }
                  100% {
                      box-shadow: 0 0 25px rgba(16, 185, 129, 1);
                  }
              }
          `;
          document.head.appendChild(styleElement);

          carElement.style.animation = 'move-car-custom 5s linear forwards';
          pathElement.appendChild(carElement);

          // הסרת ההדגשה אחרי 10 שניות
          setTimeout(() => {
              pathElement.remove();
              spotElement.classList.remove('highlighted-spot');
              styleElement.remove();
          }, 10000);
      };
    
       // אפקט לטיפול בהדגשת החניה
       useEffect(() => {
          if (highlightedSpot && parkingGridRef.current) {
              console.log("מדגיש חניה:", highlightedSpot);

              // מחפש את כל החניות
              const allSpots = parkingGridRef.current.querySelectorAll('.cp');
              let targetSpot = null;

              // מוצא את החניה המתאימה לפי המספר
              allSpots.forEach(spot => {
                  const spotNumber = spot.querySelector('.spot-number');
                  if (spotNumber && spotNumber.textContent === highlightedSpot.toString()) {
                      targetSpot = spot;
                  }
              });

              if (targetSpot) {
                  console.log("נמצאה חניה להדגשה:", targetSpot);

                  // מסיר הדגשות קודמות
                  allSpots.forEach(spot => {
                      spot.classList.remove('highlighted-spot');
                  });

                  // מדגיש את החניה הנוכחית
                  targetSpot.classList.add('highlighted-spot');

                  // יוצר מסלול מהכניסה לחניה
                  highlightPathToParking(highlightedSpot);

                  // מסיר את ההדגשה אחרי 10 שניות
                  const timer = setTimeout(() => {
                      targetSpot.classList.remove('highlighted-spot');
                      const path = parkingGridRef.current.querySelector('.highlighted-path');
                      if (path) path.remove();
                      setHighlightedSpot(null);
                  }, 10000);

                  return () => clearTimeout(timer);
              }
          }
      }, [highlightedSpot]);

      const createRoutine = () => {
          routine = { licensePlate: licensePlate, parkingCode: available.code }
          dispatch(addRoutineThunk(routine));
      }

      useEffect(() => {
          if (successCreate) {
              navigate(`/`)
              window.location.reload();
          }
      }, [successCreate])

      // Calculate available and occupied spots
      const totalSpots = parkings.length;
      const occupiedSpots = parkings.filter(p => p.used && p.code !== current).length;
      const availableSpots = totalSpots - occupiedSpots;
    
      // Render a fixed grid parking grid
      const renderParkingGrid = () => {
          // Define fixed rows and columns
          const rows = 6;
          const cols = 24;

          // Create a 2D grid to organize parking spots
          const grid = Array(rows).fill().map(() => Array(cols).fill(null));

          // Fill the grid with available parking spots
          parkings.forEach((spot, index) => {
              const row = Math.floor(index / cols);
              const col = index % cols;

              // Only add spots if they fit in our grid
              if (row < rows && col < cols) {
                  grid[row][col] = spot;
              }
          });

          // Group rows in pairs
          const rowPairs = [];
          for (let i = 0; i < rows; i += 2) {
              if (i + 1 < rows) {
                  rowPairs.push([i, i + 1]);
              } else {
                  rowPairs.push([i]);
              }
          }

          return (
              <>

                  {/* Parking Grid */}
                  <div className="carParkings" ref={parkingGridRef}>
                      {/* Entrance and Exit Indicators */}
                      <div className="parking-entrance">
                          <ArrowForward />
                          כניסה
                      </div>
                      <div className="parking-exit">
                          <ExitToApp />
                          יציאה
                      </div>

                      {/* Arrow Path from Entrance to Exit */}
                      <div className="arrow-path" style={{ padding: '0 10px' }}>
                          {/* שורה ראשונה - מהכניסה ימינה */}
                          <div className="path-arrow" style={{ position: 'absolute', top: '5px', left: '5%', '--rotation': '0deg' }}><ArrowForward /></div>
                          <div className="path-arrow" style={{ position: 'absolute', top: '5px', left: '25%', '--rotation': '0deg' }}><ArrowForward /></div>
                          <div className="path-arrow" style={{ position: 'absolute', top: '5px', left: '45%', '--rotation': '0deg' }}><ArrowForward /></div>
                          <div className="path-arrow" style={{ position: 'absolute', top: '5px', left: '65%', '--rotation': '0deg' }}><ArrowForward /></div>
                          <div className="path-arrow" style={{ position: 'absolute', top: '5px', left: '90%', '--rotation': '0deg' }}><ArrowForward /></div>

                          {/* ירידה למטה בצד ימין */}
                          <div className="path-arrow" style={{ position: 'absolute', top: '20%', right: '1%', left: 'auto', '--rotation': '90deg' }}><ArrowForward /></div>

                          {/* שורה שנייה - משמאל לימין במרווח בין זוג ראשון לשני */}
                          <div className="path-arrow" style={{ '--rotation': '180deg' }}><ArrowForward /></div>
                          <div className="path-arrow" style={{ '--rotation': '180deg' }}><ArrowForward /></div>
                          <div className="path-arrow" style={{ '--rotation': '180deg' }}><ArrowForward /></div>
                          <div className="path-arrow" style={{ '--rotation': '180deg' }}><ArrowForward /></div>
                          <div className="path-arrow" style={{ '--rotation': '180deg' }}><ArrowForward /></div>

                          {/* ירידה למטה בצד שמאל */}
                          <div className="path-arrow" style={{ '--rotation': '90deg', left: 'auto', top: '45%' }}><ArrowForward /></div>

                          {/* שורה שלישית - מימין לשמאל במרווח בין זוג שני לשלישי */}
                          <div className="path-arrow" style={{ '--rotation': '0deg' }}><ArrowForward /></div>
                          <div className="path-arrow" style={{ '--rotation': '0deg' }}><ArrowForward /></div>
                          <div className="path-arrow" style={{ '--rotation': '0deg' }}><ArrowForward /></div>
                          <div className="path-arrow" style={{ '--rotation': '0deg' }}><ArrowForward /></div>
                          <div className="path-arrow" style={{ '--rotation': '0deg' }}><ArrowForward /></div>

                          <div className="path-arrow" style={{ '--rotation': '0deg' }}><ArrowForward /></div>
                          <div className="path-arrow" style={{ '--rotation': '0deg' }}><ArrowForward /></div>
                          <div className="path-arrow" style={{ '--rotation': '0deg' }}><ArrowForward /></div>
                          <div className="path-arrow" style={{ '--rotation': '0deg' }}><ArrowForward /></div>
                          <div className="path-arrow" style={{ '--rotation': '0deg' }}><ArrowForward /></div>

                          {/* ירידה למטה בצד ימין ליציאה */}
                          <div className="path-arrow" style={{ position: 'absolute', top: '79%', right: '1%', left: 'auto', '--rotation': '90deg' }}><ArrowForward /></div>
                      </div>

                      {/* קווים מקווקווים למסלול */}
                      <div className="arrow-path-line">
                          <div className="horizontal-path path-top" style={{ position: 'absolute', top: '5px', left: '5%', width: '95%', height: '4px' }}></div>
                          <div className="vertical-path path-right-1"></div>
                          <div className="horizontal-path path-middle-1"></div>
                          <div className="vertical-path path-left"></div>
                          <div className="horizontal-path path-middle-2"></div>
                          <div className="horizontal-path path-middle-3"></div>
                      </div>

                      {/* Render row pairs */}
                      {rowPairs.map((pair, pairIndex) => (
                          <div key={`pair-${pairIndex}`} className="row-pair-container">
                              {/* First row in pair */}
                              <div className="row-container">
                                  <div className="spots-container" style={{ gap: '2px', display: 'grid', gridTemplateColumns: 'repeat(24, 1fr)' }}>
                                      {grid[pair[0]].map((spot, colIndex) => renderSpot(spot, colIndex))}
                                  </div>
                              </div>

                              {/* Second row in pair (if exists) */}
                              {pair.length > 1 && (
                                  <div className="row-container">
                                      <div className="spots-container" style={{ gap: '2px', display: 'grid', gridTemplateColumns: 'repeat(24, 1fr)' }}>
                                          {grid[pair[1]].map((spot, colIndex) => renderSpot(spot, colIndex))}
                                      </div>
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>
              </>
          );
      };

      // Helper function to render a single parking spot
      const renderSpot = (spot, colIndex) => {
          if (spot) {
              // This is a real parking spot
              const isCurrentCar = spot.code === current;
              const isSelectedSpot = spot.code === available.code;

              return (
                  <div
                      className="cp"
                      key={`spot-${colIndex}-${spot.code}`}
                      style={{
                          ...(isSelectedSpot || isCurrentCar) ?
                              { backgroundColor: isCurrentCar ? "yellow" : "rgba(14, 165, 233, 0.7)" } :
                              (spot.used && !isCurrentCar ?
                                  { backgroundColor: "red" } :
                                  { backgroundColor: "#334155" }),
                          margin: '0',
                          padding: '0',
                          border: '0',
                          boxShadow: 'none'
                      }}
                      data-status={spot.code}
                  >
                      <span className="spot-number">{spot.code}</span>
                  </div>
              );
          } else {
              // Empty spot or placeholder
              return (
                  <div
                      className="cp empty-spot"
                      key={`empty-${colIndex}`}
                      style={{
                          margin: '0',
                          padding: '0',
                          border: '0',
                          boxShadow: 'none'
                      }}
                  >
                      <span className="spot-number">{colIndex + 1}</span>
                  </div>
              );
          }
      };

      const handleSearchCar = () => {
          if (searchState === "initial") {
              dispatch(findDriverCarThunk(licensePlate));
            
              if (current && current !== -1) {
                  setHighlightedSpot(current);
              }
            
              setSearchState("found");
          } 
          else if (searchState === "found") {
              if (current && current !== -1) {
                  highlightPathToParking(current);
              }
            
              setSearchState("initial");
          }
      };

      return (
          <div className="main">
              <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '30px',
                  zIndex: 10
              }}>
                  <AppBar position="sticky" className="premium-app-bar">
                      <Toolbar>
                          <Box className="premium-logo-container">
                              <div className="premium-logo">
                                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <rect width="24" height="24" rx="12" fill="url(#paint0_linear)" />
                                      <path d="M18 12C18 8.69 15.31 6 12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12ZM8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16C9.79 16 8 14.21 8 12Z" fill="white" />
                                      <path d="M13 10H11C10.45 10 10 10.45 10 11V14C10 14.55 10.45 15 11 15H11.5V13H13C13.55 13 14 12.55 14 12V11C14 10.45 13.55 10 13 10ZM13 12H11.5V11H13V12Z" fill="white" />
                                      <path d="M10 8L9 9H15L14 8H10Z" fill="white" />
                                      <path d="M10 16L9 15H15L14 16H10Z" fill="white" />
                                      <defs>
                                          <linearGradient id="paint0_linear" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                                              <stop stopColor="#0EA5E9" />
                                              <stop offset="1" stopColor="#0369A1" />
                                          </linearGradient>
                                      </defs>
                                  </svg>
                              </div>
                          </Box>
                          <Box sx={{ flexGrow: 1 }} />
                      </Toolbar>
                  </AppBar>
              </div>

              <div className="parking-header" style={{ marginTop: '60px' }}>
                  <div className="floor-indicator" style={{ right: 'auto', left: '10px' }}>קומה P1</div>

                  <div className="parking-info">
                      <div className="info-item">
                          <span className="info-label">מקומות פנויים</span>
                          <span className="info-value">{availableSpots}</span>
                      </div>
                      <div className="info-item">
                          <span className="info-label">מקומות תפוסים</span>
                          <span className="info-value">{occupiedSpots}</span>
                      </div>
                      <div className="info-item">
                          <span className="info-label">סה"כ מקומות</span>
                          <span className="info-value">{totalSpots}</span>
                      </div>
                  </div>
              </div>

              {showLegend && (
                  <div className="parking-legend">
                      <div className="legend-item">
                          <div className="legend-color legend-available"></div>
                          <span>פנוי</span>
                      </div>
                      <div className="legend-item">
                          <div className="legend-color legend-occupied"></div>
                          <span>תפוס</span>
                      </div>
                      <div className="legend-item">
                          <div className="legend-color legend-selected"></div>
                          <span>נבחר</span>
                      </div>
                      <div className="legend-item">
                          <div className="legend-color legend-current"></div>
                          <span>הרכב שלך</span>
                      </div>
                  </div>
              )}

              {renderParkingGrid()}

              <div className="middle">
            {enter !== "true" && (
                <div>
                    {enter !== "false" && (
                        <button onClick={() => dispatch(getCarExists(licensePlate))}>
                            <DirectionsCar style={{ marginLeft: '8px' }} />
                            כניסה
                        </button>
                    )}

                    {(current !== -1 && price !== -1) && (
                        <>
                            <button onClick={handleSearchCar}>
                                <Search style={{ marginLeft: '8px' }} />
                                {searchState === "found"
                                    ? "לחץ כדי לראות את המסלול אל הרכב"
                                    : "חיפוש רכב קיים"}
                            </button>
                            <button onClick={() => { dispatch(getPriceThunk(licensePlate)) }}>
                                <Payment style={{ marginLeft: '8px' }} />
                                יציאה ותשלום
                            </button>
                        </>
                    )}

                    {enter === "false" && (
                        <div className="status-indicator error">
                            <Info style={{ marginLeft: '8px' }} />
                            הרכב שלך כבר נמצא בחניה, במקרה של תקלה אנא פנה למנהל המערכת במספר 1234
                        </div>
                    )}
                </div>
            )}

            {enter === "true" && (
                <div>
                    <button onClick={createRoutine}>
                        <Check style={{ marginLeft: '8px' }} />
                        אישור כניסה
                    </button>
                </div>
            )}

            {(current == -1 || price == -1) && <div>   ): הרכב שלך לא קיים בחניה  </div>}

            {price > 0 && navigate(`/paying`)}
        </div>
  
    </div>
           
         
      );
  };
