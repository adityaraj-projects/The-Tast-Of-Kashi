export function openHistory(name: string) {
  window.dispatchEvent(new CustomEvent("open_history", { detail: { name } }));
}
