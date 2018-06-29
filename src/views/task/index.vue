<template>
  <div class="app-container">
   
  </div>
</template>

<script>
  import { getUserList, addUser, deleteUser, editUser, roleList } from '@/api/userManage'
export default {
    data() {
      return {
        filters: {
          uid: ''
        },
        users: [],
        total: 0,
        page: 1,
        listLoading: false,
        sels: [], // 列表选中列
        options: [],
        value: '',
        editFormVisible: false, // 编辑界面是否显示
        editLoading: false,
        editFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ]
        },
        // 编辑界面数据
        editForm: {
          uid: '',
          username: '',
          password: '',
          realName: '',
          phone: '',
          email: '',
          sex: ''
        },

        addFormVisible: false, // 新增界面是否显示
        addLoading: false,
        addFormRules: {
          uid: [
            { required: true, message: '请输入登录名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ]
        },
        // 新增界面数据
        addForm: {
          uid: '',
          username: '',
          password: '',
          realName: '',
          phone: '',
          email: '',
          sex: '',
          roleId: ''
        }
      }
    },
    methods: {
      // 性别显示转换
      formatSex: function(row, column) {
        return row.sex === 1 ? '男' : row.sex === 0 ? '女' : '未知'
      },
      formatStatus: function(row, column) {
        return row.status === 1 ? '正常' : row.status === 2 ? '锁定' : row.status === 3 ? '删除' : row.status === 4 ? '非法' : '未知'
      },
      handleCurrentChange(val) {
        this.page = val
        this.getUsers()
      },
      // 获取用户列表
      getUsers() {
        const para = { start: this.page + '', uid: this.filters.uid }
        this.listLoading = true
        // NProgress.start();
        getUserList(para).then((response) => {
          this.total = response.data.data.pageInfo.total
          this.users = response.data.data.pageInfo.list
          this.listLoading = false
        // NProgress.done();
        })
      },
      getRoleList() {
        // NProgress.start();
        roleList().then((response) => {
          this.options = response.data.data.roleList
        })
      },
      // 删除
      handleDel: function(index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          // NProgress.start();
          const para = { uid: '' + row.uid + '' }
          deleteUser(para).then((response) => {
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
            this.getUsers()
          })
        }).catch(() => {

        })
      },
      // 显示编辑界面
      handleEdit: function(index, row) {
        this.editFormVisible = true
        this.editForm = Object.assign({}, row)
      },
      // 显示新增界面
      handleAdd: function() {
        this.addFormVisible = true
        this.addForm = {
          name: '',
          description: ''
        }
      },
      // 编辑
      editSubmit: function() {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true
              // NProgress.start();
              const para = Object.assign({}, this.editForm)
              const reqData = {
                uid: para.uid,
                username: para.username,
                password: para.password,
                realName: para.realName,
                phone: para.phone,
                email: para.email,
                sex: para.sex + ''
              }
              editUser(reqData).then((response) => {
                this.editLoading = false
                // NProgress.done();
  
                if (response.data.meta.success === false) {
                  this.$message({
                    message: '编辑失败',
                    type: 'fail'
                  })
                } else {
                  this.$message({
                    message: '编辑成功',
                    type: 'success'
                  })
                }
                this.$refs['editForm'].resetFields()
                this.editFormVisible = false
                this.getUsers()
              })
            })
          }
        })
      },
      // 新增
      addSubmit: function() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true
              // NProgress.start();
              const para1 = Object.assign({}, this.addForm)
              const para = {
                uid: para1.uid,
                username: para1.username,
                password: para1.password,
                realName: para1.realName,
                phone: para1.phone,
                email: para1.email,
                sex: para1.sex + '',
                roleId: para1.value + ''
              }

              addUser(para).then((response) => {
                this.addLoading = false
                // NProgress.done();
                if (response.data.meta.success === false) {
                  this.$message({
                    message: '提交失败',
                    type: 'fail'
                  })
                } else {
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  })
                }
                this.$refs['addForm'].resetFields()
                this.addFormVisible = false
                this.getUsers()
              })
            })
          }
        })
      },
      selsChange: function(sels) {
        this.sels = sels
      },
      // 批量删除
      batchRemove: function() {
        // var ids = this.sels.map(item => item.id).toString()
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          // NProgress.start();
          // const para = { ids: ids }
          // batchRemoveUser(para).then((res) => {
          //   this.listLoading = false
          //   // NProgress.done();
          //   this.$message({
          //     message: '删除成功',
          //     type: 'success'
          //   })
          //   this.getUsers()
          // })
        }).catch(() => {

        })
      }
    },
    mounted() {
      this.getUsers()
      this.getRoleList()
    }
  }

</script>

<style>

</style>
