import { useState } from 'react';
import type { RadioMessage, Driver } from '../types';

interface RadioPanelProps {
  messages: RadioMessage[];
  drivers: Driver[];
  onSendMessage?: (message: Omit<RadioMessage, 'id' | 'timestamp'>) => void;
}

export function RadioPanel({ messages, drivers, onSendMessage }: RadioPanelProps) {
  const [selectedDriver, setSelectedDriver] = useState<number>(drivers[0]?.id || 1);
  const [messageText, setMessageText] = useState('');

  const sendMessage = () => {
    if (!messageText.trim()) return;
    
    const driver = drivers.find(d => d.id === selectedDriver);
    if (!driver) return;

    onSendMessage?.({
      carId: driver.carId,
      sender: 'ENGINEER',
      text: messageText,
      category: 'STRATEGY',
    });
    
    setMessageText('');
  };

  const quickMessages = [
    'Box this lap',
    'Stay out',
    'Push push push',
    'Save fuel',
    'Check tires',
    'Traffic ahead',
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'STRATEGY': return 'text-blue-400';
      case 'PIT': return 'text-orange-400';
      case 'TRACK_CONDITIONS': return 'text-yellow-400';
      case 'TRAFFIC': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Team Radio
      </h3>

      {/* Message History */}
      <div className="bg-gray-800 rounded-lg p-3 mb-4 h-64 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No radio messages yet</p>
        ) : (
          <div className="space-y-2">
            {messages.slice().reverse().map((msg) => {
              const driver = drivers.find(d => d.carId === msg.carId);
              return (
                <div key={msg.id} className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-semibold ${msg.sender === 'DRIVER' ? 'text-green-400' : 'text-blue-400'}`}>
                      {msg.sender === 'DRIVER' ? driver?.name : 'Engineer'}
                    </span>
                    <span className={`text-xs ${getCategoryColor(msg.category)}`}>
                      [{msg.category}]
                    </span>
                    <span className="text-xs text-gray-500">
                      L{msg.lapNumber}
                    </span>
                  </div>
                  <p className="text-gray-300 bg-gray-700/50 rounded px-2 py-1">{msg.text}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Messages */}
      <div className="mb-4">
        <label className="text-sm text-gray-400 block mb-2">Quick Messages</label>
        <div className="grid grid-cols-2 gap-2">
          {quickMessages.map((msg) => (
            <button
              key={msg}
              onClick={() => {
                const driver = drivers.find(d => d.id === selectedDriver);
                if (driver) {
                  onSendMessage?.({
                    carId: driver.carId,
                    sender: 'ENGINEER',
                    text: msg,
                    category: 'STRATEGY',
                  });
                }
              }}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded transition-colors"
            >
              {msg}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Message */}
      <div>
        <label className="text-sm text-gray-400 block mb-2">Send Custom Message</label>
        <div className="flex gap-2">
          <select
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(Number(e.target.value))}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
          >
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                #{driver.carId} {driver.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type message..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
