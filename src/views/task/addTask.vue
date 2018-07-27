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
      <el-form-item >
        <el-radio-group v-model="form.test" >
          <el-radio-button :label=0>正式任务</el-radio-button>
          <el-radio-button :label=1>测试任务</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <!--测试任务选中时触发-->
        <el-form-item label="测试姓名" v-if="form.test" label-position="left"><el-input v-model="form.testName"></el-input>
        </el-form-item>
        <el-form-item label="测试号码" v-if="form.test" label-position="left"><el-input v-model="form.testPhone"></el-input>
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
  import { addTask, getTemplateListById, getSimListById } from '@/api/task'
  // const Base64 = require('js-base64').Base64
export default {
    data() {
      return {
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
        }
  
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
          remark: this.form.remark
        }
        addTask(reqData).then((response) => {
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
            this.$router.push({ name: 'taskList' })
          }
        }
        )
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
      changeVisible() {
        if (this.form.radio === '测试任务') {
          this.form.visible = true
        } else {
          this.form.visible = false
        }
      }
  
    },
    mounted() {
      this.getTempaltes()
      this.getSims()
    }
  }
</script>