const prettier = require("prettier");
const { concat, hardline, group } = prettier.doc.builders;
const { Node } = require("melody-types");
const { processChildExpressions } = require("../util");

const p = (node, path, print) => {
    const hasChildren = Array.isArray(node.body) && node.body.length > 0;

    if (hasChildren) {
        const blockName = path.call(print, "name");
        const opener = concat(["{% block ", blockName, " %}"]);
        const printedBody = path.map(print, "body");
        const indentedBody = processChildExpressions(printedBody);
        const result = group(
            concat([
                opener,
                indentedBody,
                hardline,
                "{% endblock " + blockName + " %}"
            ])
        );
        return result;
    } else if (Node.isPrintExpressionStatement(node.body)) {
        const parts = [
            "{% block ",
            path.call(print, "name"),
            " ",
            path.call(print, "body", "value"),
            " %}"
        ];
        return concat(parts);
    }
};

module.exports = {
    printBlockStatement: p
};
