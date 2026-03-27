import {
  getComputed,
  normalizeQuad,
  stripTransparent,
  stripBlack,
} from "./styleUtils";

// ── Individual reusable attribute definitions ──────────────────────────────

export const backgroundColorAttr = (keepOnSplit = true) => ({
  default: null,
  keepOnSplit,
  parseHTML: (el: HTMLElement) =>
    stripTransparent(getComputed(el, "background-color")),
  renderHTML: ({ backgroundColor }: any) =>
    backgroundColor ? { style: `background-color: ${backgroundColor}` } : {},
});

export const paddingAttr = (keepOnSplit = true) => ({
  default: null,
  keepOnSplit,
  parseHTML: (el: HTMLElement) => normalizeQuad(getComputed(el, "padding")),
  renderHTML: ({ padding }: any) =>
    padding ? { style: `padding: ${padding}` } : {},
});

export const heightAttr = (keepOnSplit = false) => ({
  default: null,
  keepOnSplit,
  parseHTML: (el: HTMLElement) =>
    getComputed(el, "height") || el.getAttribute("height"),
  renderHTML: ({ height }: any) =>
    height ? { style: `height: ${height}` } : {},
});

export const widthAttr = (keepOnSplit = false) => ({
  default: null,
  keepOnSplit,
  parseHTML: (el: HTMLElement) => el.style.width || el.getAttribute("width"),
  renderHTML: ({ width }: any) => (width ? { style: `width: ${width}` } : {}),
});

export const textAlignAttr = (keepOnSplit = true) => ({
  default: null,
  keepOnSplit,
  parseHTML: (el: HTMLElement) =>
    getComputed(el, "text-align") || el.getAttribute("align"),
  renderHTML: ({ textAlign }: any) =>
    textAlign ? { style: `text-align: ${textAlign}` } : {},
});

export const verticalAlignAttr = (keepOnSplit = true) => ({
  default: null,
  keepOnSplit,
  parseHTML: (el: HTMLElement) =>
    getComputed(el, "vertical-align") || el.getAttribute("valign"),
  renderHTML: ({ verticalAlign }: any) =>
    verticalAlign ? { style: `vertical-align: ${verticalAlign}` } : {},
});

// ── Border attrs as a group ────────────────────────────────────────────────
// These are almost always used together, so group them.
type Side = "Top" | "Right" | "Bottom" | "Left";
const SIDES: Side[] = ["Top", "Right", "Bottom", "Left"];

// Generates all 12 border attrs (style/width/color × 4 sides)
export const borderAttrs = (keepOnSplit = false) =>
  Object.fromEntries(
    SIDES.flatMap((side) => {
      const s = side.toLowerCase(); // e.g. 'top'
      return [
        [
          `border${side}Style`,
          {
            default: null,
            keepOnSplit,
            parseHTML: (el: HTMLElement) => {
              const v = getComputed(el, `border-${s}-style`);
              return v && v !== "none" ? v : null;
            },
            renderHTML: (attrs: any) => {
              const v = attrs[`border${side}Style`];
              return v ? { style: `border-${s}-style: ${v}` } : {};
            },
          },
        ],
        [
          `border${side}Width`,
          {
            default: null,
            keepOnSplit,
            parseHTML: (el: HTMLElement) =>
              getComputed(el, `border-${s}-width`),
            renderHTML: (attrs: any) => {
              const v = attrs[`border${side}Width`];
              return v ? { style: `border-${s}-width: ${v}` } : {};
            },
          },
        ],
        [
          `border${side}Color`,
          {
            default: null,
            keepOnSplit,
            parseHTML: (el: HTMLElement) =>
              stripBlack(getComputed(el, `border-${s}-color`)),
            renderHTML: (attrs: any) => {
              const v = attrs[`border${side}Color`];
              return v ? { style: `border-${s}-color: ${v}` } : {};
            },
          },
        ],
      ];
    }),
  );
