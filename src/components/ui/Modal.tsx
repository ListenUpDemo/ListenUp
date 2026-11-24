import { useRef, useEffect, useId } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";
export default function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    if (open && !ref.current?.open) ref.current?.showModal();
    else if (!open && ref.current?.open) ref.current.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby={titleId}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex-between">
        <h2 id={titleId}>{title}</h2>
        <button className="icon-btn" aria-label="Đóng" onClick={onClose}>
          <X />
        </button>
      </div>
      {children}
    </dialog>
  );
}
