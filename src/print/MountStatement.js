const prettier = require("prettier");
const { group, concat, indent, line, hardline } = prettier.doc.builders;
const { EXPRESSION_NEEDED } = require("../util");

const formatDelay = delay => {
    return "" + delay / 1000 + "s";
};

const buildOpener = (node, path, print) => {
    const result = [];
    const firstGroup = ["{% mount"];
    const sourcePath = node.name ? "name" : "source";
    const printedSource = path.call(print, sourcePath);
    if (node.async === true) {
        firstGroup.push(" async");
    }
    firstGroup.push(" ", printedSource);

    if (node.key) {
        firstGroup.push(indent(concat([line, "as ", path.call(print, "key")])));
    }
    result.push(group(concat(firstGroup)));
    if (node.argument) {
        result.push(
            group(indent(concat([" with ", path.call(print, "argument")])))
        );
    }
    if (node.delayBy) {
        result.push(
            indent(
                concat([
                    line,
                    "delay placeholder by ",
                    formatDelay(node.delayBy)
                ])
            )
        );
    }

    result.push(concat([line, "%}"]));
    return group(concat(result));
};

const buildBody = (path, print) => {
    return indent(concat([hardline, path.call(print, "body")]));
};

const buildErrorHandling = (node, path, print) => {
    const parts = [];
    parts.push(concat([hardline, "{% catch "]));
    if (node.errorVariableName) {
        parts.push(path.call(print, "errorVariableName"), " ");
    }
    parts.push("%}");
    parts.push(indent(concat([hardline, path.call(print, "otherwise")])));
    return concat(parts);
};

const p = (node, path, print) => {
    node[EXPRESSION_NEEDED] = false;
    const parts = [buildOpener(node, path, print)];
    if (node.body) {
        parts.push(buildBody(path, print));
    }
    if (node.otherwise) {
        parts.push(buildErrorHandling(node, path, print));
    }
    if (node.body || node.otherwise) {
        parts.push(concat([hardline, "{% endmount %}"]));
    }

    return concat(parts);
};

module.exports = {
    printMountStatement: p
};
