import React from 'react';
import type { Notification } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllAsRead: () => void;
}

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
    return (
        <li className={`flex items-start space-x-4 p-4 border-b border-space-border/50 transition-colors ${!notification.read ? 'bg-space-blue/20' : ''}`}>
            {!notification.read && <div className="w-2.5 h-2.5 bg-cyber-pink rounded-full mt-1.5 flex-shrink-0"></div>}
            <div className={`flex-grow ${notification.read ? 'pl-7' : ''}`}>
                <p className="text-white text-sm">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(notification.time).toLocaleString()}</p>
            </div>
             <div className="text-2xl text-gray-500">
                <i className="fas fa-satellite-dish"></i>
             </div>
        </li>
    );
};


export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose, notifications, onMarkAllAsRead }) => {
  if (!isOpen) return null;
  
  const hasUnread = notifications.some(n => !n.read);

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-space-card/90 backdrop-blur-md border border-star-yellow/50 rounded-xl shadow-glow-yellow w-full max-w-2xl max-h-[80vh] m-4 text-white transform transition-all animate-supernova flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-space-border flex-shrink-0">
          <h2 className="text-xl font-bold tracking-wider">All Notifications</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl" aria-label="Close modal">&times;</button>
        </div>
        
        <div className="flex-grow overflow-y-auto">
           {notifications.length > 0 ? (
                <ul>
                    {notifications.map(n => <NotificationItem key={n.id} notification={n} />)}
                </ul>
            ) : (
                <div className="h-full flex flex-col justify-center items-center text-center p-8">
                     <i className="fas fa-bell-slash text-5xl text-gray-600 mb-4"></i>
                    <p className="text-lg font-semibold text-gray-300">No Notifications Yet</p>
                    <p className="text-sm text-gray-500">Your alerts and updates will appear here.</p>
                </div>
            )}
        </div>
        
        <div className="p-4 border-t border-space-border flex-shrink-0">
            <button 
                onClick={onMarkAllAsRead} 
                disabled={!hasUnread}
                className="w-full bg-space-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
               <i className="fas fa-check-double mr-2"></i> Mark all as read
            </button>
        </div>
      </div>
    </div>
  );
};
