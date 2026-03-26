import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  extra?: ReactNode;
  eyebrow?: string;
}

export function PageHeader({ title, description, extra, eyebrow }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div className="page-header__copy">
        {eyebrow ? <span className="page-header__eyebrow">{eyebrow}</span> : null}
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {extra ? <div className="page-header__extra">{extra}</div> : null}
    </div>
  );
}
