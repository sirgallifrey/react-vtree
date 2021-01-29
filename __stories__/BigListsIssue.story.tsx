/* eslint-disable max-depth */
import {number, withKnobs} from '@storybook/addon-knobs';
import {storiesOf} from '@storybook/react';
import React, {FC} from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import {
  FixedSizeNodeData,
  FixedSizeNodePublicState,
  FixedSizeTree,
  TreeWalker,
  TreeWalkerValue,
} from '../src';
import {NodeComponentProps} from '../src/Tree';
import { TreeNode, getRootNode } from './BigListIssueNodes.story';

document.body.style.margin = '0';
document.body.style.display = 'flex';
document.body.style.minHeight = '100vh';

const root = document.getElementById('root')!;
root.style.margin = '10px 0 0 10px';
root.style.flex = '1';

export type TreeData = FixedSizeNodeData &
  Readonly<{
    isLeaf: boolean;
    nestingLevel: number;
  }>;

  const rootNode = getRootNode();
const defaultTextStyle = {marginLeft: 10};
const defaultButtonStyle = {fontFamily: 'Courier New'};

type NodeMeta = Readonly<{
  nestingLevel: number;
  node: TreeNode;
}>;

const getNodeData = (
  node: TreeNode,
  nestingLevel: number,
): TreeWalkerValue<TreeData, NodeMeta> => ({
  data: {
    id: node.name,
    isLeaf: node.children.length === 0,
    isOpenByDefault: true,
    nestingLevel,
  },
  nestingLevel,
  node,
});

function* treeWalker(): ReturnType<TreeWalker<TreeData, NodeMeta>> {
  yield getNodeData(rootNode, 0);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    const parentMeta = yield;

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < parentMeta.node.children.length; i++) {
      yield getNodeData(
        parentMeta.node.children[i],
        parentMeta.nestingLevel + 1,
      );
    }
  }
}

const Node: FC<NodeComponentProps<
  TreeData,
  FixedSizeNodePublicState<TreeData>
>> = ({data: {isLeaf, id, nestingLevel}, isOpen, style, setOpen}) => (
  <div
    style={{
      ...style,
      alignItems: 'center',
      display: 'flex',
      marginLeft: nestingLevel * 30 + (isLeaf ? 48 : 0),
    }}
  >
    {!isLeaf && (
      <div>
        <button
          type="button"
          onClick={() => setOpen(!isOpen)}
          style={defaultButtonStyle}
        >
          {isOpen ? '-' : '+'}
        </button>
      </div>
    )}
    <div style={defaultTextStyle}>{id}</div>
  </div>
);

type TreePresenterProps = Readonly<{
  itemSize: number;
}>;

const TreePresenter: FC<TreePresenterProps> = ({itemSize}) => (
  <AutoSizer disableWidth>
    {({height}) => (
      <FixedSizeTree
        treeWalker={treeWalker}
        itemSize={itemSize}
        height={height}
        width="100%"
      >
        {Node}
      </FixedSizeTree>
    )}
  </AutoSizer>
);

storiesOf('Tree', module)
  .addDecorator(withKnobs)
  .add('Big List issue', () => (
    <TreePresenter itemSize={number('Row height', 30)} />
  ));
