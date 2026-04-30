import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import loginForm from "~/components/loginForm.vue";

describe("Login form component", () => {
  it("emit", async () => {
    const wrapper = await mountSuspended(loginForm);

    await wrapper
      .findAll("Button")
      .find((b) => b.text() === "Sign up")
      ?.trigger("click");

    expect(wrapper.emitted("changeForm"));
  });

  it("input login and password", async () => {
    const wrapper = await mountSuspended(loginForm);

    const myLogin = "my login";
    const myPassword = "my pswrd";

    const input = wrapper.find("#username");
    await input.setValue(myLogin);
    const password = wrapper.find("#password");
    await password.setValue(myPassword);

    await input.trigger("input");
    await password.trigger("input");

    expect(wrapper.vm.login).toBe(myLogin);
    expect(wrapper.vm.password).toBe(myPassword);
  });
});
