import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

const ScoreModal = ({ handleSelectScore, handleReturnButton, getAvailableScores, selectedCell, position, players }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30"
    >
        <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-transparent p-8 rounded-xl shadow-2xl absolute z-50 border border-indigo-500/30 backdrop-blur-md"
            style={{
                top: `${position.top - 10}px`,
                left: `${position.left}px`,
                transform: 'translateY(-100%)'
            }}
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                    Turno {selectedCell.playerIndex !== null ? players[selectedCell.playerIndex].name : ''}
                </h3>
                <button
                    onClick={handleReturnButton}
                    className="text-indigo-300 hover:text-white transition-colors duration-200 hover:bg-indigo-800/50 p-2 rounded-full"
                >
                    <X size={24} />
                </button>
            </div>
            <div className="grid grid-cols-5 gap-4">
                {getAvailableScores(selectedCell.playerIndex, selectedCell.frameIndex, selectedCell.rollIndex).map((score) => (
                    <motion.button
                        key={score}
                        whileHover={{ scale: 1.05, backgroundColor: '#4338ca' }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 px-4 py-3 rounded-xl text-xl font-bold 
                        min-w-[3.5rem] min-h-[3.5rem] flex items-center justify-center shadow-lg shadow-indigo-900/50 
                        border border-indigo-500/30 text-indigo-100"
                        onClick={() => handleSelectScore(score)}
                    >
                        {score === 10 ? 'X' : score}
                    </motion.button>
                ))}
            </div>
        </motion.div>
    </motion.div>
);

export default ScoreModal;