export const formatSalary = (minSalary, maxSalary) => {
  const hasMin =
    minSalary !== undefined && minSalary !== null && minSalary !== "";

  const hasMax =
    maxSalary !== undefined && maxSalary !== null && maxSalary !== "";

  if (hasMin && hasMax) {
    return `$${Number(minSalary).toLocaleString()} - $${Number(
      maxSalary,
    ).toLocaleString()}`;
  }

  if (hasMin) {
    return `From $${Number(minSalary).toLocaleString()}`;
  }

  if (hasMax) {
    return `Up to $${Number(maxSalary).toLocaleString()}`;
  }

  return "Salary not specified";
};
