import Link from 'next/link';
import { Music } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mx-auto mb-6">
          <Music className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">
          404 - Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Music className="h-4 w-4" />
          <span>Go Home</span>
        </Link>
      </div>
    </div>
  );
}
