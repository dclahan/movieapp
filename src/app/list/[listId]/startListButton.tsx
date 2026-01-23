'use client';

import { useEffect, useState } from "react";
import { set } from "zod/v4";

const posterPath = 'https://image.tmdb.org/t/p/w500';

export default function StartListButton({listId}: {listId: string}){
    const [started, setStarted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [countdown, setCountdown] = useState<string>("");

    // Calculate time until next week
    const calculateTimeUntilNextWeek = () => {
        if (!startDate) return;

        const now = new Date();
        const currentWeekStart = new Date(startDate);

        // Find how many full weeks have passed
        const msPerWeek = 7 * 24 * 60 * 60 * 1000;
        const weeksPassed = Math.floor((now.getTime() - startDate.getTime()) / msPerWeek);

        // Calculate next week's start (current week start + (weeksPassed + 1) weeks)
        const nextWeekStart = new Date(startDate.getTime() + (weeksPassed + 1) * msPerWeek);

        // Calculate time difference
        const timeDiff = nextWeekStart.getTime() - now.getTime();

        // Convert to days, hours, minutes, seconds
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        // Format the countdown
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    // check if list has already started (if any rows for this listID have non-null startDate)
    useEffect(() => {
      async function checkStarted() {
          setLoading(true);
          try {
            const res = await fetch(`/api/check-list-started?listId=${listId}`);
            if (!res.ok) throw new Error("Failed to check list status");
            const json = await res.json();
            setStarted(json.started);
            setStartDate(json.start ? new Date(json.start) : null);
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
        }
        checkStarted();
    }, [listId]);

    // Update countdown every second
    useEffect(() => {
        if (!startDate || !started) return;

        const updateCountdown = () => {
            const countdownStr = calculateTimeUntilNextWeek();
            if (countdownStr) {
                setCountdown(countdownStr);
            }
        };

        // Update immediately
        updateCountdown();

        // Then update every second
        const intervalId = setInterval(updateCountdown, 1000);

        // Cleanup
        return () => clearInterval(intervalId);
    }, [startDate, started]);

    // POST to /api/start-list
    const startList = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/start-list?listId=${listId}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({listId}),
            });
            if (!res.ok) throw new Error((await res.json()).error || 'Start list failed');
            setStarted(true);
            setStartDate(new Date());
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="p-4 max-w-3xl mx-auto">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-800 rounded w-1/3 mb-4"></div>
                </div>
            </div>
        );
    }

    // diplay countdown if started
    if (started) {
        return (
            <div className="p-4 max-w-3xl mx-auto">
              {countdown && (
                <div className="mt-4 p-4 rounded-lg border border-blue-200 centered text-center ">
                      <h2 className="text-xl font-semibold mb-4">New movies in: </h2>
                        <div className="text-2xl font-bold text-blue-600 font-mono">
                            {countdown}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Are you ready to begin?</h2>

      <form onSubmit={startList} className="flex flex-col sm:flex-row gap-2 mb-4">
        <button
          type="submit"
          className={`bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50`}
          disabled={started}
        >
          {started ? 'Getting Started...' : 'Start Watching'}
        </button>
      </form>

    </div>
  );
}
