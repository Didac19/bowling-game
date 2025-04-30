import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import { AnimatePresence } from 'framer-motion';
import audioManager from '../utils/audioManager';
import { motion } from 'framer-motion';
import { ArrowLeft, X, Trophy, Play } from 'lucide-react';

import PlayerSetup from './PlayerSetup';
import Frame from './Frame';
import Scoreboard from './Scoreboard';
import Leaderboard from './Leaderboard';
import ScoreModal from './ScoreModal';

// Motivational phrases for turn changes
const motivationalPhrases = [
  '¡Tu turno para brillar!',
  '¡A meterle todo el power!',
  '¡Toma el control, crack!',
  '¡Es tu momento estelar!',
  '¡Dále, que eres imparable!',
  '¡A romper el juego, ídolo!',
  '¡Sube el vibe y arrasa!',
  '¡Lánzalo con alma de pro!',
  '¡Es ahora, saca el fuego!',
  '¡Ponte épico, es tu shot!',
];

const BowlingDashboard = () => {
  const [players, setPlayers] = useState(() => {
    const savedPlayers = localStorage.getItem('bowlingPlayers');
    return savedPlayers ? JSON.parse(savedPlayers) : [];
  });
  const [showPhrase, setShowPhrase] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  const [resetCount, setResetCount] = useState(() => {
    const savedCount = localStorage.getItem('bowlingResetCount');
    return savedCount ? parseInt(savedCount) : 0;
  });

  const resetPlayers = () => {
    setPlayers([]);
    setResetCount(0);
    localStorage.removeItem('bowlingPlayers');
    localStorage.removeItem('bowlingResetCount');
    setGameStarted(false);
    setSelectedCell({ playerIndex: null, frameIndex: null, rollIndex: null });
    setIsGameOver(false);
    setShowWinnerModal(false);
    setCurrentPhrase('');
  };
  const [gameStarted, setGameStarted] = useState(() => {
    const savedPlayers = localStorage.getItem('bowlingPlayers');
    return savedPlayers ? true : false;
  });
  const [selectedCell, setSelectedCell] = useState(() => {
    const savedCell = localStorage.getItem('bowlingSelectedCell');
    if (savedCell) {
      return JSON.parse(savedCell);
    }
    const savedPlayers = localStorage.getItem('bowlingPlayers');
    if (savedPlayers) {
      const players = JSON.parse(savedPlayers);
      // Find the next empty cell
      for (let i = 0; i < players.length; i++) {
        for (let j = 0; j < 10; j++) {
          const frame = players[i].frames[j];
          if (j === 9) {
            if (frame[0] === null) return { playerIndex: i, frameIndex: j, rollIndex: 0 };
            if (frame[1] === null) return { playerIndex: i, frameIndex: j, rollIndex: 1 };
            if ((frame[0] === 10 || frame[1] === '/') && frame[2] === null) {
              return { playerIndex: i, frameIndex: j, rollIndex: 2 };
            }
          } else {
            if (frame[0] === null) return { playerIndex: i, frameIndex: j, rollIndex: 0 };
            if (frame[0] !== 10 && frame[1] === null) return { playerIndex: i, frameIndex: j, rollIndex: 1 };
          }
        }
      }
      return { playerIndex: null, frameIndex: null, rollIndex: null };
    }
    return { playerIndex: null, frameIndex: null, rollIndex: null };
  });
  const [newPlayerName, setNewPlayerName] = useState('');
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [width, height] = useWindowSize();
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const cellRefs = React.useRef({});
  const prevPlayerIndexRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);
  // const prevPlayerIndexRef = React.useRef(null); // Track previous player for sound

  useEffect(() => {
    if (
      prevPlayerIndexRef.current !== null &&
      selectedCell.playerIndex !== null &&
      prevPlayerIndexRef.current !== selectedCell.playerIndex
    ) {
      console.log("Next player:", selectedCell.playerIndex);
      audioManager.playSound('regular', 1500);
      // Set a random motivational phrase
      const randomPhrase = players[selectedCell.playerIndex].name;
      // const randomPhrase = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];
      setCurrentPhrase(randomPhrase);
    }
    prevPlayerIndexRef.current = selectedCell.playerIndex;
  }, [selectedCell.playerIndex]);

  useEffect(() => {
    if (currentPhrase) {
      setShowPhrase(true);
      const timer = setTimeout(() => {
        setShowPhrase(false);
        if (isGameOver) {
          setIsGameOver(false);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentPhrase, isGameOver]);

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayers = [...players, {
        name: newPlayerName,
        frames: Array(9).fill([null, null]).concat([[null, null, null]]),
        frameScores: Array(10).fill(null),
        totalScore: 0
      }];
      setPlayers(newPlayers);
      localStorage.setItem('bowlingPlayers', JSON.stringify(newPlayers));
      setNewPlayerName('');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      addPlayer();
    }
  };

  const startGame = () => {
    // audioManager.preloadSounds();
    if (players.length > 0) {
      setGameStarted(true);
      setSelectedCell({ playerIndex: 0, frameIndex: 0, rollIndex: 0 });
      setCurrentPhrase(motivationalPhrases[0]); // Initial phrase
    } else {
      alert("Please add at least one player before starting the game.");
    }
  };

  const handleSelectCell = (playerIndex, frameIndex, rollIndex) => {
    if (isCellClickable(playerIndex, frameIndex, rollIndex)) {
      setSelectedCell({ playerIndex, frameIndex, rollIndex });

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
    // If game is over or not started, no cells are clickable
    if (isGameOver || !gameStarted || showWinnerModal) return false;

    // Only allow clicking on the currently selected cell
    if (playerIndex !== selectedCell.playerIndex ||
      frameIndex !== selectedCell.frameIndex ||
      rollIndex !== selectedCell.rollIndex) {
      return false;
    }

    for (let i = 0; i < frameIndex; i++) {
      const frame = players[playerIndex].frames[i];
      if (frame[0] === null || (frame[0] !== 10 && frame[1] === null)) {
        return false;
      }
    }

    if (frameIndex === 0 && playerIndex > 0) {
      const prevPlayer = players[playerIndex - 1];
      for (let i = 0; i < 10; i++) {
        const frame = prevPlayer.frames[i];
        if (i === 9) {
          if (frame[0] === null || frame[1] === null ||
            ((frame[0] === 10 || frame[1] === '/') && frame[2] === null)) {
            return false;
          }
        } else {
          if (frame[0] === null || (frame[0] !== 10 && frame[1] === null)) {
            return false;
          }
        }
      }
    }

    if (frameIndex === 9) {
      const frame = players[playerIndex].frames[9];
      if (rollIndex === 0) return true;
      if (rollIndex === 1) return frame[0] !== null;
      if (rollIndex === 2) {
        return (frame[0] === 10 || frame[1] === '/') && frame[1] !== null;
      }
      return false;
    }

    if (rollIndex === 0) return true;
    if (rollIndex === 1) {
      const frame = players[playerIndex].frames[frameIndex];
      return frame[0] !== null && frame[0] !== 10;
    }
    return false;
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

  const deletePlayer = (playerIndex) => {
    const newPlayers = players.filter((_, index) => index !== playerIndex);
    setPlayers(newPlayers);
    localStorage.setItem('bowlingPlayers', JSON.stringify(newPlayers));
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

      if (frameIndex < 9) {
        if (score === 10 && rollIndex === 0) {
          audioManager.playSound('strike');
        } else if (rollIndex === 1) {
          if (newFrame[1] === '/') {
            audioManager.playSound('spare');
          } else if (newFrame[0] + score === 0) {
            audioManager.playSound('gutter');
          }
        }
      } else {
        if (score === 10) {
          audioManager.playSound('strike');
        } else if (newFrame[1] === '/') {
          audioManager.playSound('spare');
        } else if (rollIndex === 1 && newFrame[0] + score === 0) {
          audioManager.playSound('gutter');
        }
      }

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
        setShowScoreModal(false);
        setIsGameOver(true);
        setShowWinnerModal(true);
        const winner = [...newPlayers].sort((a, b) => b.totalScore - a.totalScore)[0];
        setCurrentPhrase(`¡${winner.name} es el ganador con ${winner.totalScore} puntos!`);
        setShowPhrase(true);
      } else {
        const nextCell = { playerIndex: nextPlayerIndex, frameIndex: nextFrameIndex, rollIndex: nextRollIndex };
        setSelectedCell(nextCell);
        // Save both players and selectedCell state
        localStorage.setItem('bowlingSelectedCell', JSON.stringify(nextCell));
        const nextCellKey = `${nextPlayerIndex}-${nextFrameIndex}-${nextRollIndex}`;
        const nextCellElement = cellRefs.current[nextCellKey];

        if (nextCellElement) {
          const rect = nextCellElement.getBoundingClientRect();
          setModalPosition({
            top: rect.top,
            left: rect.left + (rect.width / 2)
          });
          setShowScoreModal(true);
        }
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
        setShowScoreModal(false);
        setIsGameOver(true);
        setShowWinnerModal(true);
        const winner = [...newPlayers].sort((a, b) => b.totalScore - a.totalScore)[0];
        setCurrentPhrase(`¡${winner.name} es el ganador con ${winner.totalScore} puntos!`);
        setShowPhrase(true);
      }

      // Save the updated game state to localStorage
      localStorage.setItem('bowlingPlayers', JSON.stringify(newPlayers));

      return newPlayers;
    });
  };

  const calculateScore = (frames) => {
    let totalScore = 0;
    const frameScores = Array(10).fill(null);

    for (let i = 0; i < 10; i++) {
      const frame = frames[i];

      if (!frame || frame[0] === null) break;

      if (i < 9) {
        if (frame[0] === 10) {
          let nextRolls = [];
          if (i + 1 < 10 && frames[i + 1][0] !== null) {
            nextRolls.push(frames[i + 1][0]);
            if (frames[i + 1][0] === 10) {
              if (i + 1 === 9) {
                if (frames[i + 1][1] !== null) {
                  nextRolls.push(frames[i + 1][1]);
                }
              } else if (i + 2 < 10 && frames[i + 2][0] !== null) {
                nextRolls.push(frames[i + 2][0]);
              } else if (i + 1 === 9 && frames[i + 1][1] !== null) {
                nextRolls.push(frames[i + 1][1]);
              }
            } else if (frames[i + 1][1] !== null) {
              nextRolls.push(frames[i + 1][1] === '/' ? 10 - frames[i + 1][0] : frames[i + 1][1]);
            }
          }
          if (nextRolls.length === 2) {
            totalScore += 10 + nextRolls[0] + nextRolls[1];
            frameScores[i] = totalScore;
          } else {
            break;
          }
        } else if (frame[1] === '/') {
          if (i + 1 < 10 && frames[i + 1][0] !== null) {
            totalScore += 10 + frames[i + 1][0];
            frameScores[i] = totalScore;
          } else {
            break;
          }
        } else if (frame[1] !== null) {
          totalScore += frame[0] + frame[1];
          frameScores[i] = totalScore;
        } else {
          break;
        }
      } else {
        if (frame[0] === 10) {
          if (frame[1] === null) break;
          if (frame[1] === 10) {
            if (frame[2] === null) break;
            totalScore += 10 + 10 + (frame[2] === 10 ? 10 : frame[2]);
          } else {
            if (frame[2] === null && frame[1] === '/') {
              break;
            } else if (frame[2] === null) {
              totalScore += 10 + frame[1];
            } else if (frame[1] === '/') {
              totalScore += 10 + 10;
            } else {
              totalScore += 10 + frame[1] + frame[2];
            }
          }
        } else if (frame[0] !== null && frame[1] === '/') {
          if (frame[2] === null) break;
          totalScore += 10 + frame[2];
        } else if (frame[0] !== null && frame[1] !== null) {
          totalScore += frame[0] + frame[1];
        } else {
          break;
        }
        frameScores[9] = totalScore;
      }
    }

    let lastScore = 0;
    for (let i = 0; i < frameScores.length; i++) {
      if (frameScores[i] !== null) {
        lastScore = frameScores[i];
      } else if (i > 0 && frameScores[i - 1] !== null) {
        frameScores[i] = lastScore;
      }
    }

    return { totalScore, frameScores };
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
    setSelectedCell({ playerIndex: null, frameIndex: null, rollIndex: null });
    setIsGameOver(false);
    setShowWinnerModal(false);
    setCurrentPhrase('');
  };

  const resetGame = () => {
    const resetPlayers = players.map(player => ({
      ...player,
      frames: Array(9).fill([null, null]).concat([[null, null, null]]),
      frameScores: Array(10).fill(null),
      totalScore: 0
    }));
    setPlayers(resetPlayers);
    const newResetCount = resetCount + 1;
    setResetCount(newResetCount);
    localStorage.setItem('bowlingPlayers', JSON.stringify(resetPlayers));
    localStorage.setItem('bowlingResetCount', newResetCount.toString());
    setSelectedCell({ playerIndex: 0, frameIndex: 0, rollIndex: 0 });
    setIsGameOver(false);
    setCurrentPhrase(motivationalPhrases[0]);
  };

  const sortedPlayers = [...players].sort((a, b) => b.totalScore - a.totalScore);
  const highestScore = sortedPlayers[0]?.totalScore;
  const tiedPlayers = highestScore != null ? sortedPlayers.filter(player => player.totalScore === highestScore) : [];

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
            deletePlayer={deletePlayer}
            resetPlayers={resetPlayers}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-6 w-full">
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={returnToPlayerScreen}
                  className="bg-indigo-600 hover:bg-indigo-700 transition-colors px-4 py-2 rounded-md flex items-center"
                >
                  <ArrowLeft size={24} className="mr-2" />
                  Volver
                </motion.button>
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="bg-pink-600 hover:bg-pink-700 transition-colors px-4 py-2 rounded-md flex items-center"
                  >
                    <Play size={24} className="mr-2" />
                    Opciones
                  </motion.button>


                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-indigo-800 rounded-md shadow-lg z-50"
                      >
                        <button
                          onClick={resetGame}
                          className="w-full text-left px-4 py-2 hover:bg-indigo-700 transition-colors rounded-t-md flex items-center"
                        >
                          <Play size={20} className="mr-2" />
                          Reiniciar Juego
                        </button>
                        <button
                          onClick={resetPlayers}
                          className="w-full text-left px-4 py-2 hover:bg-indigo-700 transition-colors rounded-b-md flex items-center"
                        >
                          <ArrowLeft size={20} className="mr-2" />
                          Reiniciar Jugadores
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {resetCount > 0 && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-800 hover:bg-blue-900 transition-colors px-4 py-2 rounded-md flex items-center"
                  >
                    {resetCount > 0 && `Veces jugado: ${resetCount}`}
                  </motion.div>
                )}

              </div>
            </div>

            {/* Display motivational phrase above scoreboard */}
            <AnimatePresence>
              {currentPhrase && showPhrase ? (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center text-3xl font-extrabold text-pink-400 mb-6 
                    bg-gradient-to-r from-indigo-900/50 to-pink-900/50
                    border-4 border-pink-400/30 rounded-xl p-6
                    shadow-lg shadow-pink-500/20
                    backdrop-blur-sm
                    transform hover:scale-105 transition-transform
                    animate-pulse"
                >
                  <span className="bg-gradient-to-r from-pink-400 to-pink-200 text-transparent bg-clip-text">
                    {currentPhrase}
                  </span>
                </motion.div>
              ) : !showWinnerModal ? (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center text-3xl font-extrabold text-pink-400 mb-6 
                    bg-gradient-to-r from-indigo-900/50 to-pink-900/50
                    border-4 border-pink-400/30 rounded-xl p-6
                    shadow-lg shadow-pink-500/20
                    backdrop-blur-sm
                    transform hover:scale-105 transition-transform
                    animate-pulse"
                >¡Lánzalo!</motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center text-3xl font-extrabold text-pink-400 mb-6
                    bg-gradient-to-r from-indigo-900/50 to-pink-900/50
                    border-4 border-pink-400/30 rounded-xl p-6
                    shadow-lg shadow-pink-500/20
                    backdrop-blur-sm
                    transform hover:scale-105 transition-transform
                    animate-pulse"
                >
                  ¡Juego terminado! {sortedPlayers[0].name} ha ganado con un puntaje de {highestScore}!
                </motion.div>
              )}
            </AnimatePresence>

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
                  players={players}
                  position={modalPosition}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isGameOver && sortedPlayers.length > 0 && (
                <>
                  <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center"
                    onClick={() => setIsGameOver(false)}
                  >
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
                      </button>
                      <div className="flex items-center mb-2">
                        <Trophy size={32} className="text-amber-600 mr-3" />
                        <h2 className="text-3xl uppercase tracking-wider">
                          {tiedPlayers.length > 1 ? '¡Empate!' : '¡Campeón!'}
                        </h2>
                        <Trophy size={32} className="text-amber-600 ml-3" />
                      </div>
                      {tiedPlayers.length > 1 ? (
                        <p className="text-2xl">{tiedPlayers.map(player => player.name).join(', ')}</p>
                      ) : (
                        <p className="text-2xl">{sortedPlayers[0].name}</p>
                      )}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.2, 1] }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="mt-2 bg-indigo-800 text-white px-4 py-1 rounded-full text-xl"
                      >
                        {highestScore} puntos
                      </motion.div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={resetGame}
                        className="mt-6 bg-pink-600 hover:bg-pink-700 transition-colors px-6 py-3 rounded-md flex items-center text-lg"
                      >
                        <Play size={24} className="mr-2" />
                        Reiniciar Juego
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BowlingDashboard;