// ── CSS helpers ────────────────────────────────────────────────────────────

export function getComputed(el: HTMLElement, prop: string): string | null {
  if (typeof window !== "undefined") {
    // document.body.appendChild(el);
    const elSkeleton = document.createElement(el.nodeName);
    elSkeleton.style.cssText = el.style.cssText;
    document.body.appendChild(elSkeleton); //TODO
    const style =
      window.getComputedStyle(elSkeleton).getPropertyValue(prop) || null;
    // console.log({ el, prop, style });
    document.body.removeChild(elSkeleton);
    return style;
  }
  return el.style.getPropertyValue(prop) || null;
}

export function normalizeQuad(value: string | null): string | null {
  if (!value) return null;
  const parts = value.trim().split(/\s+/);
  if (parts.length === 4 && parts.every((p) => p === parts[0])) return parts[0];
  if (parts.length === 4 && parts[0] === parts[2] && parts[1] === parts[3])
    return `${parts[0]} ${parts[1]}`;
  console.log("hi from normalizeQuad");
  return value;
}

export function stripTransparent(value: string | null): string | null {
  return value?.replace(/rgba?\(0,\s*0,\s*0,\s*0\)/, "").trim() || null;
}

export function stripBlack(value: string | null): string | null {
  return value?.match(/rgba?\(0,\s*0,\s*0/) ? null : (value ?? null);
}

// ── Style builder ──────────────────────────────────────────────────────────

export function buildStyle(
  pairs: Array<[condition: unknown, rule: string]>,
): Record<string, string> {
  const style = pairs
    .filter(([condition]) => !!condition)
    .map(([, rule]) => rule)
    .join("; ");
  return style ? { style } : {};
}
