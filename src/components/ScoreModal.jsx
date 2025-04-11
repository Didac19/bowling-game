import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

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
            className="bg-gradient-to-br from-indigo-900 to-purple-800 p-6 rounded-lg shadow-lg absolute z-50"
            style={{
                top: `${position.top - 10}px`,
                left: `${position.left}px`,
                transform: 'translateY(-100%)'
            }}
        >
            <div className="flex justify-end mb-4">
                <button onClick={handleReturnButton} className="text-white hover:text-gray-300 transition-colors">
                    <X size={24} />
                </button>
            </div>
            <div className="grid grid-cols-5 gap-3">
                {getAvailableScores(selectedCell.playerIndex, selectedCell.frameIndex, selectedCell.rollIndex).map((score) => (
                    <motion.button
                        key={score}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-indigo-600 hover:bg-indigo-700 transition-colors px-4 py-3 rounded-md text-lg font-semibold min-w-[3rem] min-h-[3rem] flex items-center justify-center"
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