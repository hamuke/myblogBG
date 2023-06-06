<template>
  <div class="app-container">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
    >
      <el-form-item label="用户身份" prop="name">
        <el-input
          disabled
          class="inputText"
          type="input"
          v-model="ruleForm.name"
        ></el-input>
      </el-form-item>

      <el-form-item label="用户名" prop="loginId">
        <el-input
          disabled
          class="inputText"
          type="input"
          v-model="ruleForm.loginId"
        ></el-input>
      </el-form-item>

      <el-form-item label="旧密码" prop="password">
        <el-input
          class="inputText"
          show-password
          v-model="ruleForm.password"
        ></el-input>
      </el-form-item>

      <el-form-item label="新密码" prop="newPass">
        <el-input
          class="inputText"
          show-password
          v-model="ruleForm.newPass"
        ></el-input>
      </el-form-item>

      <el-form-item label="确认密码" prop="checkPass">
        <el-input
          class="inputText"
          show-password
          v-model="ruleForm.checkPass"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >提交</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { setInfo, getInfo } from "@/api/user";
export default {
  data() {
    var validateNewPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else if (value === this.ruleForm.password) {
        setTimeout(() => {
          callback(new Error("新密码和旧密码不能相同!"));
        }, 100);
      } else {
        callback();
      }
    };
    var validateNewPass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.ruleForm.newPass) {
        setTimeout(() => {
          callback(new Error("两次输入新密码不一致!"));
        }, 100);
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        id: "",
        loginId: "",
        name: "",
        password: "",
        newPass: "",
        checkPass: ""
      },
      rules: {
        password: [
          { required: true, trigger: "blur", message: "请输入旧的密码" },
          { min: 6, max: 16, message: "长度在6到16个字符", trigger: "blur" }
        ],
        newPass: [
          { validator: validateNewPass, trigger: "blur" },
          { min: 6, max: 16, message: "长度在6到16个字符", trigger: "blur" }
        ],
        checkPass: [
          { validator: validateNewPass2, trigger: "blur" },
          { min: 6, max: 16, message: "长度在6到16个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getInfo().then(({ data }) => {
        this.ruleForm.name = data.name;
        this.ruleForm.loginId = data.loginId;
      });
    },
    // 表单校验
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          setInfo(this.ruleForm).then(res => {
            //判断旧密码是否正确
            if (typeof res == "string") {
              this.$message.error(JSON.parse(res).msg);
            } else {
              // 密码修改成功后退出登录，跳转到登录页面重新登录
              this.$message.success("修改密码成功");
              this.$store.dispatch("user/userLogout").then(() => {
                this.$router.push(`/login?redirect=${this.$route.fullPath}`);
              });
            }
          });
        } else {
          this.$message.error("输入框内容不能为空");
          return false;
        }
      });
    },
    // 重置表单
    resetForm(ruleForm) {
      this.$refs[ruleForm].resetFields();
      this.fetchData();
    }
  }
};
</script>

<style lang="scss" scoped>
.inputText {
  width: 30%;
}
</style>
