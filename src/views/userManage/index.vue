<template>
  <div class="app-container">
    <section>
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters" onsubmit="return false">
          <el-form-item>
            <el-input v-model="filters.uid" @keyup.enter.native="getUsers" placeholder="登录名/用户名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="getUsers">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addFormVisible = true">添加</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!--列表-->
      <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="uid" label="登录名" sortable>
        </el-table-column>
        <el-table-column prop="username" label="用户名" sortable>
        </el-table-column>  
        <!-- <el-table-column prop="realName" label="真实姓名"   sortable>
        </el-table-column>
        <el-table-column prop="phone" label="电话"   sortable>
        </el-table-column>
        <el-table-column prop="email" label="邮箱"  sortable>
        </el-table-column>
        <el-table-column prop="sex" label="性别"   :formatter="formatSex" sortable>
        </el-table-column> -->
        <el-table-column prop="status" label="用户状态"   :formatter="formatStatus" sortable>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="small" type="success" @click="handleSip(scope.$index, scope.row)">线路</el-button>
              <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
            </el-button-group> 
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="15" :total="total" style="float:right;">
        </el-pagination>
      </el-col>
      <!--编辑界面-->
      <el-dialog title="编辑"  :visible.sync="editFormVisible">
        <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
          <el-form-item label="登录名" prop="uid">
            <el-input v-model="editForm.uid" :disabled="true" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="editForm.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="editForm.realName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="editForm.phone" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别">
						<el-radio-group v-model="editForm.sex">
							<el-radio class="radio" :label="1">男</el-radio>
							<el-radio class="radio" :label="0">女</el-radio>
						</el-radio-group>
					</el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
        </div>
      </el-dialog>
      <!--线路分配-->
      <el-dialog title="线路分配"  :visible.sync="sipFormVisible">
        
        <!-- <el-form :model="sipForm" label-width="80px" ref="sipForm">
        </el-form> -->
        <div style="text-align: center;">
          <el-transfer
          style="text-align: left; display: inline-block"
            filterable
            :filter-method="filterMethod"
            filter-placeholder="请输入线路名"
            :titles="['可选择', '已选择']"
            v-model="value2"
            :data="data2">
          </el-transfer>
        </div>

        <div class="thread" style="margin-top:20px;text-align: center;">
          <el-input placeholder="请输入内容" v-model="toAssigned" :disabled="true">
            <template slot="prepend">可分配线路数：</template>
          </el-input>
          <el-input type="number" v-model="midAssigned">
            <template slot="prepend">已分配线路数：</template>
          </el-input>
        </div>
    
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="sipFormVisible = false">取消</el-button>
          <el-button type="primary" :disabled="isAction" @click.native="sipSubmit" :loading="sipLoading">提交</el-button>
        </div>
      </el-dialog>
      <!--新增界面-->
      <el-dialog title="添加用户" :visible.sync="addFormVisible">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="登录名" prop="uid">
            <el-input v-model="addForm.uid" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="addForm.realName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="addForm.phone" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别">
						<el-radio-group v-model="addForm.sex">
							<el-radio class="radio" :label="1" >男</el-radio>
							<el-radio class="radio" :label="0">女</el-radio>
						</el-radio-group>
					</el-form-item>
          <el-form-item label="选择角色">
            <el-select v-model="addForm.roleId" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              </el-option>
            </el-select>
					</el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>
    </section>
  </div>
</template>

<script>
  import { getUserList, addUser, deleteUser, editUser, roleList } from '@/api/userManage'
  import { getAllSip, addSipUser, sipUserList, userList } from '@/api/sip'
export default {
    data() {
      return {
        suid: '',
        sipList: [],
        userList: [],
        data2: [],
        value2: [],
        filterMethod(query, item) {
          return item.pinyin.indexOf(query) > -1
        },
        filters: {
          uid: ''
        },
        toAssigned: 0,
        midAssigned: 0,
        sumAss: 0,
        isAction: true,
        users: [],
        total: 0,
        page: 1,
        listLoading: false,
        sels: [], // 列表选中列
        options: [],
        value: '',
        sipFormVisible: false, // 新增界面是否显示
        sipLoading: false,

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
            { required: true, message: '请输入密码(长度在5~30)', trigger: 'blur' }
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
    watch: {
      midAssigned: {
        handler(newVal, oldVal) {
          if (newVal === '' || newVal < 0 || newVal > this.sumAss) {
            this.$message.error({
              message: '请重新输入数字',
              type: 'fail'
            })
            this.isAction = true
            return oldVal
          } else {
            this.toAssigned = parseInt(this.sumAss) - parseInt(newVal)
            this.isAction = false
          }
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
        getUserList(para).then((response) => {
          this.total = response.data.data.pageInfo.total
          this.users = response.data.data.pageInfo.list
          this.listLoading = false
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
                message: response.data.meta.msg,
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
      // 显示线路分配界面
      handleSip: function(index, row) {
        this.sipFormVisible = true
        this.suid = row.uid
        const para = {
          userid: row.uid
        }
        userList(para).then((response) => {
          if (response.data.meta.success !== false) {
            this.toAssigned = parseInt(response.data.data.userInfos[0])
            this.midAssigned = parseInt(response.data.data.userInfos[1])
            this.sumAss = this.toAssigned + this.midAssigned
            this.userList = response.data.data.userList
            const data = []
            this.userList.forEach((sip, index) => {
              data.push(
                sip.id
              )
            })
            this.value2 = data
          }
        })
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
                    message: response.data.meta.msg,
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
              roleId: para1.roleId + ''
            }

            addUser(para).then((response) => {
              this.addLoading = false
              // NProgress.done();
              if (response.data.meta.success === false) {
                this.$message.error({
                  message: response.data.meta.msg,
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
          }
        })
      },
      // 线路操作 新增/删除
      sipSubmit: function() {
        const reqDate = {
          sip_id: this.value2 + '',
          userid: this.suid,
          toAss: this.toAssigned + '',
          forAss: this.midAssigned + ''
        }
        addSipUser(reqDate).then((response) => {
          this.addLoading = false
          // NProgress.done();
          if (response.data.meta.success === false) {
            this.$message.error({
              message: response.data.meta.msg,
              type: 'fail'
            })
          } else {
            this.$message({
              message: response.data.meta.msg,
              type: 'success'
            })
          }
          this.sipFormVisible = false
        })
      },
      selsChange: function(sels) {
        this.sels = sels
      },
      getSipList: function() {
        const role = localStorage.getItem('role')
        if (role.indexOf('role_admin') >= 0) {
          getAllSip().then((response) => {
            if (response.data.meta.success !== false) {
              this.sipList = response.data.data.sipList
              const data = []
              this.sipList.forEach((sip, index) => {
                data.push({
                  label: sip.name,
                  key: sip.id,
                  pinyin: this.sipList[index].name
                })
              })
              this.data2 = data
            }
          })
        } else {
          this.checkSipUser()
        }
      },
      checkSipUser: function() {
        sipUserList().then((response) => {
          if (response.data.meta.success !== false) {
            this.sipList = response.data.data.sipList
            const data = []
            this.sipList.forEach((sip, index) => {
              data.push({
                label: sip.name,
                key: sip.id,
                pinyin: this.sipList[index].name
              })
            })
            this.data2 = data
          }
        })
      }
    },
    mounted() {
      this.getUsers()
      this.getRoleList()
      this.getSipList()
    }
  }

</script>

<style>

.thread .el-input {
    width: 245px;
  }

</style>
