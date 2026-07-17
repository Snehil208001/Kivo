import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <p className="text-6xl font-extrabold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-bold text-accent">Page not found</h1>
      <p className="mt-2 max-w-sm text-accent/60">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link to="/" className="btn-primary btn-lg mt-6">
        Back to home
      </Link>
    </div>
  );
}
