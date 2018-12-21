<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :class-name="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布</el-button>
        <el-button v-loading="loading" type="warning" @click="submitDraft">草稿</el-button>
      </sticky>
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item prop="title">
              <MDinput v-model="postForm.title" :maxlength="225" name="title" required>标题</MDinput>
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
              </el-row>
              <el-form-item prop="created_at" label="缩略图">
                <span>d</span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <div class="editor-container">
          <Tinymce ref="editor" :height="300" :prefix="path_prefix" :value="postForm.content" v-model="postForm.content"/>
        </div>
      </div>
    </el-form>

  </div>
</template>

<script>
import Tinymce from '@/views/blog/components/Tinymce'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { tagIndex, categoryIndex, articleCreate, articleUpdate, articleDetail } from '@/api'

const defaultForm = {
  is_draft: '0',
  user_id: '1',
  category_id: '',
  tags: [],
  title: '',
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
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }]
      },
      tempRoute: {},
      path_prefix: 'post/',
      cdnImageDomain: 'http://cdn.lnmpa.top/',
      tempFileUrl: '',
      tempFileObject: { token: '', key: '' },
      // 分类  标签
      category_option: [],
      tag_option: []
    }
  },
  computed: {
    descriptionLength() {
      if (this.postForm.description) {
        return this.postForm.description.length
      }
      return 0
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
    fetchData(id) {
      articleDetail(id).then(response => {
        this.postForm = response.data.data
        if (this.postForm.content) {
          this.postForm.content = response.data.data.content['html']
        }
        // Set tagsview title
        this.setTagsViewTitle()
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
          const tempMessage = this.postForm.is_draft ? 'saved draft !' : 'created successful !'
          articleCreate(this.postForm).then(() => {
            this.$message.success(tempMessage)
            this.$router.push('/blog/article')
          })
          this.loading = false
        } else {
          this.$message.error(111)
          return false
        }
      })
    },
    submitDraft() {
      this.postForm.is_draft = 1
      this.submitForm()
    },
    getTags() {
      tagIndex({ per_page: 0 }).then(response => {
        const temp = []
        for (var i = 0; i < response.data.data.length; i++) {
          temp.push({ value: response.data.data[i].id, label: response.data.data[i].name })
        }
        this.tag_option = temp
      })
    },
    getCategories() {
      categoryIndex({ per_page: 0 }).then(response => {
        const temp = []
        for (var i = 0; i < response.data.data.length; i++) {
          temp.push({ value: response.data.data[i].id, label: response.data.data[i].name })
        }
        this.category_option = temp
      })
    },
    dropzoneSuccess(file) {
      this.postForm.thumbnail = file.real_path
      this.$message({ message: 'Upload success', type: 'success' })
    },
    dropzoneRemove(file) {
      this.$message({ message: 'local file delete successful！', type: 'success' })
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
