import './styles/App.css';
import Gameplay from './pages/Gameplay/Gameplay';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UnsupportedScreenNotification from './globalcomponents/UnsupportedScreenNotification';

function App() {
  return (
    <div id='app'>
      <Router>
        <Routes>
          <Route path='/gameplay' element={<Gameplay />}></Route>
        </Routes>
      </Router>
      <UnsupportedScreenNotification />
    </div>
  );
}

export default App;
