import { TableCell } from "@tiptap/extension-table-cell";
import { mergeAttributes } from "@tiptap/core";
import {
  backgroundColorAttr,
  paddingAttr,
  textAlignAttr,
  verticalAlignAttr,
  borderAttrs,
} from "../utilities/attributes";
import { cellStyle } from "../utilities/renderStyle";
import { Node as ProsemirrorNode } from "prosemirror-model";

export const TableCellPlus = TableCell.extend({
  addNodeView() {
    return ({ node }) => {
      // const tableNode = this.editor.extensionManager.extensions.find(
      //   (extension) => extension.name === "table",
      // );
      // const borderColor = tableNode ? tableNode.options.borderColor : "black";
      const dom = document.createElement("td");
      const contentDOM = document.createElement("div");
      dom.appendChild(contentDOM);
      Object.assign(dom.style, cellStyle(node.attrs));
      applyCellAttrs(dom, node);
      return {
        dom,
        contentDOM,

        update(updatedNode) {
          if (updatedNode.type.name !== "tableCell") return false;
          applyCellAttrs(dom, updatedNode);
          return true;
        },
      };
    };
  },
  addAttributes() {
    const borders = borderAttrs(true);
    console.log({ ...borders });
    return {
      ...this.parent?.(),
      backgroundColor: backgroundColorAttr(true),
      padding: paddingAttr(true),
      textAlign: textAlignAttr(true),
      verticalAlign: verticalAlignAttr(true),
      ...borders,
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    const { colspan, rowspan, colwidth, ...rest } = node.attrs;
    return [
      "td",
      mergeAttributes(HTMLAttributes, {
        colspan,
        rowspan,
        ...(colwidth ? { "data-colwidth": colwidth } : {}),
        ...cellStyle(rest),
      }),
      0,
    ];
  },
});

function applyCellAttrs(
  dom: HTMLTableCellElement,
  node: ProsemirrorNode,
): void {
  const {
    colspan,
    rowspan,
    backgroundColor,
    padding,
    textAlign,
    verticalAlign,
    borderTopStyle,
    borderRightStyle,
    borderBottomStyle,
    borderLeftStyle,
    borderTopWidth,
    borderRightWidth,
    borderBottomWidth,
    borderLeftWidth,
    borderTopColor,
    borderRightColor,
    borderBottomColor,
    borderLeftColor,
  } = node.attrs;

  // Grid / span
  dom.style.gridColumn = `auto / span ${colspan || 1}`;
  dom.rowSpan = rowspan || 1;
  dom.setAttribute("colspan", String(colspan || 1));
  dom.setAttribute("rowspan", String(rowspan || 1));

  // Reset before reapplying so cleared attrs don't linger
  dom.removeAttribute("style");
  dom.style.gridColumn = `auto / span ${colspan || 1}`; // restore after reset
  Object.assign(dom.style, {
    backgroundColor,
    padding,
    textAlign,
    verticalAlign,
    borderTopStyle,
    borderRightStyle,
    borderBottomStyle,
    borderLeftStyle,
    borderTopWidth,
    borderRightWidth,
    borderBottomWidth,
    borderLeftWidth,
    borderTopColor,
    borderRightColor,
    borderBottomColor,
    borderLeftColor,
  } as Record<string, string | null | undefined>);
}

export default TableCellPlus;
