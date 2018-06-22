<template>
  <div class="app-main">
    <!--app管理页面-->

    <el-button class="register"  plain @click="add">注册</el-button>
    <template>
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <!--数据展示-->
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="ser" label="序号" width="180"></el-table-column>
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="operate" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <!--分页-->
        <el-pagination class="currentPage" layout="prev, pager, next" :total="50">
        </el-pagination>

      </el-table>
    </template>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        tableData: []
      }
    },
    methods: {
      indexMethod(index) {
        return index
      },
      handleEdit(index, row) {
        console.log(index, row)
      },
      handleDelete(index, row) {
        console.log(index, row)
      },
      add(index, row) {
        console.log(index, row)
      },
      getAppList() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
              this.loading = false
              this.$router.push({ path: '/' })
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style>
  .currentPage{
    text-align: center;
  }
  .register{
    text-align: left;
  }

</style>
