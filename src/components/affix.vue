<template>
  <div>
    <div ref="ontology" :style="ontologyStyle">
      <slot></slot>
    </div>
    <div v-show="showSubstitute" :style="substituteStyle"></div>
  </div>
</template>

<script>

/**
 * @function getPageOffset - 获取文档 [向上 | 向左] 滚动的像素。
 * @argument {boolean} [top=true] - 选择获取流动像素的方向。
 * @returns {number}
 */
function getPageOffset(top = true) {
  const prop = top ? 'pageYOffset' : 'pageXOffse';
  let currentOffset = window[prop];

  if (typeof currentOffset !== 'number') {
    const downgradProp = top ? 'scrollTop' : 'scrollLeft';
    currentOffset = document.documentElement[downgradProp];
  }

  return currentOffset;
}

/**
 * @function getOffset - 获取元素相对于文档距离（=元素距视口的距离+文档滚动的距离）
 * @argument {object} element
 * @returns {object} top and left
 */
function getOffset(element) {
  const rect = element.getBoundingClientRect();

  const pageScrollTop = getPageOffset();
  const pageScrollLeft = getPageOffset(false);

  return {
    top: rect.top + pageScrollTop,
    left: rect.left + pageScrollLeft,
  };
}

export default {
  name: 'affix',
  props: {
    offsetTop: {
      type: Number,
      default: 0,
    },
    offsetBottom: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      ontologySize: {},
      ontologyOffset: {},
      ontologyStyle: {}, // 组件本体的样式
      showSubstitute: false, // 是否显示替身（用于占位）
      substituteStyle: {}, // 替身的样式（宽、高）
    };
  },
  computed: {
    offsetType() { // 获取元素是向上固定还是向下固定
      let type = 'top';
      if (typeof this.offsetBottom === 'number') {
        type = 'bottom';
      }
      return type;
    },
  },
  methods: {
    handleScroll() {
      // 如果
      // * 此时 offsetTop 为向上固定
      // * 且页面滚动距离+props.offsetTop 大于 元素的 offsetTop
      // 则主体变为固定定位，替身出现
      // ! 判断 getPageOffset() !==0 是因为如果设置的offsetTop值大于元素本身的距离页面顶端的高度
      // ! 那么当页面滚动到顶部后也无法将元素还原，所以当页面滚动到顶部后强制还原组件。
      if (this.offsetType === 'top' &&
        (getPageOffset() + this.offsetTop) > this.ontologyOffset.top &&
        getPageOffset() !== 0) {
        this.showSubstitute = true;
        this.substituteStyle = {
          width: `${this.ontologySize.width}px`,
          height: `${this.ontologySize.height}px`,
        };

        this.ontologyStyle = {
          position: 'fixed',
          width: `${this.ontologySize.width}px`,
          height: `${this.ontologySize.height}px`,
          top: `${this.offsetTop}px`,
          left: `${this.ontologyOffset.left}px`,
        };
      } else if (this.offsetType === 'bottom' &&
        (getPageOffset() + (window.innerHeight - this.offsetBottom)) <
          this.ontologyOffset.top + this.ontologySize.height) {
        this.showSubstitute = true;
        this.substituteStyle = {
          width: `${this.ontologySize.width}px`,
          height: `${this.ontologySize.height}px`,
        };

        this.ontologyStyle = {
          position: 'fixed',
          bottom: `${this.offsetBottom}px`,
          left: `${this.ontologyOffset.left}px`,
          width: `${this.ontologySize.width}px`,
          height: `${this.ontologySize.height}px`,
        };
      } else {
        // 还原组件为正常状态
        this.showSubstitute = false;
        this.substituteStyle = {};
        this.ontologyStyle = {};
      }
    },
    initial() {
      // 初始化主体相对于页面的距离
      this.ontologyOffset =
        Object.assign({}, getOffset(this.$refs.ontology));

      // 初始化主体的 width height 值
      this.ontologySize = {
        width: this.$refs.ontology.clientWidth,
        height: this.$refs.ontology.clientHeight,
      };
    },
  },
  mounted() {
    this.$nextTick(() => {
      // 初始化元素位置与大小
      this.initial();
      // 实时监听
      window.addEventListener('scroll', this.handleScroll, false);
      window.addEventListener('resize', this.handleScroll, false);

      // 窗口大小改变时重新获取元素位置与大小
      window.addEventListener('resize', this.initial, false);
    });
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll, false);
    window.removeEventListener('resize', this.handleScroll, false);
    window.removeEventListener('resize', this.initial, false);
  },
};

</script>
