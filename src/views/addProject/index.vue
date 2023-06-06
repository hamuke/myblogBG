<template>
  <div class="app-container">
    <div class="text">项目名称</div>
    <el-input v-model="form.title" placeholder="请输入项目的名称"></el-input>

    <!-- 项目描述 -->
    <!-- 接口中的description返回的是数组 -->
    <div class="text">项目描述1</div>
    <el-input
      v-model="form.description[0]"
      placeholder="请输入项目描述"
    ></el-input>
    <div class="text">项目描述2</div>
    <el-input
      v-model="form.description[1]"
      placeholder="请输入项目描述"
    ></el-input>
    <div class="text">项目描述3</div>
    <el-input
      v-model="form.description[2]"
      placeholder="请输入项目描述"
    ></el-input>

    <!-- 项目链接 -->
    <div class="text">项目链接</div>
    <el-input v-model="form.url" placeholder="请输入项目的链接"></el-input>

    <!-- github地址 -->
    <div class="text">github地址</div>
    <el-input
      v-model="form.github"
      placeholder="请输入项目的github地址"
    ></el-input>

    <div class="text">预览图</div>
    <ImgUpload uploadTitle="项目预览图地址" v-model="form.thumb"></ImgUpload>

    <div class="text">项目等级</div>
    <el-select v-model="form.order" placeholder="项目等级">
      <el-option label="1" value="1"></el-option>
      <el-option label="2" value="2"></el-option>
      <el-option label="3" value="3"></el-option>
      <el-option label="4" value="4"></el-option>
      <el-option label="5" value="5"></el-option>
    </el-select>

    <div>
      <el-button
        style="margin-top: 15px"
        type="primary"
        @click="addProjectHandle"
        >发布项目</el-button
      >
    </div>
  </div>
</template>

<script>
import ImgUpload from "@/components/ImgUpload/index.vue";
import { addProject } from "@/api/project";
export default {
  data() {
    return {
      form: {
        //需要编辑的内容表单
        title: "",
        description: [],
        url: "",
        github: "",
        thumb: "",
        order: 1
      }
    };
  },
  components: {
    ImgUpload
  },
  methods: {
    addProjectHandle() {
      let obj = { ...this.form };
      obj.order = parseInt(obj.order);
      if (obj.title && obj.description && obj.url && obj.github) {
        addProject(obj).then(() => {
          this.$router.push("/projectList");
          this.$message.success("项目添加成功！");
        });
      } else {
        this.$message.error("内容不能为空，请检查填写内容");
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
