import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Navbar from '../Navbar.vue';

describe('Navbar', () => {
  it('renders properly', () => {
    const wrapper = mount(Navbar);
    expect(wrapper.text()).toContain('您的美麗工作室');
    expect(wrapper.find('a[href="/"]').exists()).toBe(true); // 檢查首頁連結是否存在
  });

  it('toggles mobile menu on button click', async () => {
    const wrapper = mount(Navbar);
    const mobileMenuButton = wrapper.find('.sm\\:hidden button'); // 找到漢堡菜單按鈕

    // 初始狀態下，菜單應該是隱藏的
    expect(wrapper.find('div.sm\\:flex').classes()).toContain('opacity-0'); // 檢查 opacity-0
    expect(wrapper.find('div.sm\\:flex').classes()).toContain('-translate-y-2'); // 檢查 -translate-y-2

    // 點擊按鈕，菜單應該展開
    await mobileMenuButton.trigger('click');
    expect(wrapper.find('div.sm\\:flex').classes()).toContain('opacity-100'); // 檢查 opacity-100
    expect(wrapper.find('div.sm\\:flex').classes()).toContain('translate-y-0'); // 檢查 translate-y-0

    // 再次點擊按鈕，菜單應該收起
    await mobileMenuButton.trigger('click');
    expect(wrapper.find('div.sm\\:flex').classes()).toContain('opacity-0'); // 檢查 opacity-0
    expect(wrapper.find('div.sm\\:flex').classes()).toContain('-translate-y-2'); // 檢查 -translate-y-2
  });
});
