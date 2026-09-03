import { createElement, type ReactNode } from "react";

export const Container = ({ children }: { children: ReactNode }) =>
  createElement("div", { className: "max-w-7xl mx-auto p-4" }, children);
