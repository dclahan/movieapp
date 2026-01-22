import Movies from "./movies";
import ThisWeeksMovie from "./currMovies";
import StartListButton from "./startListButton";

export const dynamic = 'force-dynamic';

export default async function ListPage({ params }: { params: { listId: string } }) {
  return (
    <main className="">
        <StartListButton listId={params.listId} />
        <ThisWeeksMovie listId={params.listId}/>
        <Movies listId={params.listId}/>
    </main>
  );
}