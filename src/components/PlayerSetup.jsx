import React from 'react';
import { UserPlus, Play, X, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const PlayerSetup = ({ players, addPlayer, startGame, newPlayerName, setNewPlayerName, handleKeyDown, deletePlayer, resetPlayers }) => (
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
                        className='bg-indigo-800 px-4 py-2 text-xl rounded-md shadow flex justify-between items-center'
                    >
                        <li>{player.name}</li>
                        <button
                            onClick={() => deletePlayer(index)}
                            className="text-red-500 hover:text-red-400 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                ))}
            </ul>
            <div className="space-y-3">
                <button
                    onClick={startGame}
                    className="w-full bg-pink-600 hover:bg-pink-700 transition-colors px-4 py-3 rounded-md text-lg font-semibold flex items-center justify-center"
                    disabled={players.length === 0}
                >
                    <Play size={24} className="mr-2" />
                    Start Game
                </button>
                {players.length > 0 && (
                    <button
                        onClick={resetPlayers}
                        className="w-full bg-red-600 hover:bg-red-700 transition-colors px-4 py-3 rounded-md text-lg font-semibold flex items-center justify-center"
                    >
                        <Trash2 size={24} className="mr-2" />
                        Reset Players
                    </button>
                )}
            </div>
        </div>
    </motion.div>
);

export default PlayerSetup;