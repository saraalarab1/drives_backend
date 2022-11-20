export function generateCreateQuery(attributes, values, table) {
    let sqlQuery = `INSERT INTO ${table} (`;
    for (let i = 0; i < attributes.length; i++) {
        sqlQuery += attributes[i];
        if (i != attributes.length - 1) {
            sqlQuery += ", ";
        }

    }
    sqlQuery += ") VALUES";
    for (let i = 0; i < values.length; i++) {
        sqlQuery += "(";
        for (let j = 0; j < values[i].length; j++) {
            sqlQuery += typeof(values[i][j]) != "string" ? values[i][j] : `'${values[i][j]}'`;
            if (j < values[i].length - 1) sqlQuery += ", ";
        }
        if (i < values.length - 1) {
            sqlQuery += "), ";
        } else sqlQuery += ");"
    }
    return sqlQuery;
}

export function generateDeleteQuery(value, attribute, table) {
    let sqlQuery = `DELETE FROM ${table} WHERE ${attribute}=${value};`
    return sqlQuery;
}


export function fetchData(par) {
    var attributes = [];
    var values = [];
    for (const [key, value] of Object.entries(par)) {
        attributes.push(key);
        values.push(value);
    }
    return [attributes, values];
}
export function formatTime(time) {
    return ("0" + time.getHours()).slice(-2) + ":" +
        ("0" + time.getMinutes()).slice(-2) + ":" +
        ("0" + time.getSeconds()).slice(-2);
}

export function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}