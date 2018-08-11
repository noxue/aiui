<template>
  <div class="app-container">
    <section>
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters" onsubmit="return false">
          <el-form-item>
            <el-input v-model="filters.name"  @keyup.enter.native="getTemplates" placeholder="模板名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="getTemplates">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!--列表-->
      <el-table :data="templates" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
        <el-table-column type="index" width="80">
        </el-table-column>
        <el-table-column prop="name" label="名称"  sortable>
        </el-table-column>
        <el-table-column prop="status" label="模板状态" min-width="120" :formatter="formatStatus" sortable>
        </el-table-column>
         <el-table-column prop="createdAt" label="创建时间" min-width="130"  :formatter="formatTime" sortable>
        </el-table-column>
        <el-table-column label="操作" width="300" v-if='show' fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="success" size="mini" @click="copyTemplate(scope.$index, scope.row)">复制</el-button>
            <el-button type="danger" size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="15" :total="total" style="float:right;">
        </el-pagination>
      </el-col>    
    </section>
  </div>
</template>

<script>
import { getTemplateList, deleteTemplate, copyTemplate } from '@/api/template'
// import router from '@/router/index'
export default {
  data() {
    return {
      filters: {
        name: ''
      },
      show: false,
      templates: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [] // 列表选中列

    }
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val
      this.getTemplates()
    },
    formatStatus(row, column) {
      return row.status === 0 ? '已上线' : row.status === 1 ? '制作中' : row.status === 2 ? '测试中' : row.status === 3 ? '审核中' : '未知'
    },

    formatTime(row, column) {
      if (row.createdAt !== null) {
        return row.createdAt.substring(0, 10)
      } else {
        return row.createdAt
      }
    },

    // 获取模板列表
    getTemplates() {
      const para = { page: this.page + '', name: this.filters.name }
      this.listLoading = true
      getTemplateList(para).then((response) => {
        this.total = response.data.data.templateList.total
        this.templates = response.data.data.templateList.list
        this.listLoading = false
      })
    },
    copyTemplate(index, row) {
      copyTemplate(row.id).then((response) => {
        if (response.data.meta.success) {
          this.$message('复制成功')
          this.getTemplates()
        } else {
          this.$message.error('复制失败：' + response.data.meta.msg)
        }
      })
    },
    // 删除
    handleDel(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        // NProgress.start();
        const para = { id: '' + row.id + '' }
        deleteTemplate(para).then((response) => {
          this.listLoading = false
          // NProgress.done();
          if (response.data.meta.success === false) {
            this.$message({
              message: '删除失败',
              type: 'fail'
            })
          } else {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          }
          this.getTemplates()
        })
      }).catch(() => {

      })
    },
    // 修改
    handleEdit(index, row) {
      this.$router.push({ name: 'templateEdit', params: { id: row.id }})
    },
    selsChange(sels) {
      this.sels = sels
    }

  },
  mounted() {
    this.getTemplates()
  },
  created() {
    const role = window.JSON.parse(window.localStorage.getItem('role') || '[]')
    if (role[0] === 'role_admin') {
      this.show = true
    }
  }

}

</script>

<style>

</style>
