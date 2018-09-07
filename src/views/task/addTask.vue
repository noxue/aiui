<template>
  <div class="app-container">
    <el-form ref="form"  label-position="top" :model="form" label-width="80px">
      <el-form-item label="任务名称" ><el-input style="width:200px;" v-model="form.taskName"></el-input></el-form-item>
      <el-form-item label="模板信息" >
        <el-select v-model="form.region" placeholder="请选择">
          <el-option
              v-for="item in form.options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="sim卡信息" >
        <el-select v-model="form.sim" placeholder="请选择">
          <el-option
              v-for="item in form.simOptions"
              :key="item.id"
              :label="item.number"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="任务并发数" ><el-input v-model="form.num"></el-input></el-form-item> -->
      <el-form-item label="是否允许打断：">
          <el-radio v-model="Break" label="0">不打断</el-radio>
          <el-radio v-model="Break" label="-1">声音打断</el-radio>
          <el-radio v-model="Break" label="-2">关键词打断</el-radio>
      </el-form-item>
      <el-form-item label="微信推送类型(需绑定微信)：">
            <el-checkbox-group 
              v-model="follows"
              :min="0"
              :max="3">
              <el-checkbox v-for="city in cities" :label="city" :key="city" :disabled="ispitch">{{city}}</el-checkbox>
            </el-checkbox-group>
      </el-form-item>
      <el-form-item label="任务类型：">
        <el-radio-group v-model="form.test">
          <el-radio-button :label=0>群呼任务</el-radio-button>
          <el-radio-button :label=1>单呼任务</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <!--测试任务选中时触发-->
        <el-form-item label="测试姓名" v-if="form.test" label-position="left"><el-input v-model="form.testName"></el-input>
        </el-form-item>
        <el-form-item label="测试号码" v-if="form.test" :rules="testRules" label-position="left"><el-input v-model="form.testPhone"></el-input>
        </el-form-item>
        <el-form-item label="备注" v-if="form.test" label-position="left"><el-input v-model="form.remark"></el-input>
        </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit(form)">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>   
</template>
<script>
  import { addTask, getTemplateListById, getSimListById, isBanding } from '@/api/task'
const cityOptions = ['A', 'B', 'C', 'D', 'E', 'F']
export default {
    data() {
      return {
        follows: [],
        cities: cityOptions,
        ispitch: false,
        form: {
          taskName: '',
          num: '',
          total: '',
          date1: '',
          date2: '',
          test: 0,
          options: [],
          simOptions: [],
          testName: '',
          testPhone: '',
          remark: '',
          visible: 'false'
        },
        testRules: {
          testPhone: [
            { required: true, message: '请输入号码', trigger: 'blur' }
          ]
        },
        Break: '0'
      }
    },
    methods: {
      onSubmit(form) {
        const reqData = {
          taskName: this.form.taskName,
          template: this.form.region + '',
          sim: this.form.sim + '',
          num: this.form.num + '',
          total: this.form.total + '',
          date1: this.form.date1,
          date2: this.form.date2,
          test: this.form.test + '',
          testName: this.form.testName,
          testPhone: this.form.testPhone + '',
          remark: this.form.remark,
          break: this.Break,
          follows: this.formatFollow() + ''
        }
        addTask(reqData).then((response) => {
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
            if (localStorage.getItem('taskId') !== undefined) {
              localStorage.removeItem('taskId')
            }
            this.$router.push({ name: 'taskList' })
          }
        })
      },
      getTempaltes() {
        getTemplateListById(Request).then((response) => {
          this.form.options = response.data.data.templateList.list
        })
      },
      getSims() {
        getSimListById(Request).then((response) => {
          this.form.simOptions = response.data.data.simpUserPage.list
        })
      },
      validateBanding() {
        isBanding(Request).then((response) => {
          if (response.data.meta.code === 0) {
            this.ispitch = false
          } else if (response.data.meta.code === 8500) {
            this.ispitch = true
          }
        })
      },
      formatFollow() {
        if (this.follows.length === 0) {
          return ''
        } else {
          for (var i = 0; i < this.follows.length; i++) {
            if (this.follows[i] === 'A') {
              this.follows[i] = '5'
            } else if (this.follows[i] === 'B') {
              this.follows[i] = '6'
            } else if (this.follows[i] === 'C') {
              this.follows[i] = '7'
            } else if (this.follows[i] === 'D') {
              this.follows[i] = '8'
            } else if (this.follows[i] === 'E') {
              this.follows[i] = '9'
            } else if (this.follows[i] === 'F') {
              this.follows[i] = '10'
            }
          }
          return this.follows
        }
      },
      changeVisible() {
        if (this.form.radio === '单呼任务') {
          this.form.visible = true
        } else {
          this.form.visible = false
        }
      }
  
    },
    mounted() {
      this.getTempaltes()
      this.validateBanding()
      // this.getSims()
    }
  }
</script>