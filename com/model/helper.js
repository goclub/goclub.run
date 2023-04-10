import {snakeCase} from "snake-case";

function strCamelToSnake(str) {
    return snakeCase(str);
}

function toCamel(str) {
    return str.replace(/(^|_)(\w)/g, (m, $1, $2) => $2.toUpperCase());
}

function firstLow(str) {
    if (str == "") {
        return "";
    }
    if (str == "ID") {
        return "id"
    }
    return str.replace(/(^|_)(\w)/g, (m, $1, $2) => $2.toLowerCase());
}

function snakeToCamel(str) {
    var out = toCamel(
        str.replace(/([-_][a-z])/g, function (group) {
            return group.toUpperCase().replace("-", "").replace("_", "");
        })
    ).replace(/Id$/, "ID");
    return out;
}

function indent(n) {
    if (!n) {
        n = 1
    }
    n *= 2
    return "\t".repeat(n);
}

function endSymbol(arr, index, a, b) {
    if (arr.length - 1 === index) {
        return b
    }
    return a
}

export default {
    toCamel,
    snakeToCamel,
    firstLow,
    indent,
    endSymbol,
}