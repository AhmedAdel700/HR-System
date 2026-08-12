import { useRef, type MouseEvent, type RefObject } from "react";

export interface ModalTriggerRef {
  triggerRef: RefObject<HTMLElement | null>;
  bindTrigger: (event: MouseEvent<HTMLElement>) => void;
}

export function useModalTriggerRef(): ModalTriggerRef {
  const triggerRef = useRef<HTMLElement | null>(null);

  const bindTrigger = (event: MouseEvent<HTMLElement>): void => {
    triggerRef.current = event.currentTarget;
  };

  return { triggerRef, bindTrigger };
}
