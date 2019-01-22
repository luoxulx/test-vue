<template>
  <el-upload
    :on-success="simpleUploadSuccess"
    :show-file-list="false"
    :before-upload="beforeSimpleUpload"
    class="avatar-uploader"
    action="https://httpbin.org/post">
    <img v-if="simpleValue" :src="simpleValue" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
  </el-upload>
</template>

<script>
export default {
  props: {
    simpleValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      simpleFieldNowValue: ''
    }
  },
  methods: {
    simpleUploadSuccess(res, file) {
      this.simpleValue = file.files.file
    },
    beforeSimpleUpload(file) {
      const isLt4M = file.size / 1024 / 1024 < 4
      if (!isLt4M) {
        this.$message.error('不能超过 4MB!')
        return false
      }
      return true
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
