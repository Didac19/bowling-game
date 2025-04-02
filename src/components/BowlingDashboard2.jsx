import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, Trophy, UserPlus, Play } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import { motion, AnimatePresence } from 'framer-motion';

const PlayerSetup = ({ players, addPlayer, startGame, newPlayerName, setNewPlayerName, handleKeyDown }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="w-full max-w-md mx-auto"
  >
    <div className="bg-gradient-to-br from-indigo-900 to-purple-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl mb-6 text-center font-bold text-white">Add Players</h2>
      <div className="mb-4 flex">
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          className="flex-grow text-black p-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter player name"
          onKeyDown={handleKeyDown}
        />
        <button onClick={addPlayer} className="bg-pink-600 hover:bg-pink-700 transition-colors px-4 py-2 rounded-r-md flex items-center">
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
            className='bg-indigo-800 px-4 py-2 text-xl rounded-md shadow'
          >
            <li>{player.name}</li>
          </motion.div>
        ))}
      </ul>
      <button
        onClick={startGame}
        className="w-full bg-pink-600 hover:bg-pink-700 transition-colors px-4 py-3 rounded-md text-lg font-semibold flex items-center justify-center"
        disabled={players.length === 0}
      >
        <Play size={24} className="mr-2" />
        Start Game
      </button>
    </div>
  </motion.div>
);

const Frame = ({ frame, frameIndex, playerIndex, handleSelectCell, isCellClickable, getCellStyle, frameScore, cellRefs }) => (
  <div className={`flex flex-col border border-indigo-600 rounded ${frameIndex === 9 ? 'col-span-2' : ''}`}>
    <div className="text-center border-b border-indigo-600 py-1 bg-indigo-800 rounded-t">{frameIndex + 1}</div>
    <div className="flex select-none">
      {frame.map((roll, rollIndex) => {
        if (frameIndex < 9 && rollIndex === 1 && frame[0] === 10) return null;
        return (
          <motion.div
            key={rollIndex}
            ref={el => {
              if (el && cellRefs) {
                cellRefs.current[`${playerIndex}-${frameIndex}-${rollIndex}`] = el;
              }
            }}
            whileHover={isCellClickable(playerIndex, frameIndex, rollIndex) ? { scale: 1.1 } : {}}
            className={`${getCellStyle(playerIndex, frameIndex, rollIndex, roll, isCellClickable(playerIndex, frameIndex, rollIndex))} flex-1 ${frameIndex === 9 ? 'w-1/3' : 'w-1/2'}`}
            onClick={() => isCellClickable(playerIndex, frameIndex, rollIndex) && handleSelectCell(playerIndex, frameIndex, rollIndex)}
          >
            {roll === 10 ? 'X' : roll === '/' ? '/' : roll !== null ? roll : ''}
          </motion.div>
        );
      })}
    </div>
    <div className="text-center border-t border-indigo-600 py-1 bg-indigo-700 rounded-b">
      {frameScore !== null ? frameScore : ''}
    </div>
  </div>
);

