import { ReactChild } from "react";
import Header from "./layout/Header";

export default function Layout({ children }: { children: ReactChild }) {
  return (
    <>
      <Header />
      <main className="container">
        {children}
      </main>
    </>
  )
}