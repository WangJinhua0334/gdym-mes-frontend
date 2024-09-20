import { PolylineEdge, PolylineEdgeModel } from "@logicflow/core";

class SequenceModel extends PolylineEdgeModel {
  setAttributes() {
    this.offset = 20;
    this.isAnimation = true;
  }
  getEdgeAnimationStyle() {
      const style = super.getEdgeAnimationStyle();
      style.strokeDasharray = "5 5";
      style.stroke = "#000";
      style.animationDuration = "50s";
      return style;
  }
  // getAnimation() {
  //   const animation = super.getAnimation();
  //   animation.stroke = "blue";
  //   return animation;
  // }
  // getEdgeStyle() {
  //   const style = super.getEdgeStyle();
  //   const { properties } = this;
  //   if (properties.isActived) {
  //     style.strokeDasharray = "4 4";
  //   }
  //   style.stroke = "#333";
  //   return style;
  // }
  getTextStyle() {
    const style = super.getTextStyle();
    style.color = "#0080ff";
    style.fontSize = 16;
    return style;
  }
  getOutlineStyle() {
    const style = super.getOutlineStyle();
    // style.stroke = "#0080ff";
    // style.hover.stroke = "#0080ff";
    return style;
  }
}

export default {
  type: "CustomEdge",
  view: PolylineEdge,
  model: SequenceModel
};
