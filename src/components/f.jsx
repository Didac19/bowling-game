import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, Trophy } from 'lucide-react';

const BowlingDashboard = () => {
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedCell, setSelectedCell] = useState({ playerIndex: null, frameIndex: null, rollIndex: null });
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([...players, { name: newPlayerName, frames: Array(10).fill([null, null]), totalScore: 0 }]);
      setNewPlayerName('');
    }
  };

  const startGame = () => {
    if (players.length > 0) {
      setGameStarted(true);
    } else {
      alert("Please add at least one player before starting the game.");
    }
  };

  const handleSelectCell = (playerIndex, frameIndex, rollIndex) => {
    setSelectedCell({ playerIndex, frameIndex, rollIndex });
    setShowScoreModal(true);
  };

  const handleSelectScore = (score) => {
    const { playerIndex, frameIndex, rollIndex } = selectedCell;
    if (playerIndex !== null && frameIndex !== null && rollIndex !== null) {
      setPlayers(prevPlayers => {
        const newPlayers = [...prevPlayers];
        const newFrames = [...newPlayers[playerIndex].frames];
        const newFrame = [...newFrames[frameIndex]];

        // Check if it's a valid score for the second roll
        if (rollIndex === 1 && frameIndex < 9) {
          const firstRoll = newFrame[0];
          if (firstRoll !== null && firstRoll !== 10 && firstRoll + score > 10) {
            alert("Invalid score. The sum of two rolls in a frame cannot exceed 10.");
            return prevPlayers;
          }
        }

        newFrame[rollIndex] = score;
        newFrames[frameIndex] = newFrame;
        const newTotalScore = calculateScore(newFrames);
        newPlayers[playerIndex] = { ...newPlayers[playerIndex], frames: newFrames, totalScore: newTotalScore };
        return newPlayers;
      });
      setShowScoreModal(false);
      moveToNextCell(playerIndex, frameIndex, rollIndex);
      updateWinner();
      checkGameOver();
    }
  };

  const moveToNextCell = (playerIndex, frameIndex, rollIndex) => {
    if (rollIndex === 0 && players[playerIndex].frames[frameIndex][0] !== 10 && frameIndex < 9) {
      setSelectedCell({ playerIndex, frameIndex, rollIndex: 1 });
    } else if (frameIndex < 9) {
      setSelectedCell({ playerIndex, frameIndex: frameIndex + 1, rollIndex: 0 });
    } else if (playerIndex < players.length - 1) {
      setSelectedCell({ playerIndex: playerIndex + 1, frameIndex: 0, rollIndex: 0 });
    } else {
      setSelectedCell({ playerIndex: null, frameIndex: null, rollIndex: null });
    }
  };

  const calculateScore = (frames) => {
    let score = 0;
    for (let i = 0; i < frames.length; i++) {
      const [roll1, roll2] = frames[i];
      if (roll1 !== null) score += roll1;
      if (roll2 !== null) score += roll2;
    }
    return score;
  };

  const updateWinner = () => {
    let maxScore = -1;
    let maxIndex = -1;
    players.forEach((player, index) => {
      if (player.totalScore > maxScore) {
        maxScore = player.totalScore;
        maxIndex = index;
      }
    });
    setWinnerIndex(maxIndex);
  };

  const checkGameOver = () => {
    const allCellsFilled = players.every(player => 
      player.frames.every(frame => 
        frame.every(roll => roll !== null)
      )
    );
    setIsGameOver(allCellsFilled);
  };

  useEffect(() => {
    updateWinner();
  }, [players]);

  const getAvailableScores = (playerIndex, frameIndex, rollIndex) => {
    if (frameIndex === 9) {
      // Special rules for the 10th frame
      return [...Array(11)].map((_, i) => i);
    }

    if (rollIndex === 0) {
      // First roll of any frame
      return [...Array(11)].map((_, i) => i);
    } else {
      // Second roll of a frame
      const firstRoll = players[playerIndex].frames[frameIndex][0];
      if (firstRoll === 10) {
        // After a strike, allow any number
        return [...Array(11)].map((_, i) => i);
      } else {
        // For non-strike first rolls, limit the second roll
        return [...Array(11 - firstRoll)].map((_, i) => i);
      }
    }
  };

  if (!gameStarted) {
    return (
      <div className="bg-blue-900 p-4 text-white font-bold">
        <h2 className="text-2xl mb-4">Add Players</h2>
        <div className="mb-4">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Enter player name"
            className="px-2 py-1 text-black mr-2"
          />
          <button onClick={addPlayer} className="bg-blue-700 px-4 py-2 rounded">
            Add Player
          </button>
        </div>
        <ul className="mb-4">
          {players.map((player, index) => (
            <li key={index}>{player.name}</li>
          ))}
        </ul>
        <button onClick={startGame} className="bg-green-700 px-4 py-2 rounded">
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="bg-blue-900 p-4 text-white font-bold">
      <div className="flex justify-between items-center mb-4">
        <ArrowLeft size={24} />
        <div className="text-2xl">STRIKE</div>
        <div></div>
      </div>
      
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-blue-700 px-2 py-1">PLAYER</th>
            {[...Array(10)].map((_, i) => (
              <th key={i} className="border border-blue-700 px-2 py-1" colSpan="2">{i + 1}</th>
            ))}
            <th className="border border-blue-700 px-2 py-1">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, playerIndex) => (
            <tr key={playerIndex}>
              <td className="border border-blue-700 px-2 py-1">{player.name}</td>
              {player.frames.map((frame, frameIndex) => (
                <React.Fragment key={frameIndex}>
                  {frame.map((roll, rollIndex) => (
                    <td
                      key={rollIndex}
                      className={`border border-blue-700 px-2 py-1 w-8 h-8 text-center cursor-pointer ${
                        selectedCell.playerIndex === playerIndex &&
                        selectedCell.frameIndex === frameIndex &&
                        selectedCell.rollIndex === rollIndex
                          ? 'bg-blue-700'
                          : 'hover:bg-blue-800'
                      }`}
                      onClick={() => handleSelectCell(playerIndex, frameIndex, rollIndex)}
                    >
                      {roll === 10 ? 'X' : roll !== null ? roll : ''}
                    </td>
                  ))}
                </React.Fragment>
              ))}
              <td className="border border-blue-700 px-2 py-1 flex items-center justify-between">
                <span>{player.totalScore}</span>
                {playerIndex === winnerIndex && <Trophy size={16} color="gold" />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showScoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-blue-800 p-4 rounded">
            <div className="flex justify-end">
              <button onClick={() => setShowScoreModal(false)} className="text-white">
                <X size={24} />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {getAvailableScores(selectedCell.playerIndex, selectedCell.frameIndex, selectedCell.rollIndex).map((score) => (
                <button
                  key={score}
                  className="bg-blue-700 px-4 py-2 rounded"
                  onClick={() => handleSelectScore(score)}
                >
                  {score === 10 ? 'X' : score}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-4">
        <button className="bg-blue-700 px-4 py-2 rounded">speed</button>
        <button className="bg-blue-700 px-4 py-2 rounded">game</button>
        <button className="bg-blue-700 px-4 py-2 rounded">road</button>
      </div>

      <div className="flex justify-between mt-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white w-8 h-8 rounded-full mr-2"></div>
          ))}
          <div className="text-xl">
            {isGameOver && winnerIndex !== null ? `Winner: ${players[winnerIndex].name}` : '1st'}
          </div>
        </div>
        <div className="flex items-center">
          <div className="text-4xl mr-2">STRIKE</div>
          <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center">
            <div className="bg-white w-3 h-3 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BowlingDashboard;