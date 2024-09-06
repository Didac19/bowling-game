import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, Trophy } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
const PlayerSetup = ({ players, addPlayer, startGame, newPlayerName, setNewPlayerName }) => (
  <div className='w-full flex justify-center'>
    <div className="bg-blue-900 p-4 text-white font-bold">
      <h2 className="text-2xl mb-4">Add Players</h2>
      <div className="mb-4">
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          className="text-black p-2 rounded"
        />
        <button onClick={addPlayer} className="bg-green-700 px-4 py-2 rounded ml-2">
          Add Player
        </button>
      </div>
      <button onClick={startGame} className="bg-green-700 px-4 py-2 rounded mb-2">
        Start Game
      </button>
      <ul className="mb-4">
        {players.map((player, index) => (
          <div key={index} className='bg-green-700 px-4 py-2 mb-2 text-xl rounded-md'>
            <li>{player.name}</li>
          </div>
        ))}
      </ul>
    </div>
  </div>
);

const Frame = ({ frame, frameIndex, playerIndex, handleSelectCell, isCellClickable, getCellStyle }) => (
  <div className={`flex flex-col border border-blue-700 ${frameIndex === 9 ? 'col-span-2' : ''}`}>
    <div className="text-center border-b border-blue-700 py-1">{frameIndex + 1}</div>
    <div className="flex">
      {frame.map((roll, rollIndex) => (
        <div
          key={rollIndex}
          className={`${getCellStyle(playerIndex, frameIndex, rollIndex, roll, isCellClickable(playerIndex, frameIndex, rollIndex))} flex-1 ${frameIndex === 9 ? 'w-1/3' : 'w-1/2'}`}
          onClick={() => isCellClickable(playerIndex, frameIndex, rollIndex) && handleSelectCell(playerIndex, frameIndex, rollIndex)}
        >
          {roll === 10 ? 'X' : roll === '/' ? '/' : roll !== null ? roll : ''}
        </div>
      ))}
    </div>
  </div>
);

const Scoreboard = ({ players, handleSelectCell, isCellClickable, getCellStyle }) => (
  <div className="w-3/4 pr-4">
    {players.map((player, playerIndex) => (
      <div key={playerIndex} className="mb-4">
        <div className="flex items-center mb-2">
          <div className="w-1/6 font-bold text-center bg-blue-800 border-l-2 rounded-l-md border-blue-500 py-2">{player.name}</div>
          <div className="flex-1 grid grid-cols-11 gap-1">
            {player.frames.map((frame, frameIndex) => (
              <Frame
                key={frameIndex}
                frame={frame}
                frameIndex={frameIndex}
                playerIndex={playerIndex}
                handleSelectCell={handleSelectCell}
                isCellClickable={isCellClickable}
                getCellStyle={getCellStyle}
              />
            ))}
          </div>
          <div className="w-1/6 text-center font-bold">{player.totalScore}</div>
        </div>
      </div>
    ))}
  </div>
);


