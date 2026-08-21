import React, { useEffect, useRef, useState } from "react";

/**
 * Wide markdown tables have to scroll inside the content column rather than
 * push the whole page sideways. Whatever does that scrolling has to be
 * reachable by keyboard, so it needs `tabindex="0"` and a named
 * `role="region"` — a bare `overflow-x: auto` box is unreachable without a
 * pointer, and the content inside it becomes unreadable for keyboard users.
 *
 * The attributes are only applied once the wrapper actually overflows.
 * Applying them unconditionally would add a stray tab stop, a landmark and a
 * swipe hint to every narrow table on the site.
 */
export default function MarkdownTable(props) {
  const wrapperRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return undefined;
    }

    const measure = () =>
      setIsScrollable(wrapper.scrollWidth - wrapper.clientWidth > 1);

    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }

    // Watch the table as well as the wrapper: the wrapper tracks the content
    // column, the table tracks its own content width, and either can change
    // whether the pair overflows.
    const observer = new ResizeObserver(measure);
    observer.observe(wrapper);
    if (wrapper.firstElementChild) {
      observer.observe(wrapper.firstElementChild);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={
        isScrollable ? "table-wrapper table-wrapper--scrollable" : "table-wrapper"
      }
      tabIndex={isScrollable ? 0 : undefined}
      role={isScrollable ? "region" : undefined}
      aria-label={isScrollable ? "Scrollable table" : undefined}
    >
      <table {...props} />
    </div>
  );
}
