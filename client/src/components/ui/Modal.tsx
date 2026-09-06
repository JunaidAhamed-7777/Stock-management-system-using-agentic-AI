import React, { useState } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  showCancel = true,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        backdrop-blur-sm
        items-center
        justify-center
      "
    >
      <div
        className="
          bg-white
          rounded-lg
          shadow-xl
          max-w-md
          w-full
          max-h-[90vh]
          overflow-y-auto
        "
      >
        <div className="flex items-top justify-between p-6">
          {title && (
            <h3 className="text-lg font-medium text-slate-900">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="
              rounded-full
              p-1
              text-slate-400
              hover:text-slate-600
              transition-colors
            "
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-6 border-t border-slate-200">
          {children}
          {showCancel || onConfirm ? (
            <div className="flex justify-end pt-2">
              {showCancel && (
                <button
                  onClick={onClose}
                  className="
                    rounded-md
                    px-3
                    py-2
                    text-sm
                    font-medium
                    text-slate-600
                    hover:bg-slate-100
                  "
                >
                  Cancel
                </button>
              )}
              {onConfirm && (
                <button
                  onClick={onConfirm}
                  className="
                    rounded-md
                    px-3
                    py-2
                    ms-2
                    text-sm
                    font-medium
                    text-white
                    bg-primary-600
                    hover:bg-primary-700
                  "
                >
                  {confirmText}
                </button>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};