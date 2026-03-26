import { App, Button, Card, Form, Input, Space, Tag, Typography } from 'antd';
import { startTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, usePermissionStore } from '../../stores/store-provider';

const capabilities = [
  {
    title: '权限治理',
    description: '统一角色、菜单与操作边界，确保后台协作过程稳定可控。'
  },
  {
    title: '商品运营',
    description: '围绕商品目录、分类归属与上下架节奏建立标准作业面板。'
  },
  {
    title: '审计留痕',
    description: '关键操作即时记录，帮助团队追踪变更、定位风险与复盘过程。'
  }
];

export function LoginPage() {
  const [form] = Form.useForm<{ username: string; password: string }>();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const login = useAuthStore((state) => state.login);
  const loadAccessContext = usePermissionStore((state) => state.loadAccessContext);

  async function handleFinish(values: { username: string; password: string }) {
    try {
      await login(values);
      await loadAccessContext();
      message.success('登录成功');
      startTransition(() => {
        navigate('/dashboard');
      });
    } catch (error) {
      console.error(error);
      message.error('登录失败，请检查用户名和密码');
    }
  }

  return (
    <div className="login-page">
      <div className="login-page__hero" data-testid="login-hero">
        <section className="login-page__brand-panel">
          <Tag variant="filled" className="login-page__brand-tag">
            Enterprise Commerce Suite
          </Tag>
          <Typography.Title className="login-page__brand-title">
            企业商品运营控制台
          </Typography.Title>
          <Typography.Paragraph className="login-page__brand-description">
            面向企业商品、库存、订单与系统治理场景打造的统一工作台，让运营节奏、权限边界与关键数据在同一界面内被可靠管理。
          </Typography.Paragraph>

          <div className="login-page__metrics">
            <div className="login-page__metric">
              <strong>4</strong>
              <span>核心治理域</span>
            </div>
            <div className="login-page__metric">
              <strong>1</strong>
              <span>统一权限入口</span>
            </div>
            <div className="login-page__metric">
              <strong>24h</strong>
              <span>运营节奏可追踪</span>
            </div>
          </div>

          <div className="login-page__capabilities" data-testid="login-capabilities">
            {capabilities.map((item) => (
              <article key={item.title} className="login-page__capability">
                <span className="login-page__capability-mark" />
                <div>
                  <Typography.Title level={5}>{item.title}</Typography.Title>
                  <Typography.Paragraph>{item.description}</Typography.Paragraph>
                </div>
              </article>
            ))}
          </div>
        </section>

        <Card className="login-card" variant="borderless">
          <div className="login-card__header">
            <Tag variant="filled" color="blue">
              Secure Access
            </Tag>
            <Typography.Title level={3}>安全登录</Typography.Title>
            <Typography.Paragraph type="secondary">
              使用统一账号进入商品运营工作区。
            </Typography.Paragraph>
          </div>

          <div className="login-card__account-hint">
            <span>默认管理员账号</span>
            <strong>admin / Admin123!</strong>
          </div>

          <Form form={form} layout="vertical" onFinish={handleFinish}>
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input id="username" placeholder="请输入用户名" autoComplete="username" size="large" />
            </Form.Item>
            <Form.Item
              label="密码"
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 8, message: '请输入至少 8 位密码' }
              ]}
            >
              <Input.Password
                id="password"
                placeholder="请输入密码"
                autoComplete="current-password"
                size="large"
              />
            </Form.Item>
            <Space orientation="vertical" size={14} className="field-block">
              <Button block data-testid="submit-login" type="primary" htmlType="submit" size="large">
                登录系统
              </Button>
              <Typography.Text type="secondary">
                登录即表示你将在受控环境中执行商品与系统治理操作。
              </Typography.Text>
            </Space>
          </Form>
        </Card>
      </div>
    </div>
  );
}
