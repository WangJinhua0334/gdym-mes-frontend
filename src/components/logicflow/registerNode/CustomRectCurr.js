import { RectNode, RectNodeModel } from "@logicflow/core";

// 提供节点
class CustomRectNode extends RectNode {
  /* 
  getShape() {
    const { model, graphModel } = this.props;
    // ...
  }
  */
}

// 提供节点的属性
class CustomRectCurrModel extends RectNodeModel {
  initNodeData(data) {
    super.initNodeData(data);
    /**
     * 实际就是对于图形SVG的属性
     * http://logic-flow.org/guide/basic/node.html#%E8%AE%A4%E8%AF%86logicflow%E7%9A%84%E5%9F%BA%E7%A1%80%E8%8A%82%E7%82%B9
     */
    this.width = 130;
    this.height = 60;
    this.radius = 10;
    this.status = data.properties.status
  }
  getNodeStyle() {
    const style = super.getNodeStyle();
    console.log(style)
    if(this.status == 'completed'){
      style.stroke = '#75D701';
      style.fill = '#99f19e';
    }else if(this.status == 'wait_product'){
      style.stroke = '#A9B4C0';
      style.fill = '#E2E6E6';
    }else if(this.status == 'producting'){
      style.stroke = '#f27d0c';
      style.fill = '#FFCF4B';
    }else if(this.status == 'ng'){
      style.stroke = '#F44336';
      style.fill = '#FF4500';
    }else if(this.status == 'scraped'){
      style.stroke = '#1F4E79';
      style.fill = '#3A7CA5';
    }else{
      style.stroke = '#8EC0E4';
      style.fill = '#D4DFE6';
    }
    return style;
  }
  getTextStyle() {
    const style = super.getTextStyle();
    style.fontSize = 16;
    style.color = "#000";
    style.overflowMode = 'autoWrap';
    return style;
  }
}

export default {
  type: "CustomRectCurr",
  view: CustomRectNode,
  model: CustomRectCurrModel
}
