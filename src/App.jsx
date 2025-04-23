import './App.css'
import BowlingDashboard2 from './components/BowlingDashboard2'
import bowlingBg from './assets/bowling.jpg'
import audioManager from './utils/audioManager';

function App() {
  audioManager.preloadSounds();
  return (
    <div className='relative min-h-screen' style={{
      backgroundImage: `url(${bowlingBg})`,
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className='absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-purple-950/90'></div>
      <div className='relative z-10 select-none'>
        <BowlingDashboard2 />
      </div>
    </div>
  )
}

export default App
