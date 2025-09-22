import Link from 'next/link';
import { Music } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-surface rounded-lg flex items-center justify-center mx-auto mb-6">
          <Music className="h-8 w-8 text-text-muted" />
        </div>
        <h1 className="text-3xl font-bold text-text mb-3">
          404 - Page Not Found
        </h1>
        <p className="text-text-muted mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <Music className="h-4 w-4" />
          <span>Go Home</span>
        </Link>
      </div>
    </div>
  );
}