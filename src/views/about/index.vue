<template>
  <div class="app-container">
    <div class="text">关于我</div>
    <el-input :disabled="isDisabled" v-model="url"></el-input>
    <div>
      <el-button style="margin-top: 15px" type="primary" @click="clickHandle">{{
        buttonText
      }}</el-button>
    </div>
  </div>
</template>

<script>
import { getAbout, setAbout } from "@/api/about";
export default {
  data() {
    return {
      url: "",
      buttonText: "编辑",
      isDisabled: true
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getAbout().then(({ data }) => {
        this.url = data;
      });
    },
    clickHandle() {
      if (this.buttonText === "编辑") {
        // 开始编辑
        this.buttonText = "完成";
        this.isDisabled = !this.isDisabled;
      } else {
        if (this.url) {
          // 编辑完成
          this.buttonText = "编辑";
          this.isDisabled = !this.isDisabled;
          setAbout({ url: this.url }).then(res => {
            this.$message.success("编辑成功");
          });
        } else {
          this.$message.warning("输入框不能为空");
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
