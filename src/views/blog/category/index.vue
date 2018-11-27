<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="parent ID" width="85">
        <template slot-scope="scope">
          <span :color="scope.row.parent_id">{{ scope.row.parent_id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="分类名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
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
            <img :src="scope.row.thumbnail" alt="xxxx">
            <img slot="reference" :src="scope.row.thumbnail" :alt="scope.row.thumbnail" style="max-height: 20px;max-width: 130px">
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column align="center" label="描述" min-width="275px">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" min-width="95" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)">{{ $t('table.delete') }}</el-button>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.per_page" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="50%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="父级ID" prop="parent_id">
          <el-input v-model="temp.parent_id"/>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="缩略图" prop="thumbnail">
          <el-input v-model="temp.thumbnail"/>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input :autosize="{ minRows: 3, maxRows: 5}" v-model="temp.description" type="textarea" placeholder="描述"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { categoryList, categoryCreate, categoryUpdate, categoryDelete } from '@/api/category'
import Pagination from '@/components/Pagination'

export default {
  name: 'Category',
  components: { Pagination },
  data() {
    return {
      styleOptions: ['default', 'primary', 'success', 'info', 'warning', 'danger'],
      temp: { name: '', color: '', style: '', description: '' },
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogFormVisible: false,
      rules: {
        name: [{ required: true, message: '标签名必须填写', trigger: 'change' }],
        description: [{ required: true, message: 'description is required', trigger: 'blur' }]
      },
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        per_page: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      categoryList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.meta.pagination.total
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = { name: '', color: '', style: '', description: '', created_at: new Date() }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          categoryCreate(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$message.success('create successful')
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          categoryUpdate(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$message.success('update successful')
          })
        }
      })
    },
    handleDelete(id) {
      categoryDelete(id).then(() => {
        this.getList()
        this.$message.success('删除成功')
      })
    }
  }
}
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
