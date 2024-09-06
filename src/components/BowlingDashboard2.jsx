import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, Trophy, UserPlus, Play } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import { motion, AnimatePresence } from 'framer-motion';

const PlayerSetup = ({ players, addPlayer, startGame, newPlayerName, setNewPlayerName }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="w-full max-w-md mx-auto"
  >
    <div className="bg-blue-900 p-6 rounded-lg shadow-lg border-2 border-blue-400">
      <h2 className="text-3xl mb-6 text-center font-bold text-blue-300">Add Players</h2>
      <div className="mb-4 flex">
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          className="flex-grow text-blue-900 p-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter player name"
        />
        <button onClick={addPlayer} className="bg-blue-500 hover:bg-blue-600 transition-colors px-4 py-2 rounded-r-md flex items-center">
          <UserPlus size={20} className="mr-2" />
          Add
        </button>
      </div>
      <ul className="mb-6 space-y-2">
        {players.map((player, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className='bg-blue-800 px-4 py-2 text-xl rounded-md shadow text-blue-300'
          >
            <li>{player.name}</li>
          </motion.div>
        ))}
      </ul>
      <button 
        onClick={startGame} 
        className="w-full bg-blue-500 hover:bg-blue-600 transition-colors px-4 py-3 rounded-md text-lg font-semibold flex items-center justify-center text-white"
        disabled={players.length === 0}
      >
        <Play size={24} className="mr-2" />
        Start Game
      </button>
    </div>
  </motion.div>
);

const Frame = ({ frame, frameIndex, playerIndex, handleSelectCell, isCellClickable, getCellStyle }) => (
  <div className={`flex flex-col ${frameIndex === 9 ? 'col-span-2' : 'col-span-1'}`}>
    <div className="flex">
      {frame.map((roll, rollIndex) => (
        <motion.div
          key={rollIndex}
          whileHover={isCellClickable(playerIndex, frameIndex, rollIndex) ? { scale: 1.1 } : {}}
          className={`${getCellStyle(playerIndex, frameIndex, rollIndex, roll, isCellClickable(playerIndex, frameIndex, rollIndex))} flex-1 ${frameIndex === 9 ? 'w-1/3' : 'w-1/2'}`}
          onClick={() => isCellClickable(playerIndex, frameIndex, rollIndex) && handleSelectCell(playerIndex, frameIndex, rollIndex)}
        >
          {roll === 10 ? 'X' : roll === '/' ? '/' : roll !== null ? roll : ''}
        </motion.div>
      ))}
    </div>
  </div>
);

