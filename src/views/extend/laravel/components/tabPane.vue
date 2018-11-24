<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column width="180px" align="center" label="日期时间">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="环境" max-width="45">
        <template slot-scope="scope">
          <span>{{ scope.row.env }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="level" max-width="35">
        <template slot-scope="scope">
          <span>{{ scope.row.level }}</span>
          <!--<el-tag>{{ scope.row.level }}</el-tag>-->
        </template>
      </el-table-column>

      <el-table-column label="info" show-overflow-tooltip min-width="375">
        <template slot-scope="scope">
          <span @click="previewLogInfo(scope.row, false)">{{ scope.row.info }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" width="70" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="info" size="mini" @click="previewLogInfo(scope.row, true)">预览</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-dialog :visible.sync="previewDialog" title="LaravelLogInfo">
      <el-container>
        <el-main>
          <div style="margin: 10px;" v-html="LogInfo"/>
        </el-main>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="previewDialog = false">{{ $t('table.confirm') }}</el-button>
        </span>
      </el-container>
    </el-dialog>
  </div>
</template>

<script>
import { fetchLaravelLog } from '@/api/extend'

export default {
  props: {
    type: {
      type: String,
      default: 'all'
    }
  },
  data() {
    return {
      list: null,
      listQuery: {
        page: 1,
        per_page: 5,
        type: this.type
      },
      listLoading: true,
      previewDialog: false,
      LogInfo: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchLaravelLog(this.listQuery).then(response => {
        this.list = response.data.data.logs
        this.listLoading = false
      })
    },
    previewLogInfo(row, all = false) {
      this.previewDialog = true
      this.LogInfo = all === false ? row.info : row.trace
    }
  }
}
</script>

