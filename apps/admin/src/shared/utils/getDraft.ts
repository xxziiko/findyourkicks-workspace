export function getDraft<T>() {
  const draft = localStorage.getItem('draft');
  return draft ? (JSON.parse(draft) as T) : null;
}
