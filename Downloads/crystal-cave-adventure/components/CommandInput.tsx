
import React, { useState } from 'react';

interface CommandInputProps {
  onCommand: (command: string) => void;
}

export const CommandInput: React.FC<CommandInputProps> = ({ onCommand }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onCommand(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-gray-900 flex items-center space-x-2 shadow-inner_top sticky bottom-0">
      <span className="text-emerald-400 font-semibold">&gt;</span>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your command..."
        className="flex-grow bg-gray-700 border border-gray-600 text-gray-100 rounded-md p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none placeholder-gray-400"
        autoFocus
      />
      <button
        type="submit"
        className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75"
      >
        Send
      </button>
    </form>
  );
};