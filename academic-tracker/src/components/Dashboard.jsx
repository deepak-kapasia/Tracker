import { useState } from 'react';
import { BookOpen, Calendar, LogOut } from 'lucide-react';
import SubjectTracker from './SubjectTracker';
import DailyLog from './DailyLog';

function Dashboard({ currentUser, currentView, setCurrentView, onLogout }) {
    // Theme configuration for each user
    const themes = {
        Deepak: {
            primary: 'deepak',
            gradient: 'from-deepak-500 to-deepak-700',
            bgGradient: 'from-deepak-50 to-blue-50',
            text: 'text-deepak-700',
            border: 'border-deepak-300',
            button: 'bg-deepak-600 hover:bg-deepak-700',
            buttonOutline: 'border-deepak-600 text-deepak-600 hover:bg-deepak-50',
        },
        Anjali: {
            primary: 'anjali',
            gradient: 'from-anjali-500 to-anjali-700',
            bgGradient: 'from-anjali-50 to-purple-50',
            text: 'text-anjali-700',
            border: 'border-anjali-300',
            button: 'bg-anjali-600 hover:bg-anjali-700',
            buttonOutline: 'border-anjali-600 text-anjali-600 hover:bg-anjali-50',
        },
    };

    const theme = themes[currentUser];

    return (
        <div className={`min-h-screen bg-gradient-to-br ${theme.bgGradient}`}>
            {/* Top Navigation Bar */}
            <nav className={`bg-white shadow-md sticky top-0 z-50`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* User Info */}
                        <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}>
                                <span className="text-white font-bold text-lg">
                                    {currentUser[0]}
                                </span>
                            </div>
                            <div>
                                <h2 className={`font-bold ${theme.text}`}>
                                    {currentUser}'s Dashboard
                                </h2>
                                <p className="text-xs text-gray-500">Track your progress</p>
                            </div>
                        </div>

                        {/* View Toggle Buttons */}
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentView('subjects')}
                                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg
                  transition-all duration-300 font-medium
                  ${currentView === 'subjects'
                                        ? `${theme.button} text-white shadow-md`
                                        : `border-2 ${theme.buttonOutline}`
                                    }
                `}
                            >
                                <BookOpen className="w-5 h-5" />
                                <span className="hidden sm:inline">Subject Progress</span>
                            </button>

                            <button
                                onClick={() => setCurrentView('dailylog')}
                                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg
                  transition-all duration-300 font-medium
                  ${currentView === 'dailylog'
                                        ? `${theme.button} text-white shadow-md`
                                        : `border-2 ${theme.buttonOutline}`
                                    }
                `}
                            >
                                <Calendar className="w-5 h-5" />
                                <span className="hidden sm:inline">24-Hour Log</span>
                            </button>

                            {/* Logout Button */}
                            <button
                                onClick={onLogout}
                                className="ml-4 p-2 text-gray-600 hover:text-red-600 transition-colors duration-300"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {currentView === 'subjects' ? (
                    <SubjectTracker currentUser={currentUser} theme={theme} />
                ) : (
                    <DailyLog currentUser={currentUser} theme={theme} />
                )}
            </main>
        </div>
    );
}

export default Dashboard;
