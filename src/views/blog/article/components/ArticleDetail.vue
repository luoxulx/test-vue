<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :class-name="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布</el-button>
        <el-button v-loading="loading" type="warning" @click="submitForm">草稿</el-button>
      </sticky>
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item prop="title">
              <MDinput v-model="postForm.title" :maxlength="225" name="title" required>标题</MDinput>
            </el-form-item>
            <el-form-item prop="slug">
              <MDinput v-model="postForm.slug" :maxlength="128" name="slug" prefix-icon="el-icon-share" clearable required>slug</MDinput>
            </el-form-item>
            <el-form-item prop="source">
              <MDinput v-model="postForm.source" :maxlength="225" type="url" name="source" prefix-icon="el-icon-share" clearable>来源链接</MDinput>
            </el-form-item>
            <el-form-item style="margin-bottom: 40px;">
              <el-input :rows="1" v-model="postForm.description" type="textarea" class="article-textarea" autosize placeholder="描述"/>
              <span v-show="descriptionLength" class="word-counter">{{ descriptionLength }}字</span>
            </el-form-item>
            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item prop="category_id" label="文章分类">
                    <el-select v-model="postForm.category_id" clearable placeholder="请选择分类">
                      <el-option v-for="item in category_option" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="tags" label="文章标签">
                    <el-select v-model="postForm.tags" multiple filterable allow-create default-first-option placeholder="请选择文章标签">
                      <el-option v-for="item in tag_option" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="created_at" label="发布时间">
                    <el-date-picker v-model="postForm.created_at" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间" />
                  </el-form-item>
                </el-col>
                <el-form-item label="缩略图" class="postInfo-container-item">
                  <el-upload :data="uploadObj" :multiple="false" :before-upload="beforeUpload" action="https://upload.qbox.me" drag>
                    <i class="el-icon-upload"/>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  </el-upload>
                </el-form-item>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <div class="editor-container">
          <Tinymce ref="editor" :height="400" v-model="postForm.content" />
        </div>
      </div>
    </el-form>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validateURL } from '@/utils/validate'
import { articleCreate, articleUpdate, articleDetail } from '@/api/article'
import { tagList } from '@/api/tag'
import { categoryList } from '@/api/category'
import { getToken } from '@/api/qiniu'

const defaultForm = {
  is_draft: '0',
  user_id: '1',
  category_id: '',
  tags: [],
  title: '',
  slug: '',
  source: '',
  description: '',
  thumbnail: '',
  content: '',
  created_at: '',
  id: undefined
}

export default {
  name: 'ArticleDetail',
  components: { Tinymce, MDinput, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '是必填项',
          type: 'error'
        })
        callback(new Error(rule.field + '是必填项'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validateURL(value)) {
          callback()
        } else {
          this.$message({
            message: 'url链接格式不正确',
            type: 'error'
          })
          callback(new Error('url链接格式不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        thumbnail: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        source: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {},
      // upload 部分
      uploadObj: { token: '', key: '' },
      image_uri: [],
      fileList: [],
      // 分类  标签
      category_option: [],
      tag_option: []
    }
  },
  computed: {
    descriptionLength() {
      return this.postForm.description.length
    },
    lang() {
      return this.$store.getters.language
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
      this.getTags()
      this.getCategories()
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    beforeUpload() {
      const _self = this
      return new Promise((resolve, reject) => {
        getToken().then(response => {
          const key = response.data.qiniu_key
          const token = response.data.qiniu_token
          _self._data.uploadObj.token = token
          _self._data.uploadObj.key = key
          resolve(true)
        }).catch(err => {
          console.log(err)
          reject(false)
        })
      })
    },
    fetchData(id) {
      articleDetail(id).then(response => {
        this.postForm = response.data.data
        if (this.postForm.content) {
          this.postForm.content = response.data.data.content['html']
        }
        // Set tagsview title
        this.setTagsViewTitle()
      }).catch(err => {
        console.error(err)
      })
    },
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '编辑文章' : 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('updateVisitedView', route)
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          articleCreate(this.postForm).then(() => {
            this.$message.success('添加成功')
          })
          this.loading = false
        } else {
          this.$message.error(111)
          return false
        }
      })
    },
    getTags() {
      tagList({ per_page: 0 }).then(response => {
        this.tag_option = response.data.data
      })
    },
    getCategories() {
      categoryList({ per_page: 0 }).then(response => {
        this.category_option = response.data.data
      })
    },
    test() {
      articleUpdate()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;
      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
        .editor-upload-btn {
          display: inline-block;
        }
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
</style>
