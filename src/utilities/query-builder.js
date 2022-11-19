const buildQueryConditions = (...args) => {
  if (args.length === 0) return "";
  let output = "";
  args.forEach((arg) => {
    if (!arg) return;
    const [key, value, comparator = "="] = arg;
    if (
      !value ||
      (value.length === 2 &&
        (value.includes(undefined) || value.includes("undefined")))
    )
      return;
    if (!output.includes("WHERE")) output = output.concat(" WHERE ");
    else output = output.concat(" AND ");
    if (value.length === 2)
      output = output.concat(`${key} BETWEEN '${value[0]}' AND '${value[1]}'`);
    else output = output.concat(`${key} ${comparator} '${value}'`);
  });
  return output;
};

export default buildQueryConditions;
