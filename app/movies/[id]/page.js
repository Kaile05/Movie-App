import Image from 'next/image';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY      = process.env.NEXT_PUBLIC_TMDB_API_KEY;

async function getMovie(id) {
  const res = await fetch(
    `${API_BASE_URL}/movie/${id}?api_key=${API_KEY}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error('Movie not found');
  return res.json();
}

export default async function MoviePage({ params }) {
  const movie = await getMovie(params.id);

  return (
    <main className="min-h-screen p-6">
      <div className="grid md:grid-cols-2">
        <div>
          {movie.poster_path || movie.backdrop_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${
                movie.poster_path ?? movie.backdrop_path
              }`}
              alt={movie.title}
              width={450}
              height={450}
              className="rounded-lg mb-4 md:ml-6"
            />
          ) : (
            <div className="w-full h-[750px] bg-slate-700 flex items-center justify-center text-gray-400">
              No Image Available
            </div>
          )}
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>

          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="bg-slate-800 text-sm px-3 py-1 rounded-full text-gray-200"
              >
                {genre.name}
              </span>
            ))}
          </div>

          <p className="mb-2">
            <strong>Popularity:</strong> {movie.popularity.toFixed(0)}
          </p>
          <p className="mb-2">
            <strong>Rating:</strong> {movie.vote_average} / 10
          </p>
          <p className="mb-2">
            <strong>Release Date:</strong> {movie.release_date}
          </p>

          <p className="mt-4 max-w-prose leading-relaxed text-gray-300">
            {movie.overview}
          </p>
        </div>
      </div>
    </main>
  );
}
