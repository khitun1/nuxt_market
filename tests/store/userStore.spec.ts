import { beforeEach, describe, vi, it, expect } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { $api } from "~/http";
import { jwtDecode } from "jwt-decode";
import { useUserStore } from "@store";
import { useCookie } from "#app";
import type { ToastServiceMethods } from "primevue/toastservice";

vi.mock(import("#app"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useCookie: vi.fn(),
  };
});

vi.mock("~/http", () => ({
  $api: vi.fn(),
}));

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

describe("User store", () => {
  let userStore: ReturnType<typeof useUserStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    userStore = useUserStore();
    userStore.toast = { add: vi.fn() } as unknown as ToastServiceMethods;
    vi.clearAllMocks();
  });

  describe("User store - auth", () => {
    it("success", async () => {
      const token = "loren";

      const jwtPayload = true;

      vi.mocked($api).mockResolvedValue({ token });
      vi.mocked(jwtDecode).mockReturnValue(jwtPayload);

      await userStore.auth();

      expect(userStore.login).toBeTruthy();
      expect(userStore.user).toBeTruthy();
      expect(userStore.isInitialized).toBeTruthy();
    });

    it("error", async () => {
      const errorMsg = "Request failed";

      vi.mocked($api).mockRejectedValue({ message: errorMsg });

      await userStore.auth();

      expect(userStore.user).toBeNull();
      expect(userStore.login).toBeFalsy();
      expect(userStore.isInitialized).toBeTruthy();
      expect(userStore.toast.add).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: "error",
          detail: errorMsg,
        }),
      );
    });
  });

  describe("User store - login", () => {
    it("success", async () => {
      const jwtPayload = true;
      const cookieValue = "cookie";
      vi.mocked($api).mockResolvedValue({});
      vi.mocked(useCookie).mockReturnValue({ value: cookieValue } as ReturnType<
        typeof useCookie
      >);
      vi.mocked(jwtDecode).mockReturnValue(jwtPayload);

      await userStore.logIn("User", "qwerty");
      expect(useCookie).toHaveBeenCalledWith("token");
      expect(jwtDecode).toHaveBeenCalledWith(cookieValue);
    });

    it("error", async () => {
      const errorMsg = "Request failed";

      vi.mocked($api).mockRejectedValue({ message: errorMsg });

      await userStore.logIn("user", "Qwerty");

      expect(userStore.toast.add).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: "error",
          detail: errorMsg,
        }),
      );
    });
  });
});
