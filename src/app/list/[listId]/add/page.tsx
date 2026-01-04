import AddMovieForm from './AddMovieForm';

export default function Page({ params }: { params: { listId: string } }) {
  return <AddMovieForm listId={params.listId} />;
}
