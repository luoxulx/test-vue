<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="putTime" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.putTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="type" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="status" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="mimeType" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.mimeType }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="预览">
        <template slot-scope="scope">
          <el-popover placement="right" title="大图预览" trigger="click">
            <img :src="scope.row.url">
            <img slot="reference" :src="scope.row.url" style="max-height: 20px;max-width: 130px">
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" width="145" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-clipboard:copy="scope.row.url" v-clipboard:success="clipboardSuccess" type="primary" size="mini" icon="document">复制url</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row.key)">{{ $t('table.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { deleteQiniuFile, QiniuFiles } from '@/api/qiniu'

import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive

export default {
  name: 'Qiniutupian',
  directives: {
    clipboard
  },
  data() {
    return {
      listLoading: true,
      list: [],
      prefix: 'test_file/'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      QiniuFiles({ prefix: this.prefix }).then(response => {
        this.listLoading = false
        this.list = response.data
      })
    },
    handleDelete(filename) {
      deleteQiniuFile({ filename: filename }).then(() => {
        this.getList()
        this.$message.success('删除成功')
      })
    },
    clipboardSuccess() {
      this.$message.success('Copy successfully')
    }
  }
}

</script>
