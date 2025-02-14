const prettier = require("prettier");
const { group, indent, line, hardline, concat } = prettier.doc.builders;
const { EXPRESSION_NEEDED } = require("../util");

const printIfClause = (node, path, print) => {
    const parts = ["{% for "];
    if (node.keyTarget) {
        parts.push(path.call(print, "keyTarget"), ", ");
    }
    parts.push(
        path.call(print, "valueTarget"),
        " in ",
        path.call(print, "sequence")
    );
    if (node.condition) {
        parts.push(
            indent(concat([line, "if ", path.call(print, "condition")]))
        );
    }
    parts.push(concat([line, "%}"]));
    return group(concat(parts));
};

const indentWithHardline = contents => indent(concat([hardline, contents]));

const p = (node, path, print) => {
    node[EXPRESSION_NEEDED] = false;
    const parts = [printIfClause(node, path, print)];
    const printedChildren = path.call(print, "body");
    parts.push(indentWithHardline(printedChildren));
    if (node.otherwise) {
        parts.push(hardline, "{% else %}");
        const printedOtherwise = path.call(print, "otherwise");
        parts.push(indentWithHardline(printedOtherwise));
    }
    parts.push(hardline, "{% endfor %}");

    return concat(parts);
};

module.exports = {
    printForStatement: p
};
