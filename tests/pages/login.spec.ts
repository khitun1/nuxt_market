import { beforeEach, describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import LoginForm from "~/components/loginForm.vue";
import type { VueWrapper } from "@vue/test-utils";
import Login from "~/pages/login.vue";
import SignUpForm from "~/components/signUpForm.vue";
import { createPinia, setActivePinia } from "pinia";
import { useUserStore } from "@store";

describe("Login page - change form", () => {
  let wrapper: VueWrapper<InstanceType<typeof Login>>;
  let pinia;
  let userStore: ReturnType<typeof useUserStore>;

  beforeEach(async () => {
    pinia = createPinia();
    setActivePinia(pinia);
    userStore = useUserStore();

    wrapper = await mountSuspended(Login, {
      global: {
        plugins: [pinia],
      },
    });
  });

  it("double change", async () => {
    userStore.authPage = "login";
    await nextTick();

    expect(wrapper.findComponent(LoginForm).exists()).toBeTruthy();
    expect(wrapper.findComponent(SignUpForm).exists()).toBeFalsy();

    const loginFormWrapper = wrapper.findComponent(LoginForm);
    let btn = loginFormWrapper.find(".changeForm");
    await btn.trigger("click");
    await nextTick();

    expect(wrapper.findComponent(LoginForm).exists()).toBeFalsy();
    expect(wrapper.findComponent(SignUpForm).exists()).toBeTruthy();

    const signUpFormWrapper = wrapper.findComponent(SignUpForm);
    btn = signUpFormWrapper.find(".changeForm");
    await btn.trigger("click");
    await nextTick();

    expect(wrapper.findComponent(LoginForm).exists()).toBeTruthy();
    expect(wrapper.findComponent(SignUpForm).exists()).toBeFalsy();
  });
});
