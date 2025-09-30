
## Smart-Parking — Client App (React)

A modern React client for a smart parking and payments system. Built with React 18, Redux Toolkit, React Router, and MUI. This app enables drivers to view parking availability, manage vehicles and credit cards, pay for parking, and provides a manager area with reports.

### Highlights
- Clean UI with MUI and styled-components
- State management with Redux Toolkit
- Routing with React Router
- Secure API communication over HTTPS

### Features
- Authentication and driver onboarding
- Parking availability by level and “Find my car”
- Payments flow and credit card management
- Manager dashboard and reports

### Tech Stack
- React 18, React Router DOM
- Redux Toolkit, React-Redux
- MUI, styled-components

### Architecture (Client-side)
- Thunks handle async API calls to the server
- Slices store domain state (parking, payments, user)
- Components are grouped by domain modules

### Project Structure
- `src/components/*` — UI modules (e.g., `parking`, `paying`, `manager`)
- `src/redux/slices/*` — Redux slices
- `src/redux/Thunks/*` — Async API thunks
- `src/routing/*` — App routes

### Getting Started
1) Install dependencies:
```bash
npm install
```
2) Run the app in development mode:
```bash
npm start
```
The app runs at `http://localhost:3000`.

3) Build for production:
```bash
npm run build
```

### API Configuration
The client targets `https://localhost:7164` by default (server HTTPS profile). If your server port differs, update URLs in `src/redux/Thunks/*`.

Key endpoints used by thunks:
- `GET https://localhost:7164/api/Parking/GetAllParkingPlaces/{level}`
- `GET https://localhost:7164/api/Routine/GetPrice/{licensePlate}`
- `GET https://localhost:7164/api/Driver/GetDriverVehicles/{name}/{password}`
- `POST https://localhost:7164/api/Payment/AddPayment/{licensePlate}/{numOfPayments}`
- `GET https://localhost:7164/api/CPManager/isManager/{name}/{code}`
- `POST https://localhost:7164/api/CreditCards/addCreditCard`
- `POST https://localhost:7164/api/Driver/AddDriver`
- `POST https://localhost:7164/api/Routine/AddRoutine/{driverCode}`
- `GET https://localhost:7164/api/Routine/FindMyCar/{licensePlate}`
- `GET https://localhost:7164/api/Driver/getAll`
- `GET https://localhost:7164/api/Payment/GetPayments`
- `GET https://localhost:7164/api/Routine/GetCarExists/{licensePlate}`
- `GET https://localhost:7164/api/CreditCards/get/{driverCode}`

Example (curl):
```bash
curl -k https://localhost:7164/api/Parking/GetAllParkingPlaces/1
```

### Testing
```bash
npm test
```

### Screenshots / Demo
Add GIFs or screenshots here to showcase core flows.

### Challenges & What I Learned
- Coordinating client thunks with server endpoints and CORS
- Designing a clear domain-oriented folder structure
- Managing auth-like flows without full auth infra

### Roadmap
- Add environment-based API base URL configuration
- Strengthen input validation and error handling
- Add i18n (English/Hebrew toggle)

### License / Contact
Educational/internal project. For inquiries, please contact the maintainers.

### Hebrew Summary (תקציר בעברית)
אפליקציית לקוח לניהול ותשלום חניה חכמה. כוללת מסכי חניון, תשלום, וניהול, עם Redux לניהול מצב ו-MUI לעיצוב. לשימוש מקומי: `npm install` ואז `npm start`. האפליקציה פונה ל-API ב-`https://localhost:7164`. במעבר לפרודקשן מומלץ להגדיר כתובת API בסביבה ולהקשיח CORS.
