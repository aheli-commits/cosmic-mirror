import React, { useEffect, useRef, useState } from 'react'

export default function Card({ title, content }: { title: string; content: string }) {
  const [expanded, setExpanded] = useState(false)
  const [hasOverflow, setHasOverflow] = useState(false)
  const bodyRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = bodyRef.current
    if (!el) return

    // compute a reasonable collapsed height (approx. 5 lines)
    const cs = getComputedStyle(el)
    const lineHeight = parseFloat(cs.lineHeight) || 24
    const collapsedLines = 5
    const collapsedPx = lineHeight * collapsedLines

    // check if content overflows the collapsed height
    const isOverflowing = el.scrollHeight > collapsedPx + 1
    setHasOverflow(isOverflowing)
  }, [content])

  return (
    <article className="card" aria-live="polite">
      <h3 className="card-title">{title}</h3>

      <div
        ref={bodyRef}
        className={`card-body ${expanded ? 'expanded' : 'collapsed'}`}
        style={{
          // CSS transition is handled in stylesheet; maxHeight controlled by class
        }}
      >
        <p className="card-content">{content}</p>
      </div>

      {hasOverflow && (
        <button
          className="card-toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded(e => !e)}
        >
          {expanded ? 'See less' : 'See more…'}
        </button>
      )}
    </article>
  )
}
