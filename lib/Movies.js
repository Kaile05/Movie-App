'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY      = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const delayRef = useRef(null);          // for debouncing

  // Fetch either popular list (no query) or search results (query present)
  async function fetchMovies(q = '') {
    setLoading(true);
    const endpoint = q
      ? `${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(q)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;

    try {
      const res  = await fetch(endpoint);
      const data = await res.json();
      console.log(data.results)
      setMovies(data.results ?? []);
    } catch (err) {
      console.error('TMDB fetch error:', err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  // Initial load (popular)
  useEffect(() => {
    fetchMovies();            // empty query → popular list
  }, []);

  // Debounced search: wait 500 ms after user stops typing
  useEffect(() => {
    // Skip on first render (query === '')
    if (query === '') {
      fetchMovies('');
      return;
    }

    clearTimeout(delayRef.current);
    delayRef.current = setTimeout(() => {
      fetchMovies(query);
    }, 500);

    // Clean up on unmount or when query changes quickly
    return () => clearTimeout(delayRef.current);
  }, [query]);

  return (
    <section className="min-h-screen p-6">
      <h1 className="font-bold text-3xl mb-4">Movies</h1>

      {/* 🔍 Search box */}
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search for a title..."
        className="w-full md:w-96 p-2 mb-6 rounded bg-slate-800 outline-none"
      />

      {loading && <p className="mb-4">Loading…</p>}
      {!loading && movies.length === 0 && (
        <p className="mb-4">No movies found.</p>
      )}


      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {movies.map(movie => (
          <Link key={movie.id} href={`/movies/${movie.id}`}>
            <div className="bg-slate-950 rounded border border-slate-800 p-4 hover:ring-1 hover:ring-gray-400 cursor-pointer">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                />
              ) : (
                <div className="h-[450px] flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <h2 className="font-bold mt-2 truncate">{movie.title}</h2>
              <p className="text-sm text-gray-400">{movie.release_date}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
