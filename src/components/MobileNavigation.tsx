"use client";

import Link from "next/link";
import { useState } from "react";
import type { NavItem } from "@/types/content";
import { CloseIcon, MenuIcon } from "./icons";

export function MobileNavigation({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-nav">
      <button className="icon-button" type="button" aria-label="Menü öffnen" aria-expanded={open} onClick={() => setOpen(true)}>
        <MenuIcon />
      </button>
      {open ? (
        <div className="mobile-nav__panel" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          <button className="icon-button mobile-nav__close" type="button" aria-label="Menü schließen" onClick={() => setOpen(false)}>
            <CloseIcon />
          </button>
          <nav>
            {items.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link className="button button--primary" href="/de/kontakt" onClick={() => setOpen(false)}>
              Kontakt
            </Link>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
