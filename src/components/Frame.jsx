import React from 'react';
import { motion } from 'framer-motion';

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
                        className={`${getCellStyle(playerIndex, frameIndex, rollIndex, roll, isCellClickable(playerIndex, frameIndex, rollIndex))} flex-1 ${frameIndex === 9 ? 'w-1/3' : 'w-1/2'} relative`}
                        onClick={() => isCellClickable(playerIndex, frameIndex, rollIndex) && handleSelectCell(playerIndex, frameIndex, rollIndex)}
                    >
                        {roll === 10 ? (
                            <>
                                <motion.span
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                    className="absolute inset-0 flex items-center justify-center text-amber-400 font-bold"
                                >
                                    X
                                </motion.span>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-amber-300/20"
                                />
                            </>
                        ) : roll === '/' ? (
                            <>
                                <motion.span
                                    initial={{ scale: 0, y: -20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                    className="absolute inset-0 flex items-center justify-center text-emerald-400 font-bold"
                                >
                                    /
                                </motion.span>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-emerald-300/20"
                                />
                            </>
                        ) : roll !== null ? (
                            <span className="absolute inset-0 flex items-center justify-center">
                                {roll}
                            </span>
                        ) : null}
                    </motion.div>
                );
            })}
        </div>
        <div className="text-center border-t border-indigo-600 py-1 bg-indigo-700 rounded-b">
            {frameScore !== null ? frameScore : ''}
        </div>
    </div>
);

export default Frame;