import { vi, describe, it, expect, beforeEach } from "vitest";
import { toggleWishlist, isWishlistItem, useIsWishlisted } from "@/hooks/api-hooks";
import { renderHook, act } from "@testing-library/react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";

// Hoisted module mocks
vi.mock("@/lib/supabaseClient", () => {
  const mockSingle = vi.fn();
  const mockMaybeSingle = vi.fn();
  const mockInsert = vi.fn();
  const mockDelete = vi.fn();
  const mockSelect = vi.fn();
  const mockEq = vi.fn();

  const mockFrom = vi.fn(() => ({
    select: mockSelect,
    insert: mockInsert,
    delete: mockDelete,
    eq: mockEq,
    single: mockSingle,
    maybeSingle: mockMaybeSingle,
  }));

  return {
    supabase: {
      auth: {
        getSession: vi.fn(),
      },
      from: mockFrom,
    },
    isMockMode: () => false,
  };
});

vi.mock("@/hooks/use-toast", () => ({
  toast: vi.fn(),
}));

// Helper to flush asynchronous queue tasks
const flushQueue = () => new Promise((resolve) => setTimeout(resolve, 50));

describe("Wishlist Identity & Collision Safety", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("ensures items of same type + same name + different database IDs remain independent", () => {
    const list = [
      { id: "101", title: "Lassi", itemType: "Food", imageUrl: "" },
      { id: "202", title: "Lassi", itemType: "Food", imageUrl: "" }
    ];
    localStorage.setItem("kashi_wishlist", JSON.stringify(list));

    // Checking by database ID
    expect(isWishlistItem("101", "Food")).toBe(true);
    expect(isWishlistItem("202", "Food")).toBe(true);
    expect(isWishlistItem("303", "Food")).toBe(false);
  });

  it("ensures different entity types + same database ID remain independent", () => {
    const list = [
      { id: "101", title: "Assi Ghat", itemType: "Food", imageUrl: "" },
      { id: "101", title: "Assi Ghat", itemType: "Attraction", imageUrl: "" }
    ];
    localStorage.setItem("kashi_wishlist", JSON.stringify(list));

    expect(isWishlistItem("101", "Food")).toBe(true);
    expect(isWishlistItem("101", "Attraction")).toBe(true);
  });
});

describe("Optimistic Wishlist Behavior & Rollback Flow", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("updates local state immediately on add", async () => {
    const mockGetSession = supabase.auth.getSession as any;
    mockGetSession.mockResolvedValue({ data: { session: null } });

    toggleWishlist({ id: "101", title: "Malaiyyo", itemType: "Food", imageUrl: "" });

    // Local storage is updated instantly before Supabase resolves
    expect(isWishlistItem("101", "Food")).toBe(true);
  });

  it("preserves state on successful Supabase sync", async () => {
    const mockGetSession = supabase.auth.getSession as any;
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: "user_aditya" } } } });

    const queryMock = supabase.from("foods") as any;
    const mockSelect = queryMock.select as any;
    const mockEq = queryMock.eq as any;
    const mockSingle = queryMock.single as any;
    const mockMaybeSingle = queryMock.maybeSingle as any;
    const mockInsert = queryMock.insert as any;

    mockSelect.mockReturnThis();
    mockEq.mockReturnThis();
    mockSingle.mockResolvedValue({ data: { id: "profile_1" }, error: null });
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });
    mockInsert.mockResolvedValue({ error: null });

    await toggleWishlist({ id: "101", title: "Malaiyyo", itemType: "Food", imageUrl: "" });
    await flushQueue();

    // State remains favorited
    expect(isWishlistItem("101", "Food")).toBe(true);
    expect(toast).not.toHaveBeenCalled();
  });

  it("rolls back state and triggers Destructive Toast on sync failure", async () => {
    const mockGetSession = supabase.auth.getSession as any;
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: "user_aditya" } } } });

    const queryMock = supabase.from("foods") as any;
    const mockSelect = queryMock.select as any;
    const mockEq = queryMock.eq as any;
    const mockSingle = queryMock.single as any;
    const mockMaybeSingle = queryMock.maybeSingle as any;
    const mockInsert = queryMock.insert as any;

    mockSelect.mockReturnThis();
    mockEq.mockReturnThis();
    mockSingle.mockResolvedValue({ data: { id: "profile_1" }, error: null });
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });
    mockInsert.mockResolvedValue({ error: new Error("Network timeout") });

    await toggleWishlist({ id: "101", title: "Malaiyyo", itemType: "Food", imageUrl: "" });
    await flushQueue();

    // Should rollback local state (item removed)
    expect(isWishlistItem("101", "Food")).toBe(false);
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({
      variant: "destructive",
      title: "Sync Error"
    }));
  });
});

