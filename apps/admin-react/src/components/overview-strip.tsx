import type { ReactNode } from 'react';

export interface OverviewMetric {
  label: string;
  value: ReactNode;
  hint: string;
  tone?: 'navy' | 'gold' | 'emerald';
}

interface OverviewStripProps {
  items: OverviewMetric[];
  testId?: string;
}

export function OverviewStrip({ items, testId }: OverviewStripProps) {
  return (
    <div className="overview-grid" data-testid={testId}>
      {items.map((item) => (
        <article
          key={item.label}
          className={['overview-card', item.tone ? `overview-card--${item.tone}` : null]
            .filter(Boolean)
            .join(' ')}
        >
          <span className="overview-card__label">{item.label}</span>
          <strong className="overview-card__value">{item.value}</strong>
          <span className="overview-card__hint">{item.hint}</span>
        </article>
      ))}
    </div>
  );
}
