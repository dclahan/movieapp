import AddMovieForm from './AddMovieForm';

export default function Page({ params }: { params: { listId: string } }) {
  return <AddMovieForm listId={params.listId} />;
}

// need something to fix the error "Error: Route "/list/[listId]/add" used `params.listId`. `params` should be awaited before using its properties."
