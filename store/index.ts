import { defineStore, type StoreDefinition } from "pinia";
import { jwtDecode } from "jwt-decode";
import { $api } from "~/http";
import type { UserState } from "~/types/states";
import type { FetchError } from "ofetch";
import { useCookie } from "#app";

type UserGetters = {
  getAuthPage: () => string;
};

interface UserActions {
  auth(headers?: Record<string, string>): Promise<void>;
  logIn(login: string, password: string): Promise<true | undefined>;
  signUp(
    login: string,
    password: string,
    isAdmin: boolean,
  ): Promise<true | undefined>;
  signOut(): Promise<void>;
  changeAuthPage(form: string): void;
}

export const useUserStore: StoreDefinition<
  "userStore",
  UserState,
  UserGetters,
  UserActions
> = defineStore<"userStore", UserState, UserGetters, UserActions>("userStore", {
  state: (): UserState => ({
    authPage: "login",
    login: false,
    darkMode: true,
    user: null,
    isInitialized: false,
  }),
  getters: {
    getAuthPage(): string {
      return this.authPage;
    },
  },
  actions: {
    async logIn(login: string, password: string): Promise<true | undefined> {
      try {
        // const config = useRuntimeConfig();
        // const backendUrl = config.public.backendUrl;
        await $api("user/login", {
          method: "POST",
          body: {
            login,
            password,
          },
        });
        const token: string | null | undefined = useCookie("token").value;
        if (token) {
          this.user = jwtDecode(token);
          this.login = true;
          return true;
        }
      } catch (e) {
        this.user = null;
        this.login = false;
        const fetchError = e as FetchError;
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: fetchError.message,
          life: 3000,
        });
      } finally {
        this.isInitialized = true;
      }
    },
    async signUp(
      login: string,
      password: string,
      isAdmin: boolean,
    ): Promise<true | undefined> {
      try {
        await $api("user/signUp", {
          method: "POST",
          body: {
            login,
            password,
            isAdmin,
          },
        });
        const token: string | null | undefined = useCookie("token").value;
        if (token) {
          this.user = jwtDecode(token);
          this.login = true;
          return true;
        }
      } catch (e) {
        const fetchError = e as FetchError;
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: fetchError.message,
          life: 3000,
        });
      } finally {
        this.isInitialized = true;
      }
    },
    async auth(headers?: Record<string, string>): Promise<void> {
      try {
        const res = await $api<{ token: string }>("user/auth", {
          headers,
        });
        const token: string | null | undefined = res.token;
        if (token) {
          this.user = jwtDecode(token);
          this.login = true;
        }
      } catch (e) {
        this.user = null;
        this.login = false;
        const fetchError = e as FetchError;
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: fetchError.message,
          life: 3000,
        });
      } finally {
        this.isInitialized = true;
      }
    },
    async signOut(): Promise<void> {
      try {
        const headers = useRequestHeaders(["cookie"]) as Record<string, string>;
        await $api("user/exit", {
          headers,
        });
        this.user = null;
        this.login = false;
      } catch (e) {
        const fetchError = e as FetchError;
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: fetchError.message,
          life: 3000,
        });
      }
    },
    changeAuthPage(form: string): void {
      this.authPage = form;
    },
  },
});
