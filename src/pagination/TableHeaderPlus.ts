import { mergeAttributes } from "@tiptap/core";
import TableHeader from "@tiptap/extension-table-header";
import {
  backgroundColorAttr,
  paddingAttr,
  textAlignAttr,
  verticalAlignAttr,
  borderAttrs,
} from "../utilities/attributes";
import { cellStyle } from "../utilities/renderStyle";

export const TableHeaderPlus = TableHeader.extend({
  addNodeView() {
    return ({ node }) => {
      const tableNode = this.editor.extensionManager.extensions.find(
        (extension) => extension.name === "table",
      );
      const borderColor = tableNode ? tableNode.options.borderColor : "black";
      const dom = document.createElement("th");
      dom.style.border = `1px solid ${borderColor}`;
      let colspan = node.attrs.colspan;
      let rowspan = node.attrs.rowspan;
      const updateGrid = (colspan: number, rowspan: number) => {
        dom.style.gridColumn = `auto / span ${colspan || 1}`;
        dom.rowSpan = rowspan || 1;
        dom.setAttribute("colspan", `${colspan || 1}`);
      };

      updateGrid(colspan, rowspan);

      return {
        dom,
        contentDOM: dom,

        update(updatedNode) {
          if (updatedNode.type.name !== "tableHeader") {
            return false;
          }
          const updatedColspan = updatedNode.attrs.colspan;
          if (updatedColspan !== colspan) {
            colspan = updatedColspan;
            updateGrid(updatedColspan, rowspan);
          }
          return true;
        },
      };
    };
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: backgroundColorAttr(true),
      padding: paddingAttr(true),
      textAlign: textAlignAttr(true),
      verticalAlign: verticalAlignAttr(true),
      ...borderAttrs(true),
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    const { colspan, rowspan, colwidth, ...rest } = node.attrs;
    return [
      "th",
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

export default TableHeaderPlus;
