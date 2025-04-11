import React from 'react';
import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

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

export default Leaderboard;