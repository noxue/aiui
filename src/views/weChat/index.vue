<template>
  <div class="wechat-container">
    <el-form  class="we_form" label-position="top" :rules="loginRules" ref="loginForm" :model="loginForm">
      <el-form-item prop="username">
        <el-input name="username" class="we_input" style="background:transparent;" type="text" v-model="loginForm.username" placeholder="登陆名" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input name="password" class="we_input" type="password" v-model="loginForm.password" placeholder="登陆密码" />
      </el-form-item>
      <el-button type="primary" class="we_button" @click.native="login">绑定</el-button>
    </el-form >
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import { banding } from '@/api/userManage'
export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的登陆名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码长度不能小于5个字符'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // this.loading = true
          this.$store
            .dispatch('LoginByUsername', this.loginForm)
            .then(() => {
              const para = {
                openid: this.$route.query.contNo + '',
                username: this.loginForm.username + ''
              }
              banding(para).then(response => {
                if (response.data.meta.success === false) {
                  alert(response.data.meta.msg)
                } else {
                  alert('操作成功,请关闭当前页面')
                  // this.$router.push({ path: '/weChat/taskInfo' })
                }
              })
            })
            .catch(() => {})
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.wechat-container {
  width: 100%;
	height: 100%;
	overflow-x:hidden; 
	overflow-y:auto;
  background: url(/static/banding.png);
  filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')";
  -moz-background-size: 100% 100%;
  background-size: 100% 100%;
  
}

.we_input >>>.el-input__inner{
    background-color: transparent;
    border:none;
    border-bottom :1px solid rgb(255, 255, 255);
    border-radius:0;
}

.wechat-container .we_form {
  width: 80%;
  display: block;
  margin-left:10%; 
  margin-top:50%; 
}

.wechat-container .we_button{
  display: block;
  width:100%;
}

</style>

