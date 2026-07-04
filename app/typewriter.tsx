"use client";

import React from "react";

export default function Typewriter({
  words,
  className = "",
}: {
  words: string[];
  className?: string;
}) {
  const [text, setText] = React.useState("");
  const [wordIndex, setWordIndex] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    const currentWord = words[wordIndex];
    const speed = isDeleting ? 40 : 100;

    if (!isDeleting && text === currentWord) {
      const t = setTimeout(() => setIsDeleting(true), 1500);
      return () => clearTimeout(t);
    }

    if (isDeleting && text === "") {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setText(
        isDeleting
          ? currentWord.substring(0, text.length - 1)
          : currentWord.substring(0, text.length + 1)
      );
    }, speed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words]);

  return (
    <span className={`inline-block ${className}`}>
      {text}
      <span className="inline-block w-[3px] h-[0.85em] bg-accent ml-1 align-middle animate-pulse" />
    </span>
  );
}
