import { cn } from "./utils";

function Skeleton({ className, ...props }) {
  return (
    React.createElement('div', {
      'data-slot': "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props}
    )
  );
}

export { Skeleton };
