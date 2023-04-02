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
    return str.replace(/(^|_)(\w)/g, (m, $1, $2) => $2.toLowerCase());
}

function snakeToCamel(str) {
    var out = strToCamel(
        str.replace(/([-_][a-z])/g, function (group) {
            return group.toUpperCase().replace("-", "").replace("_", "");
        })
    ).replace(/Id$/, "ID");
    return out;
}


export default {
    toCamel,
    snakeToCamel,
    firstLow,
}