const Leaderboard = ({ sortedPlayers }) => (
  <div className="w-1/4">
    <div className="bg-blue-900 p-4 rounded">
      <h3 className="text-xl mb-2">Leaderboard</h3>
      {sortedPlayers.map((player, index) => (
        <div key={index} className={`flex justify-between items-center mb-2 p-2 rounded ${index === 0 ? "bg-yellow-600" : "bg-blue-800"}`}>
          <span>{index + 1}. {player.name}</span>
          <span className="flex items-center">
            {player.totalScore}
            {index === 0 && <Trophy size={20} color="gold" className="ml-2" />}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const ScoreModal = ({ handleSelectScore, handleReturnButton, getAvailableScores, selectedCell }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-blue-800 p-4 rounded">
      <div className="flex justify-end mb-4">
        <button onClick={handleReturnButton} className="text-white">
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
);
const BowlingDashboard = () => {
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedCell, setSelectedCell] = useState({ playerIndex: null, frameIndex: null, rollIndex: null });
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [width, height] = useWindowSize();
  
  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([...players, { name: newPlayerName, frames: [...Array(9).fill([null, null]), [null, null, null]], totalScore: 0 }]);
      setNewPlayerName('');
    }
  };

  const startGame = () => {
    if (players.length > 0) {
      setGameStarted(true);
      // Set the initial selected cell to the first player's first roll
      setSelectedCell({ playerIndex: 0, frameIndex: 0, rollIndex: 0 });
    } else {
      alert("Please add at least one player before starting the game.");
    }
  };

  const handleSelectCell = (playerIndex, frameIndex, rollIndex) => {
    if (isCellClickable(playerIndex, frameIndex, rollIndex)) {
      setSelectedCell({ playerIndex, frameIndex, rollIndex });
      setShowScoreModal(true);
    }
  };

  const isCellClickable = (playerIndex, frameIndex, rollIndex) => {
    if (isGameOver) return false;
    if (!gameStarted) return false;
    
    if (selectedCell.playerIndex === null) {
      return playerIndex === 0 && frameIndex === 0 && rollIndex === 0;
    }

    // Prevent modifying previous rolls
    if (playerIndex < selectedCell.playerIndex) return false;
    if (playerIndex === selectedCell.playerIndex && frameIndex < selectedCell.frameIndex) return false;
    if (playerIndex === selectedCell.playerIndex && frameIndex === selectedCell.frameIndex && rollIndex < selectedCell.rollIndex) return false;

    // Allow clicking on the current roll or the next available roll
    if (playerIndex === selectedCell.playerIndex && frameIndex === selectedCell.frameIndex) {
      return rollIndex === selectedCell.rollIndex || 
             (rollIndex === selectedCell.rollIndex + 1 && players[playerIndex].frames[frameIndex][selectedCell.rollIndex] !== null);
    }

    // Allow clicking on the first roll of the next frame for the current player
    if (playerIndex === selectedCell.playerIndex && frameIndex === selectedCell.frameIndex + 1) {
      return rollIndex === 0 && players[playerIndex].frames[selectedCell.frameIndex].every(roll => roll !== null);
    }

    // Allow clicking on the first roll of the first frame for the next player
    if (playerIndex === (selectedCell.playerIndex + 1) % players.length && frameIndex === 0 && rollIndex === 0) {
      return players[selectedCell.playerIndex].frames[selectedCell.frameIndex].every(roll => roll !== null);
    }

    // Special case for the 10th frame
    if (frameIndex === 9) {
      // Only allow clicking on the 10th frame if all previous frames are completed
      const allPreviousFramesCompleted = players[playerIndex].frames.slice(0, 9).every(frame => frame.every(roll => roll !== null));
      if (!allPreviousFramesCompleted) return false;

      const [roll1, roll2, roll3] = players[playerIndex].frames[9];
      if (rollIndex === 0) return roll1 === null;
      if (rollIndex === 1) return roll1 !== null && roll2 === null;
      if (rollIndex === 2) {
        return (roll1 === 10 || roll2 === '/') && roll3 === null;
      }
    }
    
    return false;
  };
  
  const getCellStyle = (playerIndex, frameIndex, rollIndex, roll, clickable) => {
    let classes = "border border-blue-700 px-2 py-1 w-8 h-8 text-center ";
    
    if (roll !== null) {
      classes += "bg-blue-900 text-gray-300 "; // Filled rolls are darker and text is slightly faded
    }
    
    if (clickable) {
      classes += "cursor-pointer hover:bg-blue-800 ";
    } else {
      classes += "cursor-not-allowed ";
    }
    
    if (
      selectedCell.playerIndex === playerIndex &&
      selectedCell.frameIndex === frameIndex &&
      selectedCell.rollIndex === rollIndex
    ) {
      classes += "bg-blue-700 ";
    }
    
    return classes.trim();
  };

  const handleSelectScore = (score) => {
    const { playerIndex, frameIndex, rollIndex } = selectedCell;
    if (playerIndex !== null && frameIndex !== null && rollIndex !== null) {
      setPlayers(prevPlayers => {
        const newPlayers = [...prevPlayers];
        const newFrames = [...newPlayers[playerIndex].frames];
        const newFrame = [...newFrames[frameIndex]];

        if (frameIndex < 9) {
          // Logic for frames 1-9 remains the same
          if (rollIndex === 1) {
            const firstRoll = newFrame[0];
            if (firstRoll !== null && firstRoll !== 10 && firstRoll + score > 10) {
              alert("Invalid score. The sum of two rolls in a frame cannot exceed 10.");
              return prevPlayers;
            }
          }
          newFrame[rollIndex] = score;

          if (rollIndex === 1 && newFrame[0] + score === 10) {
            newFrame[rollIndex] = '/';
          }
        } else {
          // 10th frame logic
          if (rollIndex === 0) {
            newFrame[rollIndex] = score;
          } else if (rollIndex === 1) {
            if (newFrame[0] === 10) {
              newFrame[rollIndex] = score;
            } else if (newFrame[0] + score === 10) {
              newFrame[rollIndex] = '/';
            } else if (newFrame[0] + score < 10) {
              newFrame[rollIndex] = score;
            } else {
              alert("Invalid score. The sum of two rolls in the 10th frame cannot exceed 10 unless the first roll is a strike.");
              return prevPlayers;
            }
          } else if (rollIndex === 2) {
            newFrame[rollIndex] = score;
          }
        }

        newFrames[frameIndex] = newFrame;
        const newTotalScore = calculateScore(newFrames);
        newPlayers[playerIndex] = { ...newPlayers[playerIndex], frames: newFrames, totalScore: newTotalScore };
        return newPlayers;
      });
      setShowScoreModal(false);
      checkGameOver();
      moveToNextCell(playerIndex, frameIndex, rollIndex);
      updateWinner();
    }
  };

  const moveToNextCell = (playerIndex, frameIndex, rollIndex) => {
    if (frameIndex < 9) {
      if (rollIndex === 0 && players[playerIndex].frames[frameIndex][0] !== 10) {
        setSelectedCell({ playerIndex, frameIndex, rollIndex: 1 });
      } else {
        const nextPlayerIndex = (playerIndex + 1) % players.length;
        setSelectedCell({ playerIndex: nextPlayerIndex, frameIndex: nextPlayerIndex === 0 ? frameIndex + 1 : frameIndex, rollIndex: 0 });
      }
    } else {
      // 10th frame logic
      const frame = players[playerIndex].frames[frameIndex];
      if (rollIndex === 0) {
        setSelectedCell({ playerIndex, frameIndex, rollIndex: 1 });
      } else if (rollIndex === 1) {
        if (frame[0] === 10 || frame[1] === '/' || (frame[0] !== null && frame[1] !== null && frame[0] + frame[1] === 10)) {
          setSelectedCell({ playerIndex, frameIndex, rollIndex: 2 });
        } else if(frame[2] !== null) {
          const nextPlayerIndex = (playerIndex + 1) % players.length;
          if (nextPlayerIndex === 0) {
            setIsGameOver(true);
          } else {
            setSelectedCell({ playerIndex: nextPlayerIndex, frameIndex: 9, rollIndex: 0 });
          }
        }
      } else {
        const nextPlayerIndex = (playerIndex + 1) % players.length;
        if (nextPlayerIndex === 0) {
          setIsGameOver(true);
        } else {
          setSelectedCell({ playerIndex: nextPlayerIndex, frameIndex: 9, rollIndex: 0 });
        }
      }
    }
  };

  const calculateScore = (frames) => {
    let score = 0;
    for (let i = 0; i < frames.length; i++) {
      const [roll1, roll2, roll3] = frames[i];
      if (i < 9) {
        if (roll1 !== null) score += roll1;
        if (roll2 === '/') score += (10 - roll1);
        else if (roll2 !== null) score += roll2;
      } else {
        if (roll1 !== null) score += roll1;
        if (roll2 === '/') score += (10 - roll1);
        else if (roll2 !== null) score += roll2;
        if (roll3 !== null && (roll1 === 10 || roll2 === '/' || roll2 === 10)) score += roll3;
      }
    }
    return score;
  };

  const updateWinner = () => {
    if (!isGameOver) {
      let maxScore = -1;
      let maxIndex = -1;
      players.forEach((player, index) => {
        if (player.totalScore > maxScore) {
          maxScore = player.totalScore;
          maxIndex = index;
        }
      });
      setWinnerIndex(maxIndex);
    }
  };

  const checkGameOver = () => {
    const allCellsFilled = players.every(player => 
      player.frames.every((frame, index) => 
        index < 9 ? frame.every(roll => roll !== null) : frame[0] !== null && frame[1] !== null && (frame[2] !== null || frame[1] !== '/')
      )
    );
    setIsGameOver(allCellsFilled);
  };

  useEffect(() => {
    updateWinner();
    checkGameOver();
  }, [players]);

  const getAvailableScores = (playerIndex, frameIndex, rollIndex) => {
    if (frameIndex === 9) {
      const frame = players[playerIndex].frames[frameIndex];
      if (rollIndex === 0) {
        return [...Array(11)].map((_, i) => i); // First roll in the 10th frame
      } else if (rollIndex === 1) {
        if (frame[0] === 10) {
          return [...Array(11)].map((_, i) => i); // Second roll, first was a strike
        } else {
          return [...Array(11 - frame[0])].map((_, i) => i); // Second roll, show remaining for a spare
        }
      } else if (rollIndex === 2) {
        return [...Array(11)].map((_, i) => i); // Third roll, all numbers available
      }
    }
  
    if (rollIndex === 0) {
      return [...Array(11)].map((_, i) => i); // First roll in frames 1-9
    } else {
      const firstRoll = players[playerIndex].frames[frameIndex][0];
      if (firstRoll === 10) {
        return [...Array(11)].map((_, i) => i); // Second roll, first was a strike
      } else {
        return [...Array(11 - firstRoll)].map((_, i) => i); // Second roll, show remaining for a spare
      }
    }
  };
  

  const handleReturnButton = () => {
    setShowScoreModal(false);
  };

  const returnToPlayerScreen = () => {
    setGameStarted(false);
    setPlayers([]);
    setSelectedCell({ playerIndex: null, frameIndex: null, rollIndex: null });
    setWinnerIndex(null);
    setIsGameOver(false);
  };

  const resetGame = () => {
    const resetPlayers = players.map(player => ({
      ...player,
      frames: [...Array(9).fill([null, null]), [null, null, null]],
      totalScore: 0
    }));
    setPlayers(resetPlayers);
    setSelectedCell({ playerIndex: 0, frameIndex: 0, rollIndex: 0 });
    setWinnerIndex(null);
    setIsGameOver(false);
  };
  const sortedPlayers = [...players].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="p-4 text-white font-bold min-h-fit">
      {!gameStarted ? (
        <PlayerSetup
          players={players}
          addPlayer={addPlayer}
          startGame={startGame}
          newPlayerName={newPlayerName}
          setNewPlayerName={setNewPlayerName}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4 w-full">
            <button onClick={returnToPlayerScreen} className="border border-transparent hover:border hover:border-blue-500 hover:bg-transparent bg-blue-700 px-4 py-2 rounded flex items-center">
              <ArrowLeft size={24} className="mr-2" />
              Return
            </button>
          </div>
          
          <div className="flex">
            <Scoreboard
              players={players}
              handleSelectCell={handleSelectCell}
              isCellClickable={isCellClickable}
              getCellStyle={getCellStyle}
            />
            <Leaderboard sortedPlayers={sortedPlayers} />
          </div>

          {showScoreModal && (
            <ScoreModal
              handleSelectScore={handleSelectScore}
              handleReturnButton={handleReturnButton}
              getAvailableScores={getAvailableScores}
              selectedCell={selectedCell}
            />
          )}

          <div className="flex justify-between mt-4">
            <div className="flex items-center flex-row">
              <div className="text-xl">
                {winnerIndex !== null && isGameOver ? (
                  <div>
                    <p>Winner: {players[winnerIndex].name}</p>
                    <Confetti width={width} height={height}/>
                  </div>
                ) : ''}
              </div>
            </div>
          </div>
        </>
      )}
      {isGameOver && gameStarted && (
        <div className="flex justify-center mt-4">
          <button onClick={resetGame} className="bg-blue-700 px-4 py-2 rounded">
            Reset Game
          </button>
        </div>
      )}
    </div>
  );
};

export default BowlingDashboard;