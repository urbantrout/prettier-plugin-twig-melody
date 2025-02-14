const prettier = require("prettier");
const { concat, line, indent, group } = prettier.doc.builders;
const {
    EXPRESSION_NEEDED,
    needsExpressionEnvironment,
    wrapInEnvironment
} = require("../util");

const p = (node, path, print) => {
    node[EXPRESSION_NEEDED] = false;

    const rest = [line, "?"];
    if (node.consequent) {
        rest.push(concat([" ", path.call(print, "consequent")]));
    }
    if (node.alternate) {
        rest.push(line, ": ", path.call(print, "alternate"));
    }
    const parts = [path.call(print, "test"), indent(concat(rest))];
    if (needsExpressionEnvironment(path)) {
        wrapInEnvironment(parts);
    }

    return group(concat(parts));
};

module.exports = {
    printConditionalExpression: p
};