const Scoreboard = ({ players, handleSelectCell, isCellClickable, getCellStyle, currentPlayerIndex }) => (
  <div className="w-full bg-blue-900 p-6 rounded-lg shadow-lg border-2 border-blue-400">
    <div className="mb-4 grid grid-cols-12 gap-1 text-center text-sm text-blue-300">
      <div className="col-span-2">PLAYER</div>
      {[...Array(10)].map((_, i) => (
        <div key={i} className="col-span-1">{i + 1}</div>
      ))}
      <div className="col-span-1">TOTAL</div>
    </div>
    {players.map((player, playerIndex) => (
      <motion.div
        key={playerIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: playerIndex * 0.1 }}
        className={`grid grid-cols-12 gap-1 mb-2 p-2 rounded ${
          playerIndex === currentPlayerIndex ? 'bg-yellow-500 text-blue-900' : 'bg-blue-800 text-blue-300'
        }`}
      >
        <div className="col-span-2 truncate">{player.name}</div>
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
        <div className="col-span-1 flex items-center justify-center bg-blue-700">
          {player.totalScore}
        </div>
      </motion.div>
    ))}
    <div className="mt-6 flex justify-between items-end">
      <div className="flex space-x-2">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="w-4 h-8 bg-white rounded-full"
          />
        ))}
      </div>
      <div className="text-4xl font-bold text-blue-300 tracking-wider">
        STRIKE!
      </div>
      <motion.div
        initial={{ rotate: -45, x: 50 }}
        animate={{ rotate: 0, x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-2xl font-bold"
      >
        🎳
      </motion.div>
    </div>
  </div>
);

const Leaderboard = ({ sortedPlayers }) => (
  <div className="w-full mt-6">
    <div className="bg-blue-900 p-4 rounded-lg shadow-lg border-2 border-blue-400">
      <h3 className="text-2xl mb-4 font-bold text-center text-blue-300">Leaderboard</h3>
      {sortedPlayers.map((player, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex justify-between items-center mb-2 p-3 rounded ${index === 0 ? "bg-yellow-500 text-blue-900" : "bg-blue-800 text-blue-300"}`}
        >
          <span>{index + 1}. {player.name}</span>
          <span className="flex items-center">
            {player.totalScore}
            {index === 0 && <Trophy size={20} color="gold" className="ml-2" />}
          </span>
        </motion.div>
      ))}
    </div>
  </div>
);

const ScoreModal = ({ handleSelectScore, handleReturnButton, getAvailableScores, selectedCell }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.9 }}
      className="bg-blue-900 p-6 rounded-lg shadow-lg border-2 border-blue-400"
    >
      <div className="flex justify-end mb-4">
        <button onClick={handleReturnButton} className="text-blue-300 hover:text-blue-100 transition-colors">
          <X size={24} />
        </button>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {getAvailableScores(selectedCell.playerIndex, selectedCell.frameIndex, selectedCell.rollIndex).map((score) => (
          <motion.button
            key={score}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-700 hover:bg-blue-600 transition-colors px-4 py-3 rounded-md text-lg font-semibold text-blue-300"
            onClick={() => handleSelectScore(score)}
          >
            {score === 10 ? 'X' : score}
          </motion.button>
        ))}
      </div>
    </motion.div>
  </motion.div>
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
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([...players, { name: newPlayerName, frames: [...Array(9).fill([null, null]), [null, null, null]], totalScore: 0 }]);
      setNewPlayerName('');
    }
  };

  const startGame = () => {
    if (players.length > 0) {
      setGameStarted(true);
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
    if (!gameStarted) return false;
    
    if (selectedCell.playerIndex === null) {
      return playerIndex === 0 && frameIndex === 0 && rollIndex === 0;
    }

    if (playerIndex < selectedCell.playerIndex) return false;
    if (playerIndex === selectedCell.playerIndex && frameIndex < selectedCell.frameIndex) return false;
    if (playerIndex === selectedCell.playerIndex && frameIndex === selectedCell.frameIndex && rollIndex < selectedCell.rollIndex) return false;

    if (playerIndex === selectedCell.playerIndex && frameIndex === selectedCell.frameIndex) {
      return rollIndex === selectedCell.rollIndex || 
             (rollIndex === selectedCell.rollIndex + 1 && players[playerIndex].frames[frameIndex][selectedCell.rollIndex] !== null);
    }

    if (playerIndex === selectedCell.playerIndex && frameIndex === selectedCell.frameIndex + 1) {
      return rollIndex === 0 && players[playerIndex].frames[selectedCell.frameIndex].every(roll => roll !== null);
    }

    if (playerIndex === (selectedCell.playerIndex + 1) % players.length && frameIndex === 0 && rollIndex === 0) {
      return players[selectedCell.playerIndex].frames[selectedCell.frameIndex].every(roll => roll !== null);
    }

    if (frameIndex === 9) {
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
    let classes = "px-2 py-1 text-center ";
    
    if (roll !== null) {
      classes += "bg-blue-700 text-blue-300 ";
    } else {
      classes += "bg-blue-800 text-blue-300 ";
    }
    
    if (clickable) {
      classes += "cursor-pointer hover:bg-blue-600 ";
    } else {
      classes += "cursor-not-allowed ";
    }
    
    if (
      selectedCell.playerIndex === playerIndex &&
      selectedCell.frameIndex === frameIndex &&
      selectedCell.rollIndex === rollIndex
    ) {
      classes += "bg-blue-500 text-white ";
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
        setCurrentPlayerIndex(nextPlayerIndex);
      }
    } else {
      const frame = players[playerIndex].frames[frameIndex];
      if (rollIndex === 0) {
        setSelectedCell({ playerIndex, frameIndex, rollIndex: 1 });
      } else if (rollIndex === 1) {
        if (frame[0] === 10 || frame[1] === '/' || (frame[0] !== null && frame[1] !== null && frame[0] + frame[1] === 10)) {
          setSelectedCell({ playerIndex, frameIndex, rollIndex: 2 });
        } else {
          const nextPlayerIndex = (playerIndex + 1) % players.length;
          if (nextPlayerIndex === 0) {
            setIsGameOver(true);
          } else {
            setSelectedCell({ playerIndex: nextPlayerIndex, frameIndex: 9, rollIndex: 0 });
            setCurrentPlayerIndex(nextPlayerIndex);
          }
        }
      } else {
        const nextPlayerIndex = (playerIndex + 1) % players.length;
        if (nextPlayerIndex === 0) {
          setIsGameOver(true);
        } else {
          setSelectedCell({ playerIndex: nextPlayerIndex, frameIndex: 9, rollIndex: 0 });
          setCurrentPlayerIndex(nextPlayerIndex);
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
        return [...Array(11)].map((_, i) => i);
      } else if (rollIndex === 1) {
        if (frame[0] === 10) {
          return [...Array(11)].map((_, i) => i);
        } else {
          return [...Array(11 - frame[0])].map((_, i) => i);
        }
      } else if (rollIndex === 2) {
        return [...Array(11)].map((_, i) => i);
      }
    }
  
    if (rollIndex === 0) {
      return [...Array(11)].map((_, i) => i);
    } else {
      const firstRoll = players[playerIndex].frames[frameIndex][0];
      if (firstRoll === 10) {
        return [...Array(11)].map((_, i) => i);
      } else {
        return [...Array(11 - firstRoll)].map((_, i) => i);
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
    setCurrentPlayerIndex(0);
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
    setCurrentPlayerIndex(0);
  };

  const sortedPlayers = [...players].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="p-6 text-blue-300 font-bold min-h-screen bg-blue-950">
      <AnimatePresence>
        {!gameStarted ? (
          <PlayerSetup
            players={players}
            addPlayer={addPlayer}
            startGame={startGame}
            newPlayerName={newPlayerName}
            setNewPlayerName={setNewPlayerName}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-6 w-full">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={returnToPlayerScreen}
                className="bg-blue-700 hover:bg-blue-600 transition-colors px-4 py-2 rounded-md flex items-center"
              >
                <ArrowLeft size={24} className="mr-2" />
                Return
              </motion.button>
            </div>
            
            <Scoreboard
              players={players}
              handleSelectCell={handleSelectCell}
              isCellClickable={isCellClickable}
              getCellStyle={getCellStyle}
              currentPlayerIndex={currentPlayerIndex}
            />
            
            <Leaderboard sortedPlayers={sortedPlayers} />

            <AnimatePresence>
              {showScoreModal && (
                <ScoreModal
                  handleSelectScore={handleSelectScore}
                  handleReturnButton={handleReturnButton}
                  getAvailableScores={getAvailableScores}
                  selectedCell={selectedCell}
                />
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-6">
              <div className="flex items-center flex-row">
                <div className="text-2xl">
                  {winnerIndex !== null && isGameOver && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p>Winner: {players[winnerIndex].name}</p>
                      <Confetti width={width} height={height}/>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {isGameOver && gameStarted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mt-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="bg-blue-700 hover:bg-blue-600 transition-colors px-6 py-3 rounded-md text-lg font-semibold"
          >
            Reset Game
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default BowlingDashboard;