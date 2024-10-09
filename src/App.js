import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './Screen Routing/HomePage';
import AddBillPage from './Screen Routing/AddBillPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/add_bill" element={<AddBillPage />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
