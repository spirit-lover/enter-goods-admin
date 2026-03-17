import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import LoginView from '../views/login/LoginView.vue';
describe('LoginView', () => {
    it('为空表单时显示中文校验文案', async () => {
        const wrapper = mount(LoginView);
        await wrapper.get('[data-testid="submit-login"]').trigger('click');
        await Promise.resolve();
        expect(wrapper.text()).toContain('请输入用户名');
        expect(wrapper.text()).toContain('请输入至少 8 位密码');
    });
});
