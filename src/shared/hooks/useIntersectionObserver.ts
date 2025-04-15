import { useCallback, useEffect, useRef } from 'react';

interface ObserverOptions extends IntersectionObserverInit {}

/**
 * 커스텀 IntersectionObserver 훅
 * @param callback 요소가 뷰포트에 들어왔을 때 호출되는 함수
 * @param options IntersectionObserver 옵션 (root, rootMargin, threshold 등)
 */
const useIntersectionObserver = (
  callback: () => void,
  options: ObserverOptions,
) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const observe = useCallback(
    (node: Element | null) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      }, options);

      if (node) observer.current.observe(node);
    },
    [callback, options],
  );

  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  return observe;
};

export default useIntersectionObserver;
