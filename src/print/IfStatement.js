const prettier = require("prettier");
const { group, indent, line, hardline, concat } = prettier.doc.builders;
const { EXPRESSION_NEEDED, printChildBlock } = require("../util");
const { Node } = require("melody-types");

const IS_ELSEIF = Symbol("IS_ELSEIF");

const p = (node, path, print) => {
    node[EXPRESSION_NEEDED] = false;
    const hasElseBranch =
        Array.isArray(node.alternate) && node.alternate.length > 0;
    const hasElseIfBranch = Node.isIfStatement(node.alternate);
    const isElseIf = node[IS_ELSEIF] === true;

    const ifClause = group(
        concat([
            "{% ",
            isElseIf ? "elseif" : "if",
            indent(concat([line, path.call(print, "test")])),
            line,
            "%}"
        ])
    );
    const ifBody = printChildBlock(node, path, print, "consequent");
    const parts = [ifClause, ifBody];
    if (hasElseBranch) {
        parts.push(hardline, "{% else %}");
        parts.push(printChildBlock(node, path, print, "alternate"));
    } else if (hasElseIfBranch) {
        node.alternate[IS_ELSEIF] = true;
        parts.push(hardline);
        parts.push(path.call(print, "alternate"));
    }
    // The {% endif %} will be taken care of
    // by the final step in the recursion
    if (!hasElseIfBranch) {
        parts.push(hardline, "{% endif %}");
    }
    return concat(parts);
};

module.exports = {
    printIfStatement: p
};
