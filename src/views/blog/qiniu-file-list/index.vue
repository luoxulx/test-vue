<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="prefix" placeholder="路径前缀" style="width: 200px;" class="filter-item" @keyup.enter.native="qiniuFilter"/>
      <el-button v-waves class="filter-item" type="success" size="mini" icon="el-icon-search" @click="qiniuFilter">过滤</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="putTime" width="175">
        <template slot-scope="scope">
          <span>{{ scope.row.putTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="type" width="75">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="status" width="75">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="mimeType" width="115">
        <template slot-scope="scope">
          <span>{{ scope.row.mimeType }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="预览">
        <template slot-scope="scope">
          <el-popover placement="right" title="大图预览" trigger="click">
            <img :src="scope.row.img_url">
            <img slot="reference" :src="scope.row.img_url" style="max-height: 20px;max-width: 130px">
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" width="145" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-clipboard:copy="scope.row.img_url" v-clipboard:success="clipboardSuccess" type="primary" size="mini" icon="document">复制url</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row.key)">{{ $t('table.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" />
  </div>
</template>

<script>
import { deleteQiniuFile, QiniuFiles } from '@/api/qiniu'

import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Qiniutupian',
  components: { Pagination },
  directives: {
    clipboard
  },
  data() {
    return {
      listLoading: true,
      total: 0,
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
        const cdnImageDomain = 'http://cdn.lnmpa.top/'
        var tempList = response.data.data
        for (var i = 0; i < tempList.length; i++) {
          tempList[i].img_url = cdnImageDomain + tempList[i].key + '-pic640x320'
        }
        this.list = tempList
        this.total = response.data.total
      })
    },
    handleDelete(filename) {
      deleteQiniuFile({ filename: filename }).then(() => {
        this.getList()
        this.$message.success('删除成功')
      })
    },
    qiniuFilter() {
      this.getList()
    },
    clipboardSuccess() {
      this.$message.success('Copy successfully')
    }
  }
}

</script>
