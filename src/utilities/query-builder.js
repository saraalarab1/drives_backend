const buildQueryConditions = (...args) => {
  if (args.length === 0) return "";
  let output = "";
  args.forEach((arg) => {
    if (!arg[1]) return;
    if (!output.includes("WHERE")) output = output.concat(" WHERE ");
    else output = output.concat(" AND ");
    if (arg[1].length ==2) output=output.concat(`${arg[0]} BETWEEN ${arg[1][0]} AND ${arg[1][1]}`);
    else  output = output.concat(`${arg[0]} = '${arg[1]}'`);
  });
  return output;
};

export default buildQueryConditions;
