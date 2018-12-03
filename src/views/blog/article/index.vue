<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.title')" v-model="listQuery.title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.category" placeholder="分类" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in categoryOptions" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-button v-waves class="filter-item" type="success" size="mini" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" size="mini" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
      <router-link :to="'/blog/article/create'">
        <el-button v-waves class="filter-item" type="info" size="mini" icon="el-icon-edit">添加</el-button>
      </router-link>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分类ID" prop="id" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.category_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="UserID" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user_id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.title')" :show-overflow-tooltip="true" min-width="150px">
        <template slot-scope="scope">
          <span class="link-type" @click="alert(1)">{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.readings')" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.view_count }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="picture"
        header-align="center"
        align="center"
        width="150px"
        label="缩略图">
        <template slot-scope="scope">
          <el-popover placement="right" title="完整图预览" trigger="click">
            <img :src="scope.row.img_url" alt="xx">
            <img slot="reference" :src="scope.row.img_url" style="max-height: 20px;max-width: 130px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="草稿" class-name="status-col">
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_draft | statusFilter" @click="handleModifyStatus(scope.row,'0')">{{ scope.row.is_draft }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="225" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--<el-button v-if="scope.row.status!='0'" size="mini" type="warning" @click="handleModifyStatus(scope.row,'0')">{{ $t('table.draft') }}-->
          <!--</el-button>-->
          <!--<el-button v-if="scope.row.status!='1'" size="mini" type="success" @click="handleModifyStatus(scope.row,'1')">{{ $t('table.publish') }}-->
          <!--</el-button>-->
          <el-button type="info" size="mini" @click="previewArticle(scope.row)">预览</el-button>
          <router-link :to="'/blog/article/edit/'+scope.row.id">
            <el-button type="warning" size="mini" icon="el-icon-edit">编辑</el-button>
          </router-link>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">{{ $t('table.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.per_page" @pagination="getList" />
    <el-dialog :visible.sync="previewDialog" title="Reading previewContent">
      <el-container>
        <el-main>
          <div style="margin: 15px;" v-html="previewContent"/>
        </el-main>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
        </span>
      </el-container>
    </el-dialog>
  </div>
</template>

<script>
import { articleList, articleDelete } from '@/api/article'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'success',
        1: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return type
    }
  },
  data() {
    return {
      previewContent: '',
      previewDialog: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      downloadLoading: false,
      listQuery: {
        page: 1,
        per_page: 20,
        category: undefined,
        title: undefined
      },
      categoryOptions: [1, '分类2', 3]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      articleList(this.listQuery).then(response => {
        const cdnImageDomain = 'http://cdn.lnmpa.top/'
        const tempList = response.data.data
        this.total = response.data.meta.pagination.total
        this.listLoading = false
        for (var i = 0; i < tempList.length; i++) {
          tempList[i].img_url = tempList[i].thumbnail ? cdnImageDomain + tempList[i].thumbnail : 'https://www.lnmpa.top/svg/default.png'
        }
        this.list = tempList
      })
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    previewArticle(row) {
      this.previewContent = row.content.html
      this.previewDialog = true
    },
    handleDelete(row) {
      articleDelete(row.id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['category_id', 'user_id', 'status', 'view_count', 'title', 'source', 'description', 'created_at']
        const filterVal = ['category_id', 'user_id', 'status', 'view_count', 'title', 'source', 'description', 'created_at']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'article-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
