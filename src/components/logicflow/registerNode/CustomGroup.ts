// CustomGroup.js
import { GroupNode } from "@logicflow/extension";

class CustomGroup extends GroupNode.view {}

class MyGroupModel extends GroupNode.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.isRestrict = true;
    this.resizable = true;
    this.width = data.width ? data.width : 500;
    this.height = data.height ? data.height : 150;
  }
  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = "#AEAFAE";
    style.strokeWidth = 1;
    return style;
  }
}

export default {
  type: "CustomGroup",
  model: MyGroupModel,
  view: CustomGroup
};
