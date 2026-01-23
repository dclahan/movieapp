import Movies from "./movies";
import ThisWeeksMovie from "./currMovies";
import StartListButton from "./startListButton";

export const dynamic = 'force-dynamic';

export default async function ListPage({ params }: { params: Promise<{ listId: string }> }) {
  const {listId} = await params;
  return (
    <main className="">
        <ThisWeeksMovie listId={listId}/>
        <StartListButton listId={listId} />
        <Movies listId={listId}/>
    </main>
  );
}
