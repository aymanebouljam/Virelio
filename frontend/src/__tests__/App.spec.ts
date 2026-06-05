import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import router from '../router'

describe('App', () => {
  beforeEach(async () => {
    router.push('/')
    await router.isReady()
  })

  it('renders the app shell', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Virelio')
    expect(wrapper.text()).toContain('Dashboard')
    expect(wrapper.text()).toContain('Vendors')
  })
})
