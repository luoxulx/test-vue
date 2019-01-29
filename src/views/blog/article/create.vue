<template>
  <simple-upload simple-value="https://file.tapd.cn/compress/compress_img/700?src=https://file.tapd.cn//tfl/pictures/201901/tapd_22218101_1547774819_44.png"/>
</template>

<script>
import SimpleUpload from '../components/SimpleUpload'
export default {
  name: 'Create',
  components: { SimpleUpload }
}
</script>
<style scoped>
  .back-to-ceiling {
    position: fixed;
    display: inline-block;
    text-align: center;
    cursor: pointer;
  }

  .back-to-ceiling:hover {
    background: #d5dbe7;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0
  }

  .back-to-ceiling .Icon {
    fill: #9aaabf;
    background: none;
  }
</style>