describe("Session Safety during Mutations", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("ignores mutation rollback if user logs out before sync completion", async () => {
    const mockGetSession = supabase.auth.getSession as any;
    // Initial session active
    mockGetSession.mockResolvedValueOnce({ data: { session: { user: { id: "user_aditya" } } } });

    const queryMock = supabase.from("foods") as any;
    const mockSelect = queryMock.select as any;
    const mockEq = queryMock.eq as any;
    const mockSingle = queryMock.single as any;
    const mockInsert = queryMock.insert as any;

    mockSelect.mockReturnThis();
    mockEq.mockReturnThis();
    mockSingle.mockResolvedValue({ data: { id: "profile_1" }, error: null });

    // Emulate logout by returning null session in subsequent checks
    mockGetSession.mockResolvedValue({ data: { session: null } });
    mockInsert.mockResolvedValue({ error: new Error("Unauthorized request") });

    await toggleWishlist({ id: "101", title: "Malaiyyo", itemType: "Food", imageUrl: "" });
    await flushQueue();

    // Since user logged out, state is NOT rolled back (keeps current state) and NO toast error is triggered
    expect(toast).not.toHaveBeenCalled();
  });

  it("prevents modifying new user state if account switches during sync", async () => {
    const mockGetSession = supabase.auth.getSession as any;
    // Initial session is user_aditya
    mockGetSession.mockResolvedValueOnce({ data: { session: { user: { id: "user_aditya" } } } });

    const queryMock = supabase.from("foods") as any;
    const mockSelect = queryMock.select as any;
    const mockEq = queryMock.eq as any;
    const mockSingle = queryMock.single as any;
    const mockInsert = queryMock.insert as any;

    mockSelect.mockReturnThis();
    mockEq.mockReturnThis();
    mockSingle.mockResolvedValue({ data: { id: "profile_1" }, error: null });

    // Emulate switch to user_raj in subsequent session query
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: "user_raj" } } } });
    mockInsert.mockResolvedValue({ error: new Error("DB Error") });

    await toggleWishlist({ id: "101", title: "Malaiyyo", itemType: "Food", imageUrl: "" });
    await flushQueue();

    // User raj's state remains untouched (no rollback/toast triggered)
    expect(toast).not.toHaveBeenCalled();
  });
});

describe("useIsWishlisted React Hook", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("returns correct initial state", () => {
    localStorage.setItem("kashi_wishlist", JSON.stringify([
      { id: "101", title: "Malaiyyo", itemType: "Food", imageUrl: "" }
    ]));

    const { result } = renderHook(() => useIsWishlisted("101", "Food"));
    expect(result.current).toBe(true);

    const { result: otherResult } = renderHook(() => useIsWishlisted("202", "Food"));
    expect(otherResult.current).toBe(false);
  });

  it("reacts dynamically to wishlist_changed events", () => {
    const { result } = renderHook(() => useIsWishlisted("101", "Food"));
    expect(result.current).toBe(false);

    act(() => {
      localStorage.setItem("kashi_wishlist", JSON.stringify([
        { id: "101", title: "Malaiyyo", itemType: "Food", imageUrl: "" }
      ]));
      window.dispatchEvent(new Event("wishlist_changed"));
    });

    expect(result.current).toBe(true);
  });
});
