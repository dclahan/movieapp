import Movies from "./movies";
import ThisWeeksMovie from "./currMovies";

export const dynamic = 'force-dynamic';

export default async function ListPage({ params }: { params: { listId: string } }) {
  return (
    <main className="">
        <ThisWeeksMovie listId={params.listId}/>
        <Movies listId={params.listId}/>
    </main>
  );
}