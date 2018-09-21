<template>
  <div class="app-container">
    <section>
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters" onsubmit="return false">
          <el-form-item>
            <el-input v-model="filters.name" @keyup.enter.native="getSips" placeholder="线路名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="getSips">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-if="isAdmin" @click="addFormVisible = true">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!--列表-->
      <el-table :data="sips" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column prop="name" label="线路名"  sortable>
        </el-table-column>
        <el-table-column prop="createat" label="创建时间" :formatter="formatDate" sortable>
        </el-table-column>
        <el-table-column prop="remark" label="备注"  sortable>
        </el-table-column>
        <el-table-column label="操作" width="150"  v-if="isAdmin">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger"  size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
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
          <el-form-item label="名称" prop="name">
            <el-input v-model="editForm.name" auto-complete="off"></el-input>
          </el-form-item>
           <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="editForm.password" ></el-input>
          </el-form-item>
          <el-form-item label="端口" prop="host">
            <el-input v-model="editForm.host" ></el-input>
          </el-form-item>
          <el-form-item label="客户端" prop="app_id">
            <el-select v-model="editForm.app_id" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
					</el-form-item>
          <el-form-item label="厂商" prop="firms">
            <el-input v-model="editForm.firms" ></el-input>
          </el-form-item>
          <el-form-item label="最大并发" prop="maxthread">
            <el-input-number v-model="editForm.maxthread" :min="1" label="描述文字"></el-input-number>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="editForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
        </div>
      </el-dialog>
      <!--新增界面-->
      <el-dialog title="新增" :visible.sync="addFormVisible">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="名称" prop="name">
            <el-input v-model="addForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username" ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="addForm.password" ></el-input>
          </el-form-item>
          <el-form-item label="端口" prop="host">
            <el-input v-model="addForm.host" ></el-input>
          </el-form-item>
          <el-form-item label="客户端" prop="app_id">
            <el-select v-model="addForm.app_id" placeholder="请选择客户端">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              </el-option>
            </el-select>
					</el-form-item>
          <el-form-item label="厂商" prop="firms">
            <el-input v-model="addForm.firms" ></el-input>
          </el-form-item>
          <el-form-item label="最大并发" prop="maxthread">
              <el-input-number v-model="addForm.maxthread" :min="1" label="描述文字"></el-input-number>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="addForm.remark"></el-input>
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
  import { getSipList, addSip, deleteSip, editSip } from '@/api/sip'
  import { getAllApp } from '@/api/gateway'
export default {
    data() {
      return {
        filters: {
          name: ''
        },
        isAdmin: false,
        sips: [],
        total: 0,
        page: 1,
        listLoading: false,
        sels: [], // 列表选中列
        options: [],
        editFormVisible: false, // 编辑界面是否显示
        editLoading: false,
        editFormRules: {
          name: [
            { required: true, message: '请输入线路名', trigger: 'blur' }
          ],
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          app_id: [
            { required: true, message: '请选择客户端', trigger: 'blur' }
          ],
          host: [
            { required: true, message: '请输入地址、端口号', trigger: 'blur' }
          ]
        },
        // 编辑界面数据
        editForm: {
          name: '',
          username: '',
          password: '',
          host: '',
          app_id: '',
          firms: '',
          maxthread: '',
          remark: ''
        },

        addFormVisible: false, // 新增界面是否显示
        addLoading: false,
        addFormRules: {
          name: [
            { required: true, message: '请输入线路名', trigger: 'blur' }
          ],
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          app_id: [
            { required: true, message: '请选择客户端', trigger: 'blur' }
          ],
          host: [
            { required: true, message: '请输入地址、端口号', trigger: 'blur' }
          ]
        },
        // 新增界面数据
        addForm: {
          name: '',
          username: '',
          password: '',
          host: '',
          app_id: '',
          firms: '',
          maxthread: '',
          remark: ''
        }
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val
        this.getSips()
      },
      getAllApps() {
        // NProgress.start();
        getAllApp().then((response) => {
          this.options = response.data.data.appList.list
        })
      },
      // 获取用户列表
      getSips() {
        const para = { page: this.page + '', name: this.filters.name }
        this.listLoading = true
        // NProgress.start();
        getSipList(para).then((response) => {
          this.total = response.data.data.sipList.total
          this.sips = response.data.data.sipList.list
          this.listLoading = false
        // NProgress.done();
        })
      },
      // 删除
      handleDel: function(index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          // NProgress.start();
          deleteSip(row.id + '').then((response) => {
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
            this.getSips()
          })
        }).catch(() => {

        })
      },
      // 显示编辑界面
      handleEdit: function(index, row) {
        this.editFormVisible = true
        this.editForm = Object.assign({}, row)
        console.log(row)
        this.editForm.app_id = row.appid
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
                id: para.id + '',
                name: para.name,
                password: para.password,
                username: para.username,
                host: para.host,
                app_id: para.app_id + '',
                firms: para.firms,
                maxThread: para.maxthread + '',
                remark: para.remark
              }
              editSip(reqData).then((response) => {
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
                this.getSips()
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
              const para = Object.assign({}, this.addForm)
              // alert(this.$refs.addForm)
              const reqData = {
                id: para.id + '',
                name: para.name,
                password: para.password,
                username: para.username,
                host: para.host,
                app_id: para.app_id + '',
                firms: para.firms,
                maxThread: para.maxthread + '',
                remark: para.remark
              }
              addSip(reqData).then((response) => {
                this.addLoading = false
                // NProgress.done();
                if (response.data.meta.success === false) {
                  this.$message({
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
                this.getSips()
              })
            })
          }
        })
      },
      formatDate: function(row, column) {
        if (row.createat === '' || row.createat === null || row.createat === undefined) {
          return ''
        } else {
          var d = new Date(row.createat)
          var minute = d.getMinutes()
          if (minute < 10) {
            minute = '0' + minute // 补齐
          }
          var seconds = d.getSeconds()
          if (seconds < 10) {
            seconds = '0' + seconds // 补齐
          }
          return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日'
        }
      },
      selsChange: function(sels) {
        this.sels = sels
      },
      validateUser: function(sels) {
        const role = localStorage.getItem('role')
        if (role.indexOf('role_admin') >= 0) {
          this.isAdmin = true
        }
      }
    },
    mounted() {
      this.getSips()
      this.validateUser()
      this.getAllApps()
    }
  }

</script>

<style>

</style>
