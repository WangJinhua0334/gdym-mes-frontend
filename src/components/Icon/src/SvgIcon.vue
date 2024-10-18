<template>
  <svg :class="[prefixCls, $attrs.class, spin && 'svg-icon-spin']" :style="getStyle" aria-hidden="true" @click="$emit('click')">
    <use :xlink:href="symbolId" />
  </svg>
</template>
<script lang="ts">
  import type { CSSProperties } from 'vue';
  import { defineComponent, computed } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    name: 'SvgIcon',
    props: {
      prefix: {
        type: String,
        default: 'icon',
      },
      name: {
        type: String,
        required: true,
      },
      size: {
        type: [Number, String],
        default: 16,
      },
      spin: {
        type: Boolean,
        default: false,
      },
    },
    setup(props) {
      const { prefixCls } = useDesign('svg-icon');
      let iconurl = props.name;
      const SVG_END_WITH_FLAG = '|svg';
      const isSvgIcon = computed(() => props.name?.endsWith(SVG_END_WITH_FLAG));
      if (isSvgIcon.value) {
        iconurl = props.name.replace(SVG_END_WITH_FLAG, '');
      } else {
        iconurl = props.name;
      }
      const symbolId = computed(() => `#${props.prefix}-${iconurl}`);

      const getStyle = computed((): CSSProperties => {
        const { size } = props;
        let s = `${size}`;
        s = `${s.replace('px', '')}px`;
        return {
          width: s,
          height: s,
        };
      });
      return { symbolId, prefixCls, getStyle };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-svg-icon';

  .@{prefix-cls} {
    display: inline-block;
    overflow: hidden;
    vertical-align: -0.15em;
    fill: currentColor;
  }

  .svg-icon-spin {
    animation: loadingCircle 1s infinite linear;
  }
</style>
