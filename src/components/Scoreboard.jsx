import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Frame from './Frame';

const Scoreboard = ({ players, handleSelectCell, isCellClickable, getCellStyle, selectedCell, cellRefs }) => {
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

export default Scoreboard;