'use client';

import { useEffect, useState } from "react";
import type {Movie} from "../../helpers/types";

const posterPath = 'https://image.tmdb.org/t/p/w500';

export default function StartListButton({listId}: {listId: string}){
    const [started, setStarted] = useState(false);

    // check if list has already started (if any rows for this listID have non-null startDate)
    useEffect(() => {
      async function checkStarted() {
          const res = await fetch(`/api/check-list-started?listId=${listId}`);
          if (!res.ok) throw new Error("Failed to check list status");
          const json = await res.json();
            setStarted(json.started);
        }
        checkStarted();
    }, []);

    // POST to /api/start-list
    const startList = async () => {
        try {
            const res = await fetch('/api/start-list', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({listId}),
            });
            if (!res.ok) throw new Error((await res.json()).error || 'Start list failed');
            setStarted(true);
        } catch (err) {
            console.error(err);
        }
    };

    if (started) {
        return (
            <div className="p-4 max-w-3xl mx-auto">
              <h2 className="text-xl font-semibold mb-4">The list has already been started.</h2>
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