
import './App.css';
import TeamList from './pages/Teams.js'
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000/',console.log('connected'))

function App() {
  return (
    <div>
      <TeamList socket={socket} />
    </div>
  );
}

export default App;
