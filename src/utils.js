export const findItemInTree = (id, tree) => {
  let result = null;
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === id) {
      result = tree[i];
      break;
    } else if (tree[i].nodes) {
      result = findItemInTree(id, tree[i].nodes);
      if (result) {
        break;
      }
    }
  }
  return result;
};

export const findEmployeeById = (id, employees) => {
  let result = null;
  for (let i = 0; i < employees.length; i++) {
    if (employees[i].id === id) {
      result = employees[i];
      break;
    }
  }
  return result;
};
