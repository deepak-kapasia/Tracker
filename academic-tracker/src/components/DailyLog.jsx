import { useState, useEffect } from 'react';
import DateSidebar from './DateSidebar';
import TimelineView from './TimelineView';

function DailyLog({ currentUser, theme }) {
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

    // Load dates from API
    useEffect(() => {
        const fetchDates = async () => {
            try {
                const response = await fetch(`${API_BASE}/${currentUser}/dailylogs`);
                if (response.ok) {
                    const data = await response.json();
                    const parsed = data; // Assuming API returns same structure
                    setDates(parsed);
                    if (parsed.length > 0 && !selectedDate) {
                        setSelectedDate(parsed[0]);
                    }
                }
            } catch (error) {
                console.error('Error fetching logs:', error);
            }
        };

        if (currentUser) {
            fetchDates();
        }
    }, [currentUser]);

    // Save dates to API (Helper)
    const saveLogsToApi = async (newDates) => {
        try {
            await fetch(`${API_BASE}/${currentUser}/dailylogs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDates),
            });
        } catch (error) {
            console.error('Error saving logs:', error);
        }
    };

    const addDate = async (dateString) => {
        // Check if date already exists
        const exists = dates.find(d => d.date === dateString);
        if (exists) {
            setSelectedDate(exists);
            return;
        }

        const newDate = {
            id: Date.now().toString(),
            date: dateString,
            logs: Array(24).fill(''), // 24 hours, initially empty
            createdAt: new Date().toISOString(),
        };

        const updatedDates = [newDate, ...dates];
        setDates(updatedDates);
        setSelectedDate(newDate);
        await saveLogsToApi(updatedDates);
    };

    const updateLog = async (hour, text) => {
        if (!selectedDate) return;

        const updatedDates = dates.map(date => {
            if (date.id === selectedDate.id) {
                const newLogs = [...date.logs];
                newLogs[hour] = text;
                return {
                    ...date,
                    logs: newLogs,
                };
            }
            return date;
        });

        setDates(updatedDates);

        // Update selected date
        const updated = updatedDates.find(d => d.id === selectedDate.id);
        setSelectedDate(updated);
        await saveLogsToApi(updatedDates);
    };

    return (
        <div className="flex gap-6 h-[calc(100vh-120px)]">
            {/* Sidebar */}
            <DateSidebar
                dates={dates}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                onAddDate={addDate}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                theme={theme}
            />

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                {selectedDate ? (
                    <TimelineView
                        date={selectedDate}
                        onUpdateLog={updateLog}
                        theme={theme}
                    />
                ) : (
                    <div className="card h-full flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <p className="text-xl mb-2">No date selected</p>
                            <p className="text-sm">Add a new date to start logging</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DailyLog;
