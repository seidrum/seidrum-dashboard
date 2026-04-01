import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-gray-700">404</h1>
      <p className="mt-4 text-lg text-gray-400">Page not found</p>
      <Link to="/" className="mt-6 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500">
        Back to Dashboard
      </Link>
    </div>
  );
}
