<template>
  <div class="createPost-container">
    <el-upload
      :data="dataObj"
      :multiple="false"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :before-upload="beforeUpload"
      action="http://up.qiniup.com"
      list-type="picture">
      <el-button size="small" type="primary">点击上传</el-button>
      <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
    </el-upload>

    <el-dialog :visible.sync="dialogImage">
      <img :src="dialogImageUrl" width="100%" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/api/qiniu'
// 获取七牛token 后端通过Access Key,Secret Key,bucket等生成token
// 七牛官方sdk https://developer.qiniu.com/sdk#official-sdk

export default{
  name: 'TestUp',
  data() {
    return {
      dialogImage: false,
      dialogImageUrl: '',
      dataObj: { token: '', key: '' },
      image_uri: [],
      fileList: []
    }
  },
  methods: {
    beforeUpload(file) {
      const _self = this
      return new Promise((resolve, reject) => {
        getToken().then(response => {
          console.log(file)
          console.log(1)
          var ext = this.getFileExt(file.name)
          if (!ext) {
            reject(false)
          }
          const key = response.data.qiniu_key
          const token = response.data.qiniu_token
          _self._data.dataObj.token = token
          _self._data.dataObj.key = 'test_file2/' + key + ext
          resolve(true)
        }).catch(err => {
          console.log(err)
          reject(false)
        })
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
      this.dialogImageUrl = file.url
      this.dialogImage = true
    },
    getFileExt(filename) {
      var index1 = filename.lastIndexOf('.')
      return filename.substring(index1, filename.length)
    }
  }
}
</script>
