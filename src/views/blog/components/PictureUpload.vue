<template>
  <div class="createPost-container">
    <el-upload
      :data="tempPictureObject"
      :multiple="false"
      :show-file-list="false"
      :on-success="handlePictureSuccess"
      :before-upload="beforePictureUpload"
      action="http://up.qiniup.com"
      class="avatar-uploader">
      <img v-if="tempPictureUrl" :src="tempPictureUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"/>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/api/qiniu'
// 获取七牛token 后端通过Access Key,Secret Key,bucket等生成token
// 七牛官方sdk https://developer.qiniu.com/sdk#official-sdk

export default{
  name: 'PictureUpload',
  data() {
    return {
      tempPictureObject: { token: '', key: '' },
      tempPictureUrl: ''
    }
  },
  methods: {
    beforePictureUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!')
        return false
      }
      const _self = this
      return new Promise((resolve, reject) => {
        getToken().then(response => {
          var ext = this.getFileExt(file.name)
          if (!ext) {
            reject(false)
          }
          console.log(response)
          const key = response.data.qiniu_key
          const token = response.data.qiniu_token
          _self._data.tempPictureObject.token = token
          _self._data.tempPictureObject.key = 'test_file2/' + key + ext
          resolve(true)
        }).catch(err => {
          console.log(err)
          reject(false)
        })
      })
    },
    handlePictureSuccess(res, file) {
      this.tempPictureUrl = URL.createObjectURL(file.raw)
      this.$message.success('successful to qiniu')
    },
    getFileExt(filename) {
      var index1 = filename.lastIndexOf('.')
      return filename.substring(index1, filename.length)
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
