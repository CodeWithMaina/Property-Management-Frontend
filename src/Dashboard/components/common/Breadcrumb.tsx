// src/components/navigation/Breadcrumb.tsx
import React from "react";
import { Link, useMatches } from "react-router-dom";

export const Breadcrumb: React.FC = () => {
  const matches = useMatches();

  // Build crumb list from route metadata
  const crumbs = matches
    .filter((match) => Boolean((match.handle as any)?.breadcrumb))
    .map((match) => ({
      label: (match.handle as any).breadcrumb,
      href: match.pathname || "",
    }));

  return (
    <nav className="text-sm">
      <ul className="flex flex-wrap items-center space-x-2 text-gray-500 dark:text-gray-400">
        {crumbs.map((crumb, idx) => (
          <li key={idx} className="flex items-center">
            {idx < crumbs.length - 1 ? (
              <Link
                to={crumb.href}
                className="hover:text-blue-600 transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {crumb.label}
              </span>
            )}
            {idx < crumbs.length - 1 && (
              <span className="mx-2 text-gray-400">›</span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};
