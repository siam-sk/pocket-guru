export default function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-800/60 rounded ${className}`} />;
}