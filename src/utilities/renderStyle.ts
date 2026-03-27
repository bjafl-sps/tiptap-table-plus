type BorderAttrs = {
  borderTopStyle?: string | null;
  borderRightStyle?: string | null;
  borderBottomStyle?: string | null;
  borderLeftStyle?: string | null;
  borderTopWidth?: string | null;
  borderRightWidth?: string | null;
  borderBottomWidth?: string | null;
  borderLeftWidth?: string | null;
  borderTopColor?: string | null;
  borderRightColor?: string | null;
  borderBottomColor?: string | null;
  borderLeftColor?: string | null;
};

type Sides = [
  string | null | undefined,
  string | null | undefined,
  string | null | undefined,
  string | null | undefined,
];
type BorderPropType = "width" | "style" | "color";
// Collapse [top, right, bottom, left] to shorthand if possible, else return
// individual rules. Returns an array of CSS rule strings.
function collapseBorderProp(
  prop: BorderPropType,
  sides: Sides,
  //   defaultStyle: Record<BorderPropType, string> | undefined = {
  //     width: "1px",
  //     style: "dashed",
  //     color: "rgb(91, 91, 91)",
  //   },
): string[] {
  const [t, r, b, l] = sides.map((v) => v || null); //(defaultStyle[prop] ?? null));
  console.log({ t, r, b, l });
  // All four equal → single shorthand
  if (t && t === r && r === b && b === l) return [`border-${prop}: ${t}`];

  // Opposite pairs equal → two-value shorthand
  if (t && b && t === b && r && l && r === l)
    return [`border-${prop}: ${t} ${r}`];

  // Otherwise emit only the sides that are set
  return [
    t && `border-top-${prop}: ${t}`,
    r && `border-right-${prop}: ${r}`,
    b && `border-bottom-${prop}: ${b}`,
    l && `border-left-${prop}: ${l}`,
  ].filter(Boolean) as string[];
}

export function borderStyle(attrs: BorderAttrs): string[] {
  return [
    ...collapseBorderProp("style", [
      attrs.borderTopStyle,
      attrs.borderRightStyle,
      attrs.borderBottomStyle,
      attrs.borderLeftStyle,
    ]),
    ...collapseBorderProp("width", [
      attrs.borderTopWidth,
      attrs.borderRightWidth,
      attrs.borderBottomWidth,
      attrs.borderLeftWidth,
    ]),
    ...collapseBorderProp("color", [
      attrs.borderTopColor,
      attrs.borderRightColor,
      attrs.borderBottomColor,
      attrs.borderLeftColor,
    ]),
  ];
}

// ── Per-node style builders for renderHTML ─────────────────────────────────

type CellAttrs = {
  backgroundColor?: string | null;
  padding?: string | null;
  borderStyle?: string | null;
  borderWidth?: string | null;
  borderColor?: string | null;
  textAlign?: string | null;
  verticalAlign?: string | null;
};

export function cellStyle(attrs: CellAttrs & BorderAttrs) {
  const rules = [
    attrs.backgroundColor && `background-color: ${attrs.backgroundColor}`,
    attrs.padding && `padding: ${attrs.padding}`,
    attrs.textAlign && `text-align: ${attrs.textAlign}`,
    attrs.verticalAlign && `vertical-align: ${attrs.verticalAlign}`,
    ...borderStyle(attrs),
  ]
    .filter(Boolean)
    .join("; ");

  return rules ? { style: rules } : {};
}

type RowAttrs = {
  backgroundColor?: string | null;
  height?: string | null;
  borderStyle?: string | null;
  borderWidth?: string | null;
  borderColor?: string | null;
};

export function rowStyle(attrs: RowAttrs & BorderAttrs) {
  const rules = [
    attrs.backgroundColor && `background-color: ${attrs.backgroundColor}`,
    attrs.height && `height: ${attrs.height}`,
    ...borderStyle(attrs),
  ]
    .filter(Boolean)
    .join("; ");

  return rules ? { style: rules } : {};
}

type TableAttrs = {
  width?: string | null;
  backgroundColor?: string | null;
  borderStyle?: string | null;
  borderWidth?: string | null;
  borderColor?: string | null;
  borderCollapse?: string | null;
};

export function tableStyle(attrs: TableAttrs & BorderAttrs) {
  const rules = [
    attrs.backgroundColor && `background-color: ${attrs.backgroundColor}`,
    attrs.width && `width: ${attrs.width}`,
    attrs.borderCollapse && `borderCollapse: ${attrs.borderCollapse}`,
    ...borderStyle(attrs),
  ]
    .filter(Boolean)
    .join("; ");
  console.log("tblRules", { rules });
  return rules ? { style: rules } : {};
}
