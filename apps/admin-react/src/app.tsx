import { App as AntApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { AppRouter } from './routes/app-router';
import { StoreProviders } from './stores/store-provider';

export function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#153A6B',
          colorInfo: '#153A6B',
          colorSuccess: '#2F6B5F',
          colorWarning: '#B68A52',
          colorBgLayout: '#F5F1EA',
          colorBgContainer: '#FFFDF9',
          colorText: '#142235',
          colorTextSecondary: '#5C6A7D',
          borderRadius: 18,
          fontFamily: "'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
          controlHeight: 44
        },
        components: {
          Layout: {
            bodyBg: '#F5F1EA',
            headerBg: 'transparent',
            siderBg: '#0F2747'
          },
          Card: {
            borderRadiusLG: 24
          },
          Menu: {
            darkItemBg: 'transparent',
            darkItemSelectedBg: 'rgba(21, 58, 107, 0.84)',
            darkSubMenuItemBg: 'transparent'
          },
          Button: {
            borderRadius: 14,
            controlHeight: 44
          },
          Input: {
            borderRadius: 14,
            controlHeight: 44
          }
        }
      }}
    >
      <AntApp>
        <StoreProviders>
          <AppRouter />
        </StoreProviders>
      </AntApp>
    </ConfigProvider>
  );
}
