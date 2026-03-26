import { Card, Space, Typography } from 'antd';
import type { ReactNode } from 'react';

interface DataPanelProps {
  title: string;
  description: string;
  eyebrow?: string;
  extra?: ReactNode;
  className?: string;
  testId?: string;
  children: ReactNode;
}

export function DataPanel({
  title,
  description,
  eyebrow,
  extra,
  className,
  testId,
  children
}: DataPanelProps) {
  return (
    <Card className={['surface-card', 'table-panel', className].filter(Boolean).join(' ')} data-testid={testId}>
      <div className="table-panel__header">
        <Space orientation="vertical" size={4}>
          {eyebrow ? <span className="table-panel__eyebrow">{eyebrow}</span> : null}
          <Typography.Title level={4} className="table-panel__title">
            {title}
          </Typography.Title>
          <Typography.Paragraph className="table-panel__description">
            {description}
          </Typography.Paragraph>
        </Space>
        {extra ? <div className="table-panel__extra">{extra}</div> : null}
      </div>
      <div className="table-panel__content">{children}</div>
    </Card>
  );
}
