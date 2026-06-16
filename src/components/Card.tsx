import React from 'react'

export default function Card({ title, content }: { title: string; content: string }) {
  return (
    <article className="card">
      <h3 className="card-title">{title}</h3>
      <p className="card-content">{content}</p>
    </article>
  )
}
