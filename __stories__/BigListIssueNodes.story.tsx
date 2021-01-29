export type TreeNode = Readonly<{
  children: TreeNode[];
  name: string;
}>;

const createNode = (depth: number = 0, name: number = 1, parentName: string = 'Root', children: number = 5): TreeNode => {
  const node: TreeNode = {
    children: [],
    name: `${parentName}.${name}`,
  };

  if (depth === 1) {
    return node;
  }

  for (let i = 0; i < children; i++) {
    node.children.push(createNode(depth + 1, i + 1, node.name));
  }

  return node;
};

export function getRootNode (): TreeNode {
  return {
    name: 'Root',
    children: [
      createNode(),
      // 32767 is precisely the minimum number of child nodes needed to trigger the issue.
      // one child less and it works perfectly.
      createNode(0, 2, 'Root', 32767),
      createNode(0, 3),
      createNode(0, 4),
      createNode(0, 5),
    ]
  };
}