const Scoreboard = ({ players, handleSelectCell, isCellClickable, getCellStyle, selectedCell, cellRefs }) => {
  // Reorder players array to show active player first
  const reorderedPlayers = selectedCell.playerIndex !== null
    ? [
      players[selectedCell.playerIndex],
      ...players.slice(selectedCell.playerIndex + 1),
      ...players.slice(0, selectedCell.playerIndex)
    ]
    : players;

  return (
    <div className="w-full lg:w-3/4 pr-4">
      <AnimatePresence mode="popLayout">
        {reorderedPlayers.map((player, index) => {
          const originalIndex = players.indexOf(player);
          const isActive = originalIndex === selectedCell.playerIndex;

          return (
            <motion.div
              key={player.name}
              className="mb-6"
              layout
              initial={{ opacity: 0.8, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  delay: index * 0.05
                }
              }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                layout: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }
              }}
            >
              <div className="flex items-center mb-2">
                <motion.div
                  className={`w-1/6 font-bold text-center border-l-2 rounded-l-md border-indigo-500 py-2 ${isActive ? 'bg-pink-600' : 'bg-indigo-800'}`}
                  animate={{
                    backgroundColor: isActive ? '#db2777' : '#4338ca',
                    transition: { duration: 0.3 }
                  }}
                >
                  {player.name}
                </motion.div>
                <div className="flex-1 grid grid-cols-11 gap-1">
                  {player.frames.map((frame, frameIndex) => (
                    <Frame
                      key={frameIndex}
                      frame={frame}
                      frameIndex={frameIndex}
                      playerIndex={originalIndex}
                      handleSelectCell={handleSelectCell}
                      isCellClickable={isCellClickable}
                      getCellStyle={getCellStyle}
                      frameScore={player.frameScores && player.frameScores[frameIndex]}
                      cellRefs={cellRefs}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

const Leaderboard = ({ sortedPlayers }) => (
  <div className="w-full lg:w-1/4 mt-6 lg:mt-0">
    <div className="bg-gradient-to-br from-indigo-900 to-purple-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-2xl mb-4 font-bold text-center">Marcador</h3>
      {sortedPlayers.map((player, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex justify-between items-center mb-2 p-3 rounded ${index === 0 ? "bg-amber-600" : "bg-indigo-800"}`}
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

const ScoreModal = ({ handleSelectScore, handleReturnButton, getAvailableScores, selectedCell, position }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-gradient-to-br from-indigo-900 to-purple-800 p-4 rounded-lg shadow-lg absolute z-50"
      style={{
        top: `${position.top - 10}px`,
        left: `${position.left}px`,
        transform: 'translateY(-100%)'
      }}
    >
      <div className="flex justify-end mb-2">
        <button onClick={handleReturnButton} className="text-white hover:text-gray-300 transition-colors">
          <X size={20} />
        </button>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {getAvailableScores(selectedCell.playerIndex, selectedCell.frameIndex, selectedCell.rollIndex).map((score) => (
          <motion.button
            key={score}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-600 hover:bg-indigo-700 transition-colors px-3 py-2 rounded-md text-base font-semibold"
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
  const [isGameOver, setIsGameOver] = useState(false);
  const [width, height] = useWindowSize();
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const cellRefs = React.useRef({});

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([...players, {
        name: newPlayerName,
        frames: Array(9).fill([null, null]).concat([[null, null, null]]),
        frameScores: Array(10).fill(null),
        totalScore: 0
      }]);
      setNewPlayerName('');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      addPlayer();
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

      // Get the position of the selected cell
      const cellKey = `${playerIndex}-${frameIndex}-${rollIndex}`;
      const cellElement = cellRefs.current[cellKey];

      if (cellElement) {
        const rect = cellElement.getBoundingClientRect();
        setModalPosition({
          top: rect.top,
          left: rect.left + (rect.width / 2)
        });
      }

      setShowScoreModal(true);
    }
  };

  const isCellClickable = (playerIndex, frameIndex, rollIndex) => {
    if (isGameOver || !gameStarted) return false;
    return (
      playerIndex === selectedCell.playerIndex &&
      frameIndex === selectedCell.frameIndex &&
      rollIndex === selectedCell.rollIndex
    );
  };

  const getCellStyle = (playerIndex, frameIndex, rollIndex, roll, clickable) => {
    let classes = "border border-indigo-700 px-2 py-1 w-8 h-8 text-center ";
    if (roll !== null) {
      classes += "bg-indigo-900 text-gray-200 ";
    }
    if (clickable) {
      classes += "cursor-pointer hover:bg-indigo-800 ";
    } else {
      classes += "cursor-not-allowed ";
    }
    if (
      selectedCell.playerIndex === playerIndex &&
      selectedCell.frameIndex === frameIndex &&
      selectedCell.rollIndex === rollIndex
    ) {
      classes += "bg-pink-700 ";
    }
    return classes.trim();
  };

  const handleSelectScore = (score) => {
    const { playerIndex, frameIndex, rollIndex } = selectedCell;
    if (playerIndex === null || frameIndex === null || rollIndex === null) return;

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
          newFrame[1] = firstRoll + score === 10 ? '/' : score;
        } else {
          newFrame[0] = score;
        }
      } else {
        if (rollIndex === 0) {
          newFrame[0] = score;
        } else if (rollIndex === 1) {
          if (newFrame[0] === 10) {
            newFrame[1] = score;
          } else if (newFrame[0] + score === 10) {
            newFrame[1] = '/';
          } else if (newFrame[0] + score < 10) {
            newFrame[1] = score;
          } else {
            alert("Invalid score in 10th frame unless first roll is a strike.");
            return prevPlayers;
          }
        } else if (rollIndex === 2) {
          newFrame[2] = score;
        }
      }

      newFrames[frameIndex] = newFrame;
      const { totalScore, frameScores } = calculateScore(newFrames);
      newPlayers[playerIndex] = {
        ...newPlayers[playerIndex],
        frames: newFrames,
        frameScores: frameScores,
        totalScore: totalScore
      };

      let nextPlayerIndex = playerIndex;
      let nextFrameIndex = frameIndex;
      let nextRollIndex = rollIndex;

      if (frameIndex < 9) {
        if (rollIndex === 0 && newFrame[0] !== 10) {
          nextRollIndex = 1;
        } else {
          nextPlayerIndex = (playerIndex + 1) % players.length;
          nextFrameIndex = nextPlayerIndex === 0 ? frameIndex + 1 : frameIndex;
          nextRollIndex = 0;
        }
      } else {
        if (rollIndex === 0) {
          nextRollIndex = 1;
        } else if (rollIndex === 1) {
          if (newFrame[0] === 10 || newFrame[1] === '/') {
            nextRollIndex = 2;
          } else {
            nextPlayerIndex = (playerIndex + 1) % players.length;
            nextFrameIndex = 9;
            nextRollIndex = 0;
          }
        } else if (rollIndex === 2) {
          nextPlayerIndex = (playerIndex + 1) % players.length;
          nextFrameIndex = 9;
          nextRollIndex = 0;
        }
      }

      if (nextPlayerIndex === 0 && nextFrameIndex === 10) {
        setIsGameOver(true);
      } else {
        setSelectedCell({ playerIndex: nextPlayerIndex, frameIndex: nextFrameIndex, rollIndex: nextRollIndex });
      }

      const allCellsFilled = newPlayers.every(player =>
        player.frames.every((frame, index) => {
          if (index < 9) {
            return frame[0] !== null && (frame[0] === 10 || frame[1] !== null);
          } else {
            const [roll1, roll2, roll3] = frame;
            return roll1 !== null && roll2 !== null &&
              (roll1 === 10 || roll2 === '/' ? roll3 !== null : true);
          }
        })
      );
      if (allCellsFilled) {
        setIsGameOver(true);
      }

      return newPlayers;
    });
    setShowScoreModal(false);
  };

  const calculateScore = (frames) => {
    let score = 0;
    const frameScores = Array(10).fill(null);

    for (let i = 0; i < frames.length; i++) {
      // Skip incomplete frames
      if (i < 9) {
        // Regular frames (1-9)
        const [roll1, roll2] = frames[i];

        // Skip if first roll is not filled yet
        if (roll1 === null) break;

        // Strike
        if (roll1 === 10) {
          // Need two more rolls for strike bonus
          let bonusRolls = [];

          // Look ahead to next frame
          if (i + 1 < frames.length) {
            const nextFrame = frames[i + 1];
            if (nextFrame[0] !== null) {
              bonusRolls.push(nextFrame[0] === 10 ? 10 : nextFrame[0]);

              // If next roll is also a strike, need to look one more roll ahead
              if (nextFrame[0] === 10) {
                if (i + 2 < 9 && frames[i + 2][0] !== null) {
                  bonusRolls.push(frames[i + 2][0]);
                } else if (i + 1 === 9 && nextFrame[1] !== null) {
                  bonusRolls.push(nextFrame[1] === '/' ? 10 - nextFrame[0] : nextFrame[1]);
                }
              } else if (nextFrame[1] !== null) {
                bonusRolls.push(nextFrame[1] === '/' ? 10 - nextFrame[0] : nextFrame[1]);
              }
            }
          }

          // Only count frame if we have both bonus rolls for a strike
          if (bonusRolls.length === 2) {
            score += 10 + bonusRolls[0] + bonusRolls[1];
            frameScores[i] = score;
          } else {
            break; // Not enough info to score this frame yet
          }
        }
        // Spare
        else if (roll2 === '/') {
          // Need one more roll for spare bonus
          let bonusRoll = null;

          // Look ahead to next frame
          if (i + 1 < frames.length && frames[i + 1][0] !== null) {
            bonusRoll = frames[i + 1][0];
          }

          // Only count frame if we have the bonus roll for a spare
          if (bonusRoll !== null) {
            score += 10 + bonusRoll;
            frameScores[i] = score;
          } else {
            break; // Not enough info to score this frame yet
          }
        }
        // Open frame
        else if (roll2 !== null) {
          score += roll1 + roll2;
          frameScores[i] = score;
        } else {
          break; // Second roll not filled yet
        }
      } else {
        // 10th frame special rules
        const [roll1, roll2, roll3] = frames[i];

        // Need at least first two rolls
        if (roll1 === null || roll2 === null) break;

        // Strike or spare in 10th frame needs third roll
        if ((roll1 === 10 || roll2 === '/') && roll3 === null) break;

        // Calculate 10th frame score
        let frameScore = roll1;

        if (roll2 === '/') {
          frameScore = 10;
        } else {
          frameScore += roll2;
        }

        if (roll3 !== null) {
          if (roll3 === '/') {
            frameScore += (10 - roll2);
          } else {
            frameScore += roll3;
          }
        }

        score += frameScore;
        frameScores[i] = score;
      }
    }

    return { totalScore: score, frameScores };
  };

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
    setIsGameOver(false);
  };

  const resetGame = () => {
    const resetPlayers = players.map(player => ({
      ...player,
      frames: Array(9).fill([null, null]).concat([[null, null, null]]),
      totalScore: 0
    }));
    setPlayers(resetPlayers);
    setSelectedCell({ playerIndex: 0, frameIndex: 0, rollIndex: 0 });
    setIsGameOver(false);
  };

  const sortedPlayers = [...players].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="p-6 text-white font-bold min-h-screen">
      <AnimatePresence>
        {!gameStarted ? (
          <PlayerSetup
            players={players}
            addPlayer={addPlayer}
            startGame={startGame}
            newPlayerName={newPlayerName}
            setNewPlayerName={setNewPlayerName}
            handleKeyDown={handleKeyDown}
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
                className="bg-indigo-600 hover:bg-indigo-700 transition-colors px-4 py-2 rounded-md flex items-center"
              >
                <ArrowLeft size={24} className="mr-2" />
                Volver
              </motion.button>
            </div>

            <div className="flex flex-col lg:flex-row">
              <Scoreboard
                players={players}
                handleSelectCell={handleSelectCell}
                isCellClickable={isCellClickable}
                getCellStyle={getCellStyle}
                selectedCell={selectedCell}
                cellRefs={cellRefs}
              />
              <Leaderboard sortedPlayers={sortedPlayers} />
            </div>

            <AnimatePresence>
              {showScoreModal && (
                <ScoreModal
                  handleSelectScore={handleSelectScore}
                  handleReturnButton={handleReturnButton}
                  getAvailableScores={getAvailableScores}
                  selectedCell={selectedCell}
                  position={modalPosition}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isGameOver && (
                <>
                  {/* Darkened background overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center"
                    onClick={() => setIsGameOver(false)}
                  >
                    {/* Modal content */}
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.9 }}
                      transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
                      className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-indigo-900 font-extrabold rounded-lg shadow-lg px-8 py-4 border-4 border-amber-300 flex flex-col items-center z-50 max-w-md relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setIsGameOver(false)}
                        className="absolute top-2 right-2 text-indigo-900 hover:text-indigo-700 transition-colors"
                      >
                        <X size={24} />
                      </button
                      >
                      <div className="flex items-center mb-2">
                        <Trophy size={32} className="text-amber-600 mr-3" />
                        <h2 className="text-3xl uppercase tracking-wider">¡Campeón!</h2>
                        <Trophy size={32} className="text-amber-600 ml-3" />
                      </div>
                      <p className="text-2xl">{sortedPlayers[0].name}</p>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.2, 1] }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="mt-2 bg-indigo-800 text-white px-4 py-1 rounded-full text-xl">
                        {sortedPlayers[0].totalScore} puntos
                      </motion.div>
                      <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />
                    </motion.div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {isGameOver && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center mt-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetGame}
                  className="bg-pink-600 hover:bg-pink-700 transition-colors px-6 py-3 rounded-md text-lg font-semibold"
                >
                  Reiniciar
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BowlingDashboard;