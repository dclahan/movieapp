'use client';

import { useEffect, useState, useMemo } from "react";
import type {ListInfo} from "./helpers/types";

const poster_path = 'https://image.tmdb.org/t/p/w500';

export default function DisplayLists() {
    const [data, setData] = useState<ListInfo[]>([]);
    
      // load once
      useEffect(() => {
        async function fetchListInfo() {
          const res = await fetch("/api/list-info");
          const json: ListInfo[] = await res.json();
          setData(json);
        }
        fetchListInfo();
      }, []);

    return (
        <div className="space-y-8 p-4">
            {data.map(list => (
                <section key={list.listId} className="space-y-4">
                    <h2 className="text-xl font-semibold">{list.listTitle}</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <a href={`/list/${list.listId}`} className="text-white bg-brand box-border border hover:bg-brand-strong  shadow-xs font-medium leading-5 rounded-base text-sm p-2 text-center">View List</a>
                    </div>
                </section>
            ))}
        </div>
    );
